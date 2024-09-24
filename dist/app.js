"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const users_1 = __importDefault(require("./routes/users"));
const User_1 = require("./models/User");
const User_2 = require("./models/User");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, User_1.initializeTestUsers)();
// Configuración de la aplicación
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, 'front')));
// Configuración de sesión
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || 'tu_secreto_aqui',
    resave: false,
    saveUninitialized: false
}));
// Inicialización de Passport
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// Configuración de la estrategia de Google
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: "http://localhost:3000/auth/google/create"
}, function (accessToken, refreshToken, profile, done) {
    var _a;
    const email = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0].value;
    if (!email) {
        return done(new Error('No se pudo obtener el email'));
    }
    const user = (0, User_2.findUserByEmail)(email);
    if (user) {
        return done(null, user);
    }
    else {
        return done(null, false, { message: 'Usuario no registrado' });
    }
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user.email);
});
passport_1.default.deserializeUser((email, done) => {
    const user = (0, User_2.findUserByEmail)(email);
    if (user) {
        done(null, user);
    }
    else {
        done(new Error('Usuario no encontrado'), null);
    }
});
// Middleware para verificar autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
app.get('/login', (req, res) => {
    res.send(`
    <script>
      alert('Usuario no registrado. Por favor, regístrese primero.');
      window.location.href = '/';
    </script>
  `);
});
// Middleware para verificar roles
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        }
        else {
            res.status(403).send('Acceso denegado');
        }
    };
};
// Rutas de autenticación
app.get('/auth/google', passport_1.default.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/create', passport_1.default.authenticate('google', { failureRedirect: '/login', failureMessage: true }), function (req, res) {
    res.redirect('/welcome');
});
// Ruta para el registro
app.post('/register', (req, res) => {
    const { email, role } = req.body;
    if (!email || !role) {
        return res.status(400).json({ error: 'Email y rol son requeridos' });
    }
    const user = (0, User_2.findOrCreateUser)(email, role);
    req.login(user, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error al iniciar sesión' });
        }
        res.json({ message: 'Usuario registrado exitosamente', user });
    });
});
// Endpoints protegidos
app.get('/api/customer', ensureAuthenticated, checkRole('customer'), (req, res) => {
    res.json({ message: 'Bienvenido, cliente!' });
});
app.get('/api/admin', ensureAuthenticated, checkRole('admin'), (req, res) => {
    res.json({ message: 'Bienvenido, administrador!' });
});
app.get('/welcome', ensureAuthenticated, (req, res) => {
    const user = req.user;
    res.json({
        email: user.email,
        role: user.role
    });
});
// Usar el router de usuarios
app.use('/users', users_1.default);
// Ruta catch-all para el frontend
app.get('*', (req, res) => {
    if (req.path === '/welcome') {
        res.sendFile(path_1.default.join(__dirname, 'front', 'welcome.html'));
    }
    else {
        res.sendFile(path_1.default.join(__dirname, 'front', 'Login.html'));
    }
});
// Middleware de manejo de errores de autenticación
app.use((err, req, res, next) => {
    if (err.name === 'AuthenticationError') {
        res.status(401).json({ error: 'Autenticación fallida' });
    }
    else {
        next(err);
    }
});
// Manejo de errores 404
app.use((req, res, next) => {
    next((0, http_errors_1.default)(404));
});
// Manejo de errores general
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
exports.default = app;
