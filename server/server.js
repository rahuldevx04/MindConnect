const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");

const {
  clerkMiddleware,
} = require("@clerk/express");

dotenv.config();

const app = express();

// ======================
// MIDDLEWARES
// ======================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mindconnect.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use(helmet());

app.use(morgan("dev"));

app.use(clerkMiddleware());

// ======================
// ROUTES
// ======================

// AUTH ROUTES
app.use(
  "/api/auth",
  require("./routes/authRoutes")
);

// USER ROUTES
app.use(
  "/api/users",
  require("./routes/userRoutes")
);

// ADMIN ROUTES
app.use(
  "/api/admin",
  require("./routes/adminRoutes")
);

// POSTS ROUTES
app.use(
  "/api/posts",
  require("./routes/postRoutes")
);

// CHAT ROUTES
app.use(
  "/api/chat",
  require("./routes/chatRoutes")
);

// ======================
// HOME ROUTE
// ======================

app.get("/", (req, res) => {
  res.send(
    "MindConnect Backend Running"
  );
});

// ======================
// TEST DATABASE ROUTE
// ======================

app.get(
  "/test-db",
  async (req, res) => {
    try {

      const supabase =
        require("./config/supabase");

      const {
        data,
        error,
      } = await supabase
        .from("users")
        .insert([
          {
            clerk_id: "test123",
            email: "test@gmail.com",
            role: "student",
            name: "Rahul",
          },
        ])
        .select();

      console.log("DATA:");
      console.log(data);

      console.log("ERROR:");
      console.log(error);

      res.json({
        data,
        error,
      });

    } catch (err) {

      console.log(err);

      res.status(500).json({
        error: err.message,
      });

    }
  }
);

// ======================
// SERVER
// ======================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Server running on port ${PORT}`
    );
  }
);