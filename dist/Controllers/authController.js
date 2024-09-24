"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleLogin = void 0;
const googleAuth_1 = require("../Controllers/googleAuth");
const googleLogin = (req, res) => {
    const user = req.user; // El usuario autenticado ya tiene un tipo definido
    if (user) {
        const token = (0, googleAuth_1.signToken)(user);
        res.json({ token });
    }
    else {
        res.status(401).json({ message: 'Authentication failed' });
    }
};
exports.googleLogin = googleLogin;
