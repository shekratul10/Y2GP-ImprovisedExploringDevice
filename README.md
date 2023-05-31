# Y2-GrProject-Web_App
Repository containing the Frontend and Backend Web Application as part of the 2nd year Group Project at Imperial College London

## API Documentation

### `/`

* Method: `N/A`
* Request: `N/A`
* Response: 

  ```html
    index.html
    ```


### `api/telemetry`

* Method: `GET`
* Request: 

  ```javascript
    {
        "?id=": int, // id of rover as param
    }
    ```

* Response:

    ```javascript
    {
        "position": [int], //coordinates x, y
        "accelerometer": [int], // x,y,z accel values
        "gyroscope": [int], // x,y,z gyro values
        "steps": int, // step count
        "state": str // current state
    }
    ```

  * `400 Bad Request`

    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```
    

### `/api/map`

* Method: `GET`
* Request:

    ```javascript
    {
        "?id=": int, // id of map as param
    }
    ```

* Response:
  * `200 OK`: correct request

    ```javascript
    {
        "map": json // map json
    }
    ```

  * `400 Bad Request`

    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```

### `/api/telemetry/add`

* Method: `POST`
* Request:

  ```javascript
  {
      "position": [int] // position json
      "accelerometer": [int] // accelerometer json
      "gyroscope": [int] // gyro json
      "steps": int
      "state": str // rover state 
  }
  ```

* Response:
  * `200 OK`

    ```javascript
    {
        "status": str, // "success"
        "message": str // success message
        "id": int // rover id
    }
    ```

  * `400 Bad Request`

    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```

### `/api/telemetry/update`

* Method: `POST`
* Request:

  ```javascript
  {
      "id": int // rover id
      "position": [int] // position json
      "accelerometer": [int] // accelerometer json
      "gyroscope": [int] // gyro json
      "steps": int
      "state": str // rover state 
  }
  ```

* Response:
  * `200 OK`

    ```javascript
    {
        "status": str, // "success",
        "message": str // success message
        "id": int // rover id
    }
    ```

  * `400 Bad Request`

    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```

### `/api/map/add`

* Method: `POST`
* Request:

  ```javascript
  {
      "map": str // map json
  }
  ```

* Response:
  * `200 OK`
  
    ```javascript
    {
        "status": str, // "success",
        "message": str // success message
    }
    ```

  * `400 Bad Request`
  
    ```javascript
    {
        "status": str, // "error",
        "type": str, // error type,
        "message": str // error message
    }
    ```

### `/api/map/update`

* Method: `GET`, `POST`, `PUT`
* Request:

  ```javascript
  { 
      "map": str // map json
  }
  ```

* Response:
  * `200 OK`

    ```javascript
    {
        "status": str, // "success",
        "message": str // success message
        }
    }
    ```

  * `400 Bad Request`
  
    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```
    ### `/api/path`

* Method: `POST`
* Request:

  ```javascript
  { 
      "path": str // shortest path through maze
  }
  ```

* Response:
  * `200 OK`

    ```javascript
    {
        "status": str, // "success"
        
        }
    }
    ```

  * `400 Bad Request`
  
    ```javascript
    {
        "status": str, // "error"
        "type": str, // error type
        "message": str // error message
    }
    ```
    
