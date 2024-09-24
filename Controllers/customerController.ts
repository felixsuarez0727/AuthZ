import { Request, Response } from 'express';
import { AuthRequest } from '../models/AuthRequest'; // Usamos el modelo AuthRequest

export const customerDashboard = (req: AuthRequest, res: Response) => {
  const user = req.user;

  if (!user || user.role !== 'customer') {
    return res.status(403).json({ message: 'No tienes acceso a esta página' });
  }

  res.render('customer', { user });
};