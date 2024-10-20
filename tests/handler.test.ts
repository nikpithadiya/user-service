import { createUser, getUser, updateUser, deleteUser } from '../services/userHandler';
import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
jest.mock('aws-sdk');

const mockPut = jest.fn();
const mockGet = jest.fn();
const mockUpdate = jest.fn();
const mockDelete = jest.fn();

(DynamoDB.DocumentClient.prototype.put as jest.Mock) = mockPut;
(DynamoDB.DocumentClient.prototype.get as jest.Mock) = mockGet;
(DynamoDB.DocumentClient.prototype.update as jest.Mock) = mockUpdate;
(DynamoDB.DocumentClient.prototype.delete as jest.Mock) = mockDelete;

describe('User Handler', () => {
    const mockEvent: APIGatewayProxyEvent = {
        body: JSON.stringify({ userId: '123', name: 'John Doe', email: 'john@example.com', dob: '1990-01-01' }),
        pathParameters: { userId: '123' },
        httpMethod: 'POST', 
        resource: '/users', 
        headers: {},
        multiValueHeaders: {},
        queryStringParameters: null,
        multiValueQueryStringParameters: null,
        path: '/users',
        stageVariables: null,
        requestContext: {
            accountId: process.env.AWS_ACCOUNT_ID as string,
            apiId: process.env.AWS_ACCESS_KEY_ID as string,
            authorizer: {},
            httpMethod: 'POST',
            identity: {
                accessKey: process.env.AWS_ACCESS_KEY_ID as string,
                accountId: process.env.AWS_ACCOUNT_ID as string,
                caller: null,
                sourceIp: '127.0.0.1',
                user: null,
                userAgent: 'PostmanRuntime/7.28.4',
                userArn: null,
                apiKey: null,
                apiKeyId: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null
            },
            path: '/users',
            stage: 'dev',
            requestId: 'c2q65g8ng0',
            resourceId: 'resource-id',
            resourcePath: '/users',
            protocol: '',
            requestTimeEpoch: 0
        },
        isBase64Encoded: false,
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('createUser should return 201', async () => {
        mockPut.mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({}) });

        const result: APIGatewayProxyResult = await createUser(mockEvent);

        expect(result.statusCode).toBe(201);
        expect(JSON.parse(result.body)).toEqual({ userId: '123', name: 'John Doe', email: 'john@example.com', dob: '1990-01-01' });
    });

    test('getUser should return 200 and user data', async () => {
        mockGet.mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({ Item: { userId: '123', name: 'John Doe', email: 'john@example.com' } }) });

        const result: APIGatewayProxyResult = await getUser({ ...mockEvent, httpMethod: 'GET' });

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ userId: '123', name: 'John Doe', email: 'john@example.com' });
    });

    test('updateUser should return 200', async () => {
        mockUpdate.mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({}) });

        const result: APIGatewayProxyResult = await updateUser({ ...mockEvent, httpMethod: 'PUT' });

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ message: 'User with userId 123 updated successfully.' });
    });

    test('deleteUser should return 200', async () => {
        mockDelete.mockReturnValueOnce({ promise: jest.fn().mockResolvedValueOnce({}) });
        const result: APIGatewayProxyResult = await deleteUser({ ...mockEvent, httpMethod: 'DELETE' });
        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({ message: 'User with userId 123 deleted successfully.' });
    });
});
