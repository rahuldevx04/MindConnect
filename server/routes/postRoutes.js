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


module.exports =
  router;