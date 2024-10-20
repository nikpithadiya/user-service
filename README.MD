# User Service

A simple CRUD microservice for managing users, built with Node.js, TypeScript, and AWS Lambda.

## Setup and Deployment

1. Clone the repository:

   ```bash
   git clone git@github.com:nikpithadiya/user-service.git
   cd user-service

2. Install the dependencies:

    ```bash
    npm install

3. Create an .env file in the root directory of the project and add your AWS credentials:

    ```bash
    AWS_ACCESS_KEY_ID=your_access_key_id
    AWS_SECRET_ACCESS_KEY=your_secret_access_key
    AWS_ACCOUNT_ID=your_account_id
    AWS_REGION=your_preferred_region

4. Ensure you have the Serverless framework installed globally:

   ```bash
   npm install -g serverless

5. Deploy the service:

   ```bash
   serverless deploy

## Running Tests
    ```bash
    npm test

## API Endpoints

### Get All Users
- **GET** `/users`

### Create a User
- **POST** `/users`
- **Request Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "dob": "1990-01-01"
  }
  ```

### Get a User
- **GET** `/users/{userId}`
- **Path Parameters**:
  - `userId`: The ID of the user to retrieve.

### Update a User
- **PUT** `/users/{userId}`
- **Path Parameters**:
  - `userId`: The ID of the user to update.
- **Request Body**: 
  ```json
  {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "dob": "1990-01-02"
  }
  ```

### Delete a User
- **DELETE** `/users/{userId}`
- **Path Parameters**:
  - `userId`: The ID of the user to delete.


