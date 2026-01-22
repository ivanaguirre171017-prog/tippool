import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.util';

export class SoporteController {
    async reportar(req: Request, res: Response) {
        try {
            const { tipo, descripcion, dispositivo, version } = req.body;

            // In a real app, this might send an email or save to a DB table 'bugs'
            console.log('BUG REPORT RECEIVED:', { tipo, descripcion, dispositivo, version });

            return successResponse(res, null, 'Reporte enviado correctamente');
        } catch (error: any) {
            return errorResponse(res, 'Error al enviar reporte', 500);
        }
    }
}
