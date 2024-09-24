"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (roles) => {
    return (req, res, next) => {
        const user = req.user; // Ahora el tipo de req.user está claramente definido
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    };
};
exports.checkRole = checkRole;
