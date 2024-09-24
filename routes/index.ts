import express, { Request, Response, NextFunction } from 'express';
const router = express.Router();

router.get('/customer.jade', (req: Request, res: Response, next: NextFunction) => {
  res.render('index', { title: 'Express' });
});

export default router;