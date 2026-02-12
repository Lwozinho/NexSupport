import { Request, Response } from 'express';
import { DashboardMetricService } from '../services/DashboardMetricService';

class DashboardMetricController {
  async handle(req: Request, res: Response) {
    const dashboardMetricService = new DashboardMetricService();
    const metrics = await dashboardMetricService.execute();
    return res.json(metrics);
  }
}

export { DashboardMetricController }