const supabase = require("../config/supabase");

// GET ALL USERS
const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// UPDATE ROLE
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;

    const { role } = req.body;

    const { data, error } = await supabase
      .from("users")
      .update({
        role,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("users").delete().eq("id", id);

    if (error) {
      return res.status(400).json(error);
    }

    res.json({
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// ASSIGN MENTOR
const assignMentor = async (req, res) => {
  try {
    const {
      student_id,

      mentor_id,
    } = req.body;

    // CHECK EXISTING ASSIGNMENT
    const { data: existingAssignment } = await supabase
      .from("mentor_assignments")
      .select("*")
      .eq("student_id", student_id)
      .maybeSingle();

    // UPDATE EXISTING
    if (existingAssignment) {
      const { data, error } = await supabase
        .from("mentor_assignments")
        .update({
          mentor_id,
        })
        .eq("student_id", student_id)
        .select();

      if (error) {
        return res.status(400).json(error);
      }

      return res.json(data);
    }

    // INSERT NEW
    const { data, error } = await supabase
      .from("mentor_assignments")
      .insert([
        {
          student_id,

          mentor_id,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json(error);
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// GET ASSIGNMENTS
// GET ASSIGNMENTS
// GET ASSIGNMENTS
const getAssignments = async (req, res) => {

  try {

    const { data: assignments, error: assignmentError } =
      await supabase
        .from("mentor_assignments")
        .select("*");

    if (assignmentError) {

      return res.status(400).json(
        assignmentError
      );

    }

    const { data: users, error: usersError } =
      await supabase
        .from("users")
        .select("*");

    if (usersError) {

      return res.status(400).json(
        usersError
      );

    }

    const result =
      assignments.map(
        (assignment) => ({

          ...assignment,

          student:
            users.find(
              (u) =>
                u.id ===
                assignment.student_id
            ),

          mentor:
            users.find(
              (u) =>
                u.id ===
                assignment.mentor_id
            ),

        })
      );

    res.json(result);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }

};

// REMOVE ASSIGNMENT
const removeAssignment = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("mentor_assignments")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json(error);
    }

    res.json({
      message: "Assignment removed",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,

  updateUserRole,

  deleteUser,

  assignMentor,

  getAssignments,

  removeAssignment,
};
