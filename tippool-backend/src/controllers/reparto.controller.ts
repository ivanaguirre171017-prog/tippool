import { Request, Response } from 'express';
import { RepartoService } from '../services/reparto.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { CustomRequest } from '../models/types';

const repartoService = new RepartoService();

export class RepartoController {
    async calcular(req: Request, res: Response) {
        try {
            const { fecha } = req.body;
            if (!fecha) return errorResponse(res, 'Fecha requerida (YYYY-MM-DD)', 400);

            const result = await repartoService.calcularReparto(fecha);
            return successResponse(res, result, 'Reparto calculado ejecutado exitosamente');
        } catch (error: any) {
            return errorResponse(res, error.message, 400);
        }
    }

    async misRepartos(req: CustomRequest, res: Response) {
        try {
            if (!req.user) return errorResponse(res, 'Unauthorized', 401);
            const { fechaDesde } = req.query;
            const result = await repartoService.getMisRepartos(req.user.userId, fechaDesde as string);
            return successResponse(res, result);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching distributions', 500);
        }
    }

    async historial(req: Request, res: Response) {
        try {
            const { fecha } = req.query;
            const result = await repartoService.getHistorial(fecha as string);
            return successResponse(res, result);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching history', 500);
        }
    }

    async detalle(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await repartoService.getDetalle(id);
            return successResponse(res, result);
        } catch (error: any) {
            return errorResponse(res, error.message, 404);
        }
    }
}
