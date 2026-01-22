import { Request, Response } from 'express';
import { CheckInService } from '../services/checkin.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { CustomRequest } from '../models/types';

const checkInService = new CheckInService();

export class CheckInController {
    async entry(req: CustomRequest, res: Response) {
        try {
            if (!req.user) return errorResponse(res, 'User not identified', 401);
            const result = await checkInService.checkIn(req.user.userId);
            return successResponse(res, result, 'Check-in exitoso', 201);
        } catch (error: any) {
            return errorResponse(res, error.message, 400);
        }
    }

    async exit(req: CustomRequest, res: Response) {
        try {
            if (!req.user) return errorResponse(res, 'User not identified', 401);
            const result = await checkInService.checkOut(req.user.userId);
            return successResponse(res, result, 'Check-out exitoso');
        } catch (error: any) {
            return errorResponse(res, error.message, 400);
        }
    }

    async history(req: CustomRequest, res: Response) {
        try {
            if (!req.user) return errorResponse(res, 'User not identified', 401);
            const history = await checkInService.getHistory(req.user.userId);
            return successResponse(res, history);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching history', 500);
        }
    }

    async byDate(req: Request, res: Response) {
        try {
            const { fecha } = req.params; // Expect YYYY-MM-DD
            const results = await checkInService.getByDate(fecha);
            return successResponse(res, results);
        } catch (error: any) {
            return errorResponse(res, 'Error fetching check-ins', 500);
        }
    }
}
