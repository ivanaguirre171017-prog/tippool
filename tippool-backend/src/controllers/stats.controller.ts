import { Request, Response } from 'express';
import { StatsService } from '../services/stats.service';
import { successResponse, errorResponse } from '../utils/response.util';

const statsService = new StatsService();

export class StatsController {
    async getDashboard(req: Request, res: Response) {
        try {
            const { periodo } = req.query;
            const stats = await statsService.getDashboardStats(periodo as any);
            return successResponse(res, stats);
        } catch (error: any) {
            console.error('Error al obtener estadísticas:', error);
            return errorResponse(res, 'Error al obtener estadísticas', 500);
        }
    }
}
