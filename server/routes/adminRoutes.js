const express =
  require("express");

const router =
  express.Router();

const {

  getAllUsers,

  updateUserRole,

  deleteUser,

  assignMentor,

  getAssignments,

  removeAssignment,

} = require(
  "../controllers/adminController"
);


// GET ALL USERS
router.get(
  "/users",
  getAllUsers
);


// UPDATE USER ROLE
router.put(
  "/users/:id",
  updateUserRole
);


// DELETE USER
router.delete(
  "/users/:id",
  deleteUser
);


// ASSIGN MENTOR
router.post(
  "/assign-mentor",
  assignMentor
);


// GET ALL ASSIGNMENTS
router.get(
  "/assignments",
  getAssignments
);


// REMOVE ASSIGNMENT
router.delete(
  "/assignments/:id",
  removeAssignment
);


module.exports =
  router;