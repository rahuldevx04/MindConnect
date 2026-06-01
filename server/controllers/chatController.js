const supabase = require("../config/supabase");

// ======================================
// SEND MESSAGE
// ======================================

const sendMessage = async (req, res) => {

  try {

    const {
      student_id,
      mentor_id,
      sender_id,
      sender_role,
      message,
    } = req.body;

    const { data, error } =
      await supabase
        .from("chats")
        .insert([
          {
            student_id,
            mentor_id,
            sender_id,
            sender_role,
            message,
            is_read: false,
          },
        ])
        .select();

    if (error) {

      return res.status(400).json(
        error
      );

    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// ======================================
// GET CHAT MESSAGES
// ======================================

const getMessages = async (req, res) => {

  try {

    const {
      student_id,
      mentor_id,
    } = req.params;

    const { data, error } =
      await supabase
        .from("chats")
        .select("*")
        .eq(
          "student_id",
          student_id
        )
        .eq(
          "mentor_id",
          mentor_id
        )
        .order(
          "created_at",
          {
            ascending: true,
          }
        );

    if (error) {

      return res.status(400).json(
        error
      );

    }

    res.json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// ======================================
// GET STUDENT CHAT INFO
// ======================================

const getStudentChatInfo = async (
  req,
  res
) => {

  try {

    const {
      clerk_id,
    } = req.params;

    const {
      data: student,
      error: studentError,
    } = await supabase
      .from("users")
      .select("*")
      .eq(
        "clerk_id",
        clerk_id
      )
      .single();

    if (
      studentError ||
      !student
    ) {

      return res.status(404).json({
        error:
          "Student not found",
      });

    }

    const {
      data: assignment,
      error: assignmentError,
    } = await supabase
      .from("mentor_assignments")
      .select("*")
      .eq(
        "student_id",
        student.id
      )
      .single();

    if (
      assignmentError ||
      !assignment
    ) {

      return res.status(404).json({
        error:
          "No mentor assigned",
      });

    }

    const {
      data: mentor,
      error: mentorError,
    } = await supabase
      .from("users")
      .select("*")
      .eq(
        "id",
        assignment.mentor_id
      )
      .single();

    if (
      mentorError ||
      !mentor
    ) {

      return res.status(404).json({
        error:
          "Mentor not found",
      });

    }

    res.json({

      student,

      mentor,

    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// ======================================
// GET MENTOR STUDENTS
// ======================================

const getMentorStudents = async (
  req,
  res
) => {

  try {

    const {
      clerk_id,
    } = req.params;

    const {
      data: mentor,
      error: mentorError,
    } = await supabase
      .from("users")
      .select("*")
      .eq(
        "clerk_id",
        clerk_id
      )
      .single();

    if (
      mentorError ||
      !mentor
    ) {

      return res.status(404).json({
        error:
          "Mentor not found",
      });

    }

    const {
      data: assignments,
      error: assignmentError,
    } = await supabase
      .from("mentor_assignments")
      .select("*")
      .eq(
        "mentor_id",
        mentor.id
      );

    if (assignmentError) {

      return res.status(400).json(
        assignmentError
      );

    }

    const studentIds =
      assignments.map(
        (a) =>
          a.student_id
      );

    const {
      data: students,
      error: studentsError,
    } = await supabase
      .from("users")
      .select("*")
      .in(
        "id",
        studentIds
      );

    if (studentsError) {

      return res.status(400).json(
        studentsError
      );

    }

    res.json({

      mentor,

      students,

    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// ======================================
// MARK MESSAGES AS READ
// ======================================

const markMessagesRead = async (
  req,
  res
) => {

  try {

    const {
      student_id,
      mentor_id,
      reader_role,
    } = req.body;

    const senderRole =
      reader_role ===
      "mentor"
        ? "student"
        : "mentor";

    const {
      error,
    } = await supabase
      .from("chats")
      .update({
        is_read: true,
      })
      .eq(
        "student_id",
        student_id
      )
      .eq(
        "mentor_id",
        mentor_id
      )
      .eq(
        "sender_role",
        senderRole
      )
      .eq(
        "is_read",
        false
      );

    if (error) {

      return res.status(400).json(
        error
      );

    }

    res.json({
      success: true,
    });

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// ======================================
// GET UNREAD COUNT
// ======================================

const getUnreadCount = async (
  req,
  res
) => {

  try {

    const {
      user_id,
      role,
    } = req.params;

    // FIND USER UUID

    const {
      data: user,
      error: userError,
    } = await supabase
      .from("users")
      .select("*")
      .eq(
        "clerk_id",
        user_id
      )
      .single();

    if (
      userError ||
      !user
    ) {

      return res.status(404).json({
        error:
          "User not found",
      });

    }

    let query =
      supabase
        .from("chats")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq(
          "is_read",
          false
        );

    // MENTOR

    if (
      role === "mentor"
    ) {

      query = query
        .eq(
          "mentor_id",
          user.id
        )
        .eq(
          "sender_role",
          "student"
        );

    }

    // STUDENT

    else if (
      role === "student"
    ) {

      query = query
        .eq(
          "student_id",
          user.id
        )
        .eq(
          "sender_role",
          "mentor"
        );

    }

    const {
      count,
      error,
    } = await query;

    if (error) {

      return res.status(400).json(
        error
      );

    }

    res.json({

      count:
        count || 0,

    });

  } catch (error) {

    res.status(500).json({

      error:
        error.message,

    });

  }

};

// ======================================
// UNREAD COUNT PER STUDENT
// ======================================

const getStudentUnreadCounts =
async (req, res) => {

  try {

    const {
      mentor_id,
    } = req.params;

    const {
      data,
      error,
    } = await supabase
      .from("chats")
      .select(
        "student_id"
      )
      .eq(
        "mentor_id",
        mentor_id
      )
      .eq(
        "sender_role",
        "student"
      )
      .eq(
        "is_read",
        false
      );

    if (error) {

      return res.status(400).json(
        error
      );

    }

    const counts = {};

    data.forEach(
      (msg) => {

        counts[
          msg.student_id
        ] =
          (counts[
            msg.student_id
          ] || 0) + 1;

      }
    );

    res.json(counts);

  } catch (error) {

    res.status(500).json({
      error:
        error.message,
    });

  }

};

module.exports = {
  sendMessage,
  getMessages,
  getStudentChatInfo,
  getMentorStudents,
  markMessagesRead,
  getUnreadCount,
  getStudentUnreadCounts,
};