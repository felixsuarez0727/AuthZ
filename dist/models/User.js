"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTestUsers = exports.getAllUsers = exports.addUser = exports.findUserByEmail = exports.findOrCreateUser = void 0;
let users = [];
const findOrCreateUser = (email, role) => {
    let user = users.find(u => u.email === email);
    if (!user) {
        user = { id: String(users.length + 1), email, role };
        users.push(user);
    }
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
const findUserByEmail = (email) => {
    return users.find(u => u.email === email);
};
exports.findUserByEmail = findUserByEmail;
const addUser = (email, role) => {
    const newUser = { id: String(users.length + 1), email, role };
    users.push(newUser);
    return newUser;
};
exports.addUser = addUser;
const getAllUsers = () => {
    return users;
};
exports.getAllUsers = getAllUsers;
const initializeTestUsers = () => {
    if (users.length === 0) {
        (0, exports.addUser)("usuario1@example.com", "customer");
        (0, exports.addUser)("usuario2@example.com", "admin");
        (0, exports.addUser)("yosineygonzalez@gmail.com", "admin");
        console.log("Usuarios de prueba inicializados");
    }
};
exports.initializeTestUsers = initializeTestUsers;
