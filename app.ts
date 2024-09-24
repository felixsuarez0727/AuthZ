import dotenv from 'dotenv';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import usersRouter from './routes/users';
import { initializeTestUsers } from './Controllers/userController';
import { findOrCreateUser, findUserByEmail } from './Controllers/userController';

dotenv.config();

const app = express();
initializeTestUsers();
app.use(express.static('public'));

// Application settings
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'front')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'GOOGLE_CLIENT_SECRET',
  resave: false,
  saveUninitialized: false
}));

//Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Google Strategy Settings
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: "http://localhost:3000/auth/google/create"
},
function(accessToken: string, refreshToken: string, profile: any, done: any) {
  const email = profile.emails?.[0].value;
  if (!email) {
    return done(new Error('Could not get email'));
  }
  const user = findUserByEmail(email);
  if (user) {
    return done(null, user);
  } else {
    return done(null, false, { message: 'Unregistered user' });
  }
}
));

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { email: string }).email);
});

passport.deserializeUser((email: string, done) => {
  const user = findUserByEmail(email);
  if (user) {
    done(null, user);
  } else {
    done(new Error('Usuario no encontrado'), null);
  }
});

// Middleware to verify authentication
function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.get('/login', (req: Request, res: Response) => {
  res.send(`
    <script>
      alert('Unregistered user. Please register first.');
      window.location.href = '/';
    </script>
  `);
});

// Middleware to verify roles
const checkRole = (role: 'customer' | 'admin') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && (req.user as { role: 'customer' | 'admin' }).role === role) {
      next();
    } else {
      res.status(403).send('Access denied');
    }
  };
};

// Authentication routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/create',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req: Request, res: Response) {
    res.redirect('/welcome');
  }
);

// Path for registration
app.post('/register', (req: Request, res: Response) => { 
  const { email, role } = req.body;

  if (!email || !role) {
    return res.status(400).json({ error: 'Email and role are required' });
  }

  const user = findOrCreateUser(email, role as 'customer' | 'admin');
  
  if (!user) {
    return res.status(409).json({ error: 'The email is already registered' });
  }

  req.login(user, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Login error' });
    }
    res.json({ message: 'successfully registered user', user });
  });
});

// Endpoints protected for the client
app.get('/api/customer', ensureAuthenticated, checkRole('customer'), (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'front', 'views/customer.html'));
});

app.get('/api/customer/data', ensureAuthenticated, checkRole('customer'), (req: Request, res: Response) => {
  const user = req.user as { email: string, role: 'customer' | 'admin' };
  res.json({
    email: user.email,
    role: user.role
  });
});

// Protected endpoints for the administrator
app.get('/api/admin', ensureAuthenticated, checkRole('admin'), (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'front', 'views/admin.html'));
});

app.get('/api/admin/data', ensureAuthenticated, checkRole('admin'), (req: Request, res: Response) => {
  const user = req.user as { email: string, role: 'customer' | 'admin' };
  res.json({
    email: user.email,
    role: user.role
  });
});

// Welcome route
app.get('/welcome', ensureAuthenticated, (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'front', 'views/welcome.html'));
});

app.get('/welcome/data', ensureAuthenticated, (req: Request, res: Response) => {
  const user = req.user as { email: string, role: 'customer' | 'admin' };
  res.json({ 
    email: user.email, 
    role: user.role 
  });
});

// Use the user router
app.use('/users', usersRouter);

// Catch-all route for the frontend
app.get('*', (req: Request, res: Response) => {
  if (req.path === '/welcome') {
    res.sendFile(path.join(__dirname, 'front', 'views/welcome.html'));
  } else {
    res.sendFile(path.join(__dirname, 'front', 'views/Login.html'));
  }
});

// Authentication error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'AuthenticationError') {
    res.status(401).json({ error: 'AuthenticationError' });
  } else {
    next(err);
  }
});

// 404 error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// General error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

// Path to logout
app.get('/logout', (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send('Logout error');
    }
    res.redirect('/'); 
  });
});

export default app;
