const { expressjwt } = require("express-jwt");
const secret = process.env.JWT_SECRET;

module.exports = authorize;

function authorize(roles = []) {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return [
    expressjwt({ secret, algorithms: ["HS256"] }),

    (err, req, res, next) => {
      if (err.name === "UnauthorizedError") {
        return res
          .status(401)
          .json({ status: false, message: err.message, data: [] });
      }

      if (roles.length && !roles.includes(req.auth.role)) {
        return res
          .status(401)
          .json({ status: false, message: "You are not authorized user", data: [] });
      }

      next();
    },
  ];
}
