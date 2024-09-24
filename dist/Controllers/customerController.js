"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerDashboard = void 0;
const customerDashboard = (req, res) => {
    const user = req.user;
    if (!user || user.role !== 'customer') {
        return res.status(403).json({ message: 'No tienes acceso a esta página' });
    }
    res.render('customer', { user });
};
exports.customerDashboard = customerDashboard;
