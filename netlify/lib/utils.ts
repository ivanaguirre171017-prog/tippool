import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export interface NetlifyResponse {
    statusCode: number;
    headers?: Record<string, string>;
    body: string;
}

export const successResponse = (data: any, message: string = 'Success', statusCode: number = 200): NetlifyResponse => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        body: JSON.stringify({
            success: true,
            message,
            data,
        }),
    };
};

export const errorResponse = (message: string, statusCode: number = 500, errors?: any): NetlifyResponse => {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        },
        body: JSON.stringify({
            success: false,
            message,
            errors,
        }),
    };
};

export const parseBody = (event: HandlerEvent): any => {
    try {
        return event.body ? JSON.parse(event.body) : {};
    } catch (error) {
        return {};
    }
};

export const getAuthToken = (event: HandlerEvent): string | null => {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
};
