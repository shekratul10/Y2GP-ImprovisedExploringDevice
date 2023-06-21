
#include <AccelStepper.h>
#include <ESP32SPISlave.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define BUFFER_SIZE 32
uint8_t spi_slave_tx_buf[BUFFER_SIZE];
uint8_t spi_slave_rx_buf[BUFFER_SIZE];

ESP32SPISlave slave;
StaticJsonDocument<256> telemetryJson;
StaticJsonDocument<128> commandJson; // Incoming commands from the server

const char *ssid = "H-P7";
const char *pwd = "testing123";
#define SERVER_API_BASE "13.40.214.221"
#define TELEMETRY_ENDPOINT "/telemetry/update"
#define MAP_ADD_ENDPOINT "/map/add"
#define NODE_ADD_ENDPOINT "/map/add_node"
#define EDGE_ADD_ENDPOINT "/map/add_edge"
#define DISTANCE_PER_STEP 0.102101761 //cm
#define SEGWAY_WIDTH 17.5 //cm
#define STEP_INCREMENT 10
#define MICROSTEP_FACTOR 16

const int ldrPin1 = 25;
const int ldrPin2 = 33;
const int ldrPin3 =  32;
// const int ldrPin4 = ;

// LDR thresholds
const int maxThreshold = 590;
const int minThreshold = 180;
const int frontThreshold = 360;

// Motor pin definitions
const int motorLeftStepPin = 26;
const int motorLeftDirPin = 27;
const int motorRightStepPin = 12;
const int motorRightDirPin = 14;

// Adjust if needed, probably not though.
const int stepDelay = 200;

// Create instances of AccelStepper for the two motors
AccelStepper motorLeft(AccelStepper::DRIVER, motorLeftStepPin, motorLeftDirPin);
AccelStepper motorRight(AccelStepper::DRIVER, motorRightStepPin, motorRightDirPin);

enum Endpoint
{
    telemetry_update,
    telemetry_add,
    map_add,
    node_add,
    edge_add,
};

enum State
{
    STOP,
    START,
    MAPPING,
    SENDING_NODE,
};

volatile int stepsL = 0;
volatile int stepsR = 0;

struct Position
{
    float x;
    float y;
    float angle; //Radians +ve is clockwise 0 is facing positive y axis
};

// All these are volatile to prevent the compiler from optimizing and buffering them
volatile int data; //SPI data
volatile bool spi_data_flag = false;
volatile Position position;
volatile int stepsSinceLastNode;
volatile State state;
int previousNode;

void updatePosition(int steps)
{
    position.y += steps * cos(position.angle) * DISTANCE_PER_STEP;
    position.x += steps * sin(position.angle) * DISTANCE_PER_STEP;
    telemetryJson["position"]["x"] = position.x;
    telemetryJson["position"]["y"] = position.y;
    stepsSinceLastNode += steps;
}

void updateAngle(int stepsR, int stepsL){
    float angleDelta = (stepsL - stepsR) * DISTANCE_PER_STEP / SEGWAY_WIDTH; //Clockwise is positive
    position.angle = position.angle += angleDelta;
    if(position.angle > 360)
        position.angle -= 360;
    else if(position.angle < 0)
        position.angle += 360;
    position.x += sin(angleDelta);
    position.y += cos(angleDelta);
}

void navigate(){
    int rightLDR = analogRead(ldrPin1); // 0-4095
    int frontLDR = analogRead(ldrPin2);
    int leftLDR = analogRead(ldrPin3);
    
    // Initialise at 0
    stepsL = 0;
    stepsR = 0;
    if (rightLDR > minThreshold && leftLDR > minThreshold && frontLDR > frontThreshold)
    {
        // rotate until exited dead end
        stepsL = -STEP_INCREMENT * MICROSTEP_FACTOR; //Microstep factor as each step is a fraction of a normal step
        stepsR = STEP_INCREMENT * MICROSTEP_FACTOR;

    }
    else if (rightLDR < minThreshold)
    { //
        // turn right
        // adjust course so that threshold value is within range
        // take account of turning angle if its beyond angle threshold it means its a full roation
        //  depending on the degree of the turn its either a junciton or corner
        //  if either genertae node using current rover position and update edge from previous node
        stepsL = STEP_INCREMENT * MICROSTEP_FACTOR;
        stepsR = 0;
    }

    else if (frontLDR > frontThreshold && rightLDR > minThreshold)
    {
        // turn left
        stepsL = 0;
        stepsR = STEP_INCREMENT * MICROSTEP_FACTOR;
        position.angle -= 3.342;
    }
    else if (leftLDR > maxThreshold)
    {
        stepsL= STEP_INCREMENT * MICROSTEP_FACTOR;
        stepsR = 0;
        position.angle += 3.342;
    }
    else if (rightLDR > minThreshold && rightLDR < maxThreshold)
    {
        // keep updating edge with time(millis) or distance(revolution)
        // move forward
        stepsL = STEP_INCREMENT * MICROSTEP_FACTOR;
        stepsR = STEP_INCREMENT * MICROSTEP_FACTOR;
        updatePosition(STEP_INCREMENT);
    }

    else if (rightLDR > maxThreshold)
    {
        // adjust left
        stepsL = 0;
        stepsR = STEP_INCREMENT * MICROSTEP_FACTOR;
    }
    updateAngle(stepsR, stepsL); 

}

void setup()
{
    Serial.begin(115200);

    // Enable SPI for FPGA
    slave.setDataMode(SPI_MODE0);
    // VSPI = CS:  5, CLK: 18, MOSI: 23, MISO: 19
    slave.begin(VSPI);
    // clear buffers
    memset(spi_slave_tx_buf, 0, BUFFER_SIZE);
    memset(spi_slave_rx_buf, 0, BUFFER_SIZE);

    // Connect to wifi
    WiFi.begin(ssid, pwd);
    Serial.println("Connecting");
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }
    Serial.println("");
    Serial.print("Connected to WiFi network with IP Address: ");
    Serial.println(WiFi.localIP());
    delay(2000);

    //  Initialize Json Variables
    telemetryJson["id"] = -1;
    telemetryJson["position"]["x"] = 0;
    telemetryJson["position"]["y"] = 0;
    telemetryJson["gyroscope"]["x"] = 0;
    telemetryJson["gyroscope"]["y"] = 0;
    telemetryJson["gyroscope"]["z"] = 0;
    telemetryJson["accelerometer"]["x"] = 0;
    telemetryJson["accelerometer"]["y"] = 0;
    telemetryJson["accelerometer"]["z"] = 0;
    telemetryJson["steps"] = 0;
    telemetryJson["state"] = "stop";

    Serial.println("Getting ID from the server");
    ServerRequest(telemetry_add, "");
    Serial.print("ID: ");
    serializeJson(telemetryJson["id"],Serial);
    
    // Initialize motor pins
    pinMode(motorLeftStepPin, OUTPUT);
    pinMode(motorLeftDirPin, OUTPUT);
    pinMode(motorRightStepPin, OUTPUT);
    pinMode(motorRightDirPin, OUTPUT);

    // Configure motor properties
    motorLeft.setMaxSpeed(1000);
    motorLeft.setAcceleration(500);
    motorRight.setMaxSpeed(1000);
    motorRight.setAcceleration(500);
}

void loop()
{
    // if there is no SPI transaction in queue, add transaction
    if (slave.remained() == 0){
        slave.queue(spi_slave_rx_buf, spi_slave_tx_buf, BUFFER_SIZE);
    }
    while (slave.available())
    {
        // read spi data from buffer
        data = spi_slave_rx_buf[0];
        data = data | spi_slave_rx_buf[1] << 8;
        data = data | spi_slave_rx_buf[2] << 16;
        data = data | spi_slave_rx_buf[3] << 24;

        spi_data_flag = true;
        slave.pop();
    }
    // Handle SPI data
    if (spi_data_flag)
    {
        Serial.println(data);
        spi_data_flag = false;
    }

    // State machine
    if (state != STOP)
    {
        navigate();
        moveMotors();
    }
    
    // Send telemetry data to server
    ServerRequest(telemetry_update, "");
}

void moveMotors(){
    motorLeft.move(stepsL);
    motorRight.move(-stepsR);
    while(motorLeft.distanceToGo() != 0 || motorRight.distanceToGo() != 0){
        motorLeft.run();
        motorRight.run();
    }
}

char* httpPOSTRequest(const char *url, char* payload)
{
    WiFiClient client;
    HTTPClient http;

    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    int responseCode = http.POST(payload);
    if (responseCode == 200)
    {
        Serial.print(responseCode);
        Serial.println(" [SUCCESSFUL]");
        String resp = http.getString();
        if (resp != "")
        {
            // Convert the string to a char pointer
            char *rsp_char = &resp[0];
            Serial.println(rsp_char);
            http.end();
            return rsp_char;
        }
    }
    else
    {
        Serial.print(responseCode);
        Serial.println(" [ERROR]");
    }
    http.end();
    return "";
}

char* ServerRequest(Endpoint endpoint, char *payload)
{
    switch (endpoint)
    {
    case telemetry_update:
    {
        char json[128];
        serializeJson(telemetryJson, json);
        char* resp;
        resp = httpPOSTRequest(SERVER_API_BASE TELEMETRY_ENDPOINT, json);
        if (json == "")
            return "";
        deserializeJson(commandJson, resp); // There will be a command embedded in the response if there is a new command
        state = commandJson["state"];
        return json;
    }
    break;
    case telemetry_add:
    {
        char json[128];
        serializeJson(telemetryJson, json);
        char* resp;
        resp = httpPOSTRequest(SERVER_API_BASE TELEMETRY_ENDPOINT, json);
        if (json == "")
            return "";
        deserializeJson(commandJson, resp); // In this case the command is the rover's ID (just reusing commandjson to save on memory)
        telemetryJson["id"] = commandJson["id"];
        return json;
    }
    case map_add:
        return httpPOSTRequest(SERVER_API_BASE MAP_ADD_ENDPOINT, payload);
        break;
    case node_add:
        return httpPOSTRequest(SERVER_API_BASE NODE_ADD_ENDPOINT, payload);
        break;
    case edge_add:
        return httpPOSTRequest(SERVER_API_BASE EDGE_ADD_ENDPOINT, payload);
        break;
    }

}

// FIXME: NO IDEA IF THIS WILL WORK OR NOT THE API IS NOT DONE YET
void AddNode()
{
    // Add the newly created node to the map
    StaticJsonDocument<256> doc;
    doc["x"] = position.x;
    doc["y"] = position.y;
    doc["map_id"] = 1;
    char json[128]; 
    serializeJson(doc, json);
    int nodeId = std::stoi(ServerRequest(node_add, json)); //Node ID should be the response

    // Connect the new node to the previous node
    if (nodeId != -1)
    {
        doc.clear();
        doc["map_id"] = 1;
        doc["source_node_id"] = previousNode;
        doc["target_node_id"] = nodeId;
        doc["weight"] = stepsSinceLastNode;
        serializeJson(doc, json);
        ServerRequest(edge_add, json);
    }
    stepsSinceLastNode = 0;
}
