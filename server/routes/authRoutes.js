const express = require("express");

const router = express.Router();

const authMiddleware =
  require("../middleware/authMiddleware");

const {
  syncUser,
} = require("../controllers/authController");

router.post(
  "/sync-user",
  (req, res, next) => {

    console.log("SYNC ROUTE HIT");

    next();

  },
  authMiddleware,
  syncUser
);

module.exports = router;