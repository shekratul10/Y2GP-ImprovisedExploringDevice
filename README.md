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
        "rover_id": int, // id of rover
    }
    ```

* Response:

    ```javascript
    {
        "status": str, // "success"
        "message": str // success message
        "telemetry": str // telemetry json
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
        "map_id": int, // id of map
    }
    ```

* Response:
  * `200 OK`: correct request

    ```javascript
    {
        "status": str, // "success"
        "message": str // success message
        "map": str // map json
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
      "position": str // position json
      "accelerometer": str // accelerometer json
      "gyroscope": str // gyro json
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
      "position": str // position json
      "accelerometer": str // accelerometer json
      "gyroscope": str // gyro json
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
    
