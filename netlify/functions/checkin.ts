import { Handler } from '@netlify/functions';
import { CheckInService } from '../lib/services/checkin.service';
import { successResponse, errorResponse, getUserFromEvent } from '../lib/utils';

const checkInService = new CheckInService();

export const handler: Handler = async (event, context) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            },
            body: '',
        };
    }

    const user = getUserFromEvent(event);
    if (!user) {
        return errorResponse('Unauthorized', 401);
    }

    const path = event.path.replace('/.netlify/functions/checkin', '');

    try {
        // POST /entrada
        if (event.httpMethod === 'POST' && path === '/entrada') {
            const result = await checkInService.checkIn(user.userId);
            return successResponse(result, 'Check-in exitoso', 201);
        }

        // POST /salida
        if (event.httpMethod === 'POST' && path === '/salida') {
            const result = await checkInService.checkOut(user.userId);
            return successResponse(result, 'Check-out exitoso');
        }

        // GET /mis-checkins
        if (event.httpMethod === 'GET' && path === '/mis-checkins') {
            const history = await checkInService.getHistory(user.userId);
            return successResponse(history, 'Check-in history');
        }

        // GET /fecha/:fecha (ENCARGADO only)
        const fechaMatch = path.match(/^\/fecha\/(.+)$/);
        if (event.httpMethod === 'GET' && fechaMatch) {
            if (user.rol !== 'ENCARGADO') {
                return errorResponse('Forbidden - ENCARGADO only', 403);
            }
            const fecha = fechaMatch[1];
            const results = await checkInService.getByDate(fecha);
            return successResponse(results, 'Check-ins by date');
        }

        return errorResponse('Not Found', 404);
    } catch (error: any) {
        console.error('CheckIn function error:', error);
        return errorResponse(error.message || 'Internal server error', 500);
    }
};
