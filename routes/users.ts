import express, { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';

const router = express.Router();

// Middleware para verificar autenticación
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'No autenticado' });
}

// Ruta para obtener el rol del usuario
router.get('/', ensureAuthenticated, (req: Request, res: Response) => {
  if (req.user) {
    res.json({ role: (req.user as User).role });
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
});

export default router;