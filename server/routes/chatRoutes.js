const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getMessages,
  getStudentChatInfo,
  getMentorStudents,
  markMessagesRead,
  getUnreadCount,
  getStudentUnreadCounts,
} = require("../controllers/chatController");
// ======================================
// SEND MESSAGE
// POST /api/chat
// ======================================

router.post(
  "/",
  sendMessage
);

// ======================================
// GET STUDENT CHAT INFO
// GET /api/chat/student-info/:clerk_id
// ======================================

router.get(
  "/student-info/:clerk_id",
  getStudentChatInfo
);

// ======================================
// GET MENTOR ASSIGNED STUDENTS
// GET /api/chat/mentor-students/:clerk_id
// ======================================

router.get(
  "/mentor-students/:clerk_id",
  getMentorStudents
);

// ======================================
// GET CHAT MESSAGES
// GET /api/chat/:student_id/:mentor_id
// KEEP THIS LAST
// ======================================
// ======================================
// UNREAD COUNT
// ======================================

router.get(
  "/student-unread/:mentor_id",
  getStudentUnreadCounts
);

router.get(
  "/unread/:user_id/:role",
  getUnreadCount
);

router.get(
  "/:student_id/:mentor_id",
  getMessages
);

router.put(
  "/mark-read",
  markMessagesRead
);

module.exports = router;