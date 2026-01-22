import { Request, Response } from 'express';
import { PropinasService } from '../services/propinas.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { validateFields } from '../middlewares/validation.middleware';

const propinasService = new PropinasService();

export class PropinasController {
    async create(req: Request, res: Response) {
        try {
            const { monto, metodoPago } = req.body;
            const result = await propinasService.createPropina({ monto, metodoPago });
            return successResponse(res, result, 'Propina registrada', 201);
        } catch (error: any) {
            return errorResponse(res, error.message, 400);
        }
    }

    async list(req: Request, res: Response) {
        try {
            const filters = req.query;
            const results = await propinasService.getPropinas(filters);
            return successResponse(res, results);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching propinas', 500);
        }
    }

    async listPendientes(req: Request, res: Response) {
        try {
            const results = await propinasService.getPendientes();
            return successResponse(res, results);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching pending propinas', 500);
        }
    }
}
