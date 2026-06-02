const express =
  require("express");

const router =
  express.Router();

const {

  createPost,

  getUserPosts,

  getMentorPosts,

} = require(
  "../controllers/postController"
);


// =======================
// CREATE POST
// =======================

router.post(
  "/",
  createPost
);


// =======================
// GET USER POSTS
// =======================

router.get(
  "/user/:user_id",
  getUserPosts
);


// =======================
// GET MENTOR POSTS
// =======================

router.get(
  "/mentor/:mentor_id",
  getMentorPosts
);

router.get("/test", (req, res) => {
  res.json({
    message: "Post route working",
  });
});

router.post("/", createPost);


module.exports =
  router;