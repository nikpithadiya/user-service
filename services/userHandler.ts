import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE || '';

// Create User
export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || '{}');
    const { name, email, dob } = requestBody;

    if (!name || !email || !dob) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields: name, email, dob.',
        }),
      };
    }

    // No need for userId from requestbody just added for running tests
    const userId = requestBody?.userId ?? randomUUID(); // Generate unique userId
    
    const newUser = {
      userId,
      name,
      email,
      dob,
    };

    await dynamoDb.put({
      TableName: USERS_TABLE,
      Item: newUser,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newUser),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

// Get user by id
export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.pathParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing userId in the path parameters.',
        }),
      };
    }

    const result = await dynamoDb.get({
      TableName: USERS_TABLE,
      Key: { userId },
    }).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `User with userId ${userId} not found.`,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error('Error retrieving user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

// Fetch all users
export const getAllUsers = async (): Promise<APIGatewayProxyResult> => {
  try {
    const result = await dynamoDb.scan({
      TableName: USERS_TABLE,
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error('Error retrieving users:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

// Update user by id
export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.pathParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing userId in the path parameters.',
        }),
      };
    }

    const requestBody = JSON.parse(event.body || '{}');
    const { name, email, dob } = requestBody;

    if (!name || !email || !dob) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing required fields: name, email, dob.',
        }),
      };
    }

    await dynamoDb.update({
      TableName: USERS_TABLE,
      Key: { userId },
      UpdateExpression: 'set #name = :name, email = :email, dob = :dob',
      ExpressionAttributeNames: { '#name': 'name' },
      ExpressionAttributeValues: {
        ':name': name,
        ':email': email,
        ':dob': dob,
      },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User with userId ${userId} updated successfully.`,
      }),
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};

// Delete user by id
export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const { userId } = event.pathParameters || {};

    if (!userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: 'Missing userId in the path parameters.',
        }),
      };
    }

    await dynamoDb.delete({
      TableName: USERS_TABLE,
      Key: { userId },
    }).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User with userId ${userId} deleted successfully.`,
      }),
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
      }),
    };
  }
};
