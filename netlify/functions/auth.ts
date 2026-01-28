import { Handler } from '@netlify/functions';
import { AuthService } from '../lib/services/auth.service';
import { successResponse, errorResponse, parseBody, getUserFromEvent } from '../lib/utils';

const authService = new AuthService();

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

    const path = event.path.replace('/.netlify/functions/auth', '');

    try {
        // POST /login
        if (event.httpMethod === 'POST' && path === '/login') {
            const body = parseBody(event);
            const result = await authService.login(body);
            return successResponse(result, 'Login successful');
        }

        // POST /register (requires ENCARGADO auth)
        if (event.httpMethod === 'POST' && path === '/register') {
            const user = getUserFromEvent(event);
            if (!user || user.rol !== 'ENCARGADO') {
                return errorResponse('Unauthorized - Only ENCARGADO can register users', 403);
            }
            const body = parseBody(event);
            const result = await authService.register(body);
            return successResponse(result, 'User registered successfully', 201);
        }

        // GET /me
        if (event.httpMethod === 'GET' && path === '/me') {
            const user = getUserFromEvent(event);
            if (!user) {
                return errorResponse('Not authenticated', 401);
            }
            return successResponse(user, 'Current user data');
        }

        // POST /cambiar-password
        if (event.httpMethod === 'POST' && path === '/cambiar-password') {
            const user = getUserFromEvent(event);
            if (!user) {
                return errorResponse('Unauthorized', 401);
            }
            const body = parseBody(event);
            await authService.changePassword(user.userId, body);
            return successResponse(null, 'Contraseña actualizada correctamente');
        }

        return errorResponse('Not Found', 404);
    } catch (error: any) {
        console.error('Auth function error:', error);
        return errorResponse(error.message || 'Internal server error', 500);
    }
};
