import { Handler } from '@netlify/functions';
import { RepartoService } from '../lib/services/reparto.service';
import { successResponse, errorResponse, parseBody, getUserFromEvent } from '../lib/utils';

const repartoService = new RepartoService();

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

    const path = event.path.replace('/.netlify/functions/reparto', '');

    try {
        // POST /calcular (ENCARGADO only)
        if (event.httpMethod === 'POST' && path === '/calcular') {
            if (user.rol !== 'ENCARGADO') {
                return errorResponse('Forbidden - ENCARGADO only', 403);
            }
            const body = parseBody(event);
            const { fecha } = body;
            if (!fecha) {
                return errorResponse('Fecha requerida (YYYY-MM-DD)', 400);
            }
            const result = await repartoService.calcularReparto(fecha);
            return successResponse(result, 'Reparto calculado ejecutado exitosamente');
        }

        // GET /mis-repartos
        if (event.httpMethod === 'GET' && path === '/mis-repartos') {
            const fechaDesde = event.queryStringParameters?.fechaDesde;
            const result = await repartoService.getMisRepartos(user.userId, fechaDesde);
            return successResponse(result, 'My distributions');
        }

        // GET /historial (ENCARGADO only)
        if (event.httpMethod === 'GET' && path === '/historial') {
            if (user.rol !== 'ENCARGADO') {
                return errorResponse('Forbidden - ENCARGADO only', 403);
            }
            const fecha = event.queryStringParameters?.fecha;
            const result = await repartoService.getHistorial(fecha);
            return successResponse(result, 'Distribution history');
        }

        // GET /detalle/:id
        const detalleMatch = path.match(/^\/detalle\/(.+)$/);
        if (event.httpMethod === 'GET' && detalleMatch) {
            const id = detalleMatch[1];
            const result = await repartoService.getDetalle(id);
            return successResponse(result, 'Distribution detail');
        }

        return errorResponse('Not Found', 404);
    } catch (error: any) {
        console.error('Reparto function error:', error);
        return errorResponse(error.message || 'Internal server error', 500);
    }
};
