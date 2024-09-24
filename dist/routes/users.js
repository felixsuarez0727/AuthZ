"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Middleware para verificar autenticación
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'No autenticado' });
}
// Ruta para obtener el rol del usuario
router.get('/', ensureAuthenticated, (req, res) => {
    if (req.user) {
        res.json({ role: req.user.role });
    }
    else {
        res.status(401).json({ error: 'No autenticado' });
    }
});
exports.default = router;
