const { getAuth } =
  require("@clerk/express");

const authMiddleware =
  (req, res, next) => {

    const auth = getAuth(req);

    if (!auth.userId) {

      return res.status(401).json({
        error: "Unauthorized",
      });

    }

    req.auth = auth;

    next();

  };

module.exports =
  authMiddleware;