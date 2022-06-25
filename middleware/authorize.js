const { expressjwt } = require('express-jwt');
const dotenv = require("dotenv");
dotenv.config();
const secret  = process.env.JWT_SECRET;

module.exports = authorize;

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return [
        expressjwt({ secret, algorithms: ['HS256'] }),

        (req, res, next) => {
            if (roles.length && !roles.includes(req.auth.role)) {
                return res.status(401).json({ status:"FALSE", message: 'Unauthorized', data:[] });
            }

            next();
        }
    ];
}