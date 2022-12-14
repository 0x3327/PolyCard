const bcrypt = require('bcrypt');
require("dotenv").config();

const AuthService = {
    calculatePasswordHash: async (_password, _salt) => {
        const hash = await bcrypt.hash(_password, _salt)
        return hash;
    },

    securePassword: async (_password) => {
        const rounds = parseInt(process.env.PASSWORD_ROUNDS);
        const salt = await bcrypt.genSalt(rounds);

        const hash = await AuthService.calculatePasswordHash(_password, salt);

        return { hash, rounds, salt }
    },

    verifyPassword: async (_password, _hash, _salt) => {
        const hash = await AuthService.calculatePasswordHash(_password, _salt);
        return hash === _hash;
    },
}

module.exports = AuthService;