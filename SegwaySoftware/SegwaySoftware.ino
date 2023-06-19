
#include <ESP32SPISlave.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define BUFFER_SIZE 32
uint8_t spi_slave_tx_buf[BUFFER_SIZE];
uint8_t spi_slave_rx_buf[BUFFER_SIZE];

ESP32SPISlave slave;
DynamicJsonDocument telemetryJson(2048);
StaticJsonDocument<256> commandJson; // Incoming commands from the server

const char *ssid = "H-P7";
const char *pwd = "testing123";
#define SERVER_API_BASE "13.41.162.40"
#define TELEMETRY_ENDPOINT "/telemetry/update"
#define MAP_ENDPOINT "/map/update"
#define DISTANCE_PER_STEP 0.102101761

enum Endpoint
{
    telemetry_update,
    map_update,
};

enum State
{
    STOP,
    START,
    MAPPING,
    SENDING_NODE,
};

struct Position
{
    int x;
    int y;
    int angle;
};

volatile int data;
volatile bool spi_data_flag = false;
volatile Position position;
volatile int stepsSinceLastNode;
volatile State state;
int previousNode;

void updatePosition(int steps)
{
    position.x += steps * cos(position.angle) * DISTANCE_PER_STEP;
    position.y += steps * sin(position.angle) * DISTANCE_PER_STEP;
    telemetryJson["position"]["x"] = position.x;
    telemetryJson["position"]["y"] = position.y;
    stepsSinceLastNode += steps;
}

void setup()
{
    Serial.begin(115200);

    slave.setDataMode(SPI_MODE0);
    // VSPI = CS:  5, CLK: 18, MOSI: 23, MISO: 19
    slave.begin(VSPI);
    // clear buffers
    memset(spi_slave_tx_buf, 0, BUFFER_SIZE);
    memset(spi_slave_rx_buf, 0, BUFFER_SIZE);
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
    // TODO: GET ID FROM SERVER INSTEAD OF JUST SETTING IT HERE
    // Serial.println("Getting ID from the server");
    //  Initialize Json Variables
    telemetryJson["id"] = 1;
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
    AddNode(); //
}

void loop()
{
    // if there is no transaction in queue, add transaction
    if (slave.remained() == 0)
        slave.queue(spi_slave_rx_buf, spi_slave_tx_buf, BUFFER_SIZE);

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

    if (spi_data_flag)
    {
        Serial.println(data);
        spi_data_flag = false;
    }

    if (state != STOP)
    {
        // Movement code here
    }
}

String httpPOSTRequest(const char *url, const String payload)
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
            Serial.println(resp);
            http.end();
            return resp;
        }
    }
    else
    {
        Serial.print(responseCode);
        Serial.println(" [ERROR]");
        http.end();
        return "";
    }
}

String ServerRequest(Endpoint endpoint, const char *payload)
{
    switch (endpoint)
    {
    case telemetry_update:
    {
        String json;
        serializeJson(telemetryJson, json);
        json = httpPOSTRequest(SERVER_API_BASE TELEMETRY_ENDPOINT, json);
        if (json == "")
            return "";
        deserializeJson(commandJson, json); // There will be a command embedded in the response if there is a new command
        state = commandJson["state"];
        return json;
    }
    break;
    case map_update:
        return httpPOSTRequest(SERVER_API_BASE MAP_ENDPOINT, payload);
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
    String json;
    serializeJson(doc, json);
    int nodeId = ServerRequest(map_update, json.c_str()).toInt();

    // Connect the new node to the previous node
    if (nodeId != -1)
    {
        doc.clear();
        doc["map_id"] = 1;
        doc["source_node_id"] = previousNode;
        doc["target_node_id"] = nodeId;
        doc["weight"] = stepsSinceLastNode;
        serializeJson(doc, json);
        ServerRequest(map_update, json.c_str());
    }
    stepsSinceLastNode = 0;
}
