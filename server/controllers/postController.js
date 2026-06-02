const supabase =
  require("../config/supabase");

const vader =
  require("vader-sentiment");


// ==========================
// NLP SENTIMENT DETECTION
// ==========================

const detectSentiment =
  (text) => {

    const result =
      vader
        .SentimentIntensityAnalyzer
        .polarity_scores(text);

    const score =
      result.compound;

    // VERY NEGATIVE
    if (score <= -0.5) {

      return {

        sentiment:
          "negative",

        moodScore:
          20,

        stressLevel:
          "High",

      };

    }

    // NEGATIVE
    else if (score < 0) {

      return {

        sentiment:
          "negative",

        moodScore:
          40,

        stressLevel:
          "Medium",

      };

    }

    // VERY POSITIVE
    else if (score >= 0.5) {

      return {

        sentiment:
          "positive",

        moodScore:
          90,

        stressLevel:
          "Low",

      };

    }

    // SLIGHT POSITIVE
    else if (score > 0) {

      return {

        sentiment:
          "positive",

        moodScore:
          70,

        stressLevel:
          "Low",

      };

    }

    // NEUTRAL
    return {

      sentiment:
        "neutral",

      moodScore:
        50,

      stressLevel:
        "Medium",

    };

  };


// ==========================
// CREATE POST
// ==========================

// ==========================
// CREATE POST
// ==========================

const createPost = async (req, res) => {
  console.log("================================");
  console.log("CREATE POST HIT");
  console.log(req.body);
  console.log("================================");

  try {
    const { user_id, content } = req.body;

    console.log("USER ID:", user_id);
    console.log("CONTENT:", content);

    // VALIDATION
    if (!user_id || !content) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    // FIND STUDENT
    const {
      data: studentUser,
      error: studentError,
    } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user_id)
      .single();

    console.log("STUDENT USER:");
    console.log(studentUser);

    console.log("STUDENT ERROR:");
    console.log(studentError);

    if (studentError || !studentUser) {
      return res.status(400).json({
        error: "Student not found",
      });
    }

    // FIND ASSIGNED MENTOR
    const {
      data: assignment,
      error: assignmentError,
    } = await supabase
      .from("mentor_assignments")
      .select("mentor_id")
      .eq("student_id", studentUser.id)
      .single();

    console.log("ASSIGNMENT:");
    console.log(assignment);

    console.log("ASSIGNMENT ERROR:");
    console.log(assignmentError);

    if (assignmentError || !assignment) {
      return res.status(400).json({
        error: "No mentor assigned to this student",
      });
    }

    // FIND MENTOR
    const {
      data: mentorUser,
      error: mentorError,
    } = await supabase
      .from("users")
      .select("clerk_id")
      .eq("id", assignment.mentor_id)
      .single();

    console.log("MENTOR USER:");
    console.log(mentorUser);

    console.log("MENTOR ERROR:");
    console.log(mentorError);

    if (mentorError || !mentorUser) {
      return res.status(400).json({
        error: "Mentor not found",
      });
    }

    const mentor_id = mentorUser.clerk_id;

    // NLP ANALYSIS
    const analysis = detectSentiment(content);

    const anonymous_id =
      "MC-" +
      Math.floor(1000 + Math.random() * 9000);

    console.log("ANALYSIS:");
    console.log(analysis);

    // INSERT POST
    const {
      data,
      error,
    } = await supabase
      .from("posts")
      .insert([
        {
          user_id: String(user_id),
          mentor_id,
          content,
          sentiment: analysis.sentiment,
          mood_score: analysis.moodScore,
          stress_level: analysis.stressLevel,
          anonymous_id,
        },
      ])
      .select();

    console.log("INSERT DATA:");
    console.log(data);

    console.log("INSERT ERROR:");
    console.log(error);

    if (error) {
      return res.status(400).json(error);
    }

    return res.status(201).json(data);

  } catch (error) {
    console.log("FULL ERROR:");
    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
};

const createPost = async (req, res) => {
  try {

    const {
  user_id,
  name,
  content,
} = req.body;

    console.log("POST BODY:", req.body);

    // VALIDATION

    if (!user_id || !content) {
      return res.status(400).json({
        error: "Missing fields",
      });
    }

    // ======================================
    // FIND STUDENT UUID FROM CLERK ID
    // ======================================

    const {
      data: studentUser,
      error: studentError,
    } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", user_id)
      .single();

    if (studentError || !studentUser) {

      console.log(
        "STUDENT ERROR:",
        studentError
      );

      return res.status(400).json({
        error: "Student not found",
      });

    }

    console.log(
      "STUDENT USER:",
      studentUser
    );

    // ======================================
    // FIND ASSIGNED MENTOR
    // ======================================

    const {
      data: assignment,
      error: assignmentError,
    } = await supabase
      .from("mentor_assignments")
      .select("mentor_id")
      .eq(
        "student_id",
        studentUser.id
      )
      .single();

    if (
      assignmentError ||
      !assignment
    ) {

      console.log(
        "ASSIGNMENT ERROR:",
        assignmentError
      );

      return res.status(400).json({
        error:
          "No mentor assigned to this student",
      });

    }

    console.log(
      "ASSIGNMENT:",
      assignment
    );

    // ======================================
    // FIND MENTOR CLERK ID
    // ======================================

    const {
      data: mentorUser,
      error: mentorUserError,
    } = await supabase
      .from("users")
      .select("clerk_id")
      .eq(
        "id",
        assignment.mentor_id
      )
      .single();

    if (
      mentorUserError ||
      !mentorUser
    ) {

      console.log(
        "MENTOR ERROR:",
        mentorUserError
      );

      return res.status(400).json({
        error: "Mentor not found",
      });

    }

    console.log(
      "MENTOR USER:",
      mentorUser
    );

    const mentor_id =
      mentorUser.clerk_id;

    // ======================================
    // NLP ANALYSIS
    // ======================================

    const analysis =
      detectSentiment(
        content
      );

    // ======================================
    // RANDOM ID
    // ======================================

    // const anonymous_id =
    //   "MC-" +
    //   Math.floor(
    //     1000 +
    //     Math.random() * 9000
    //   );

    // ======================================
    // INSERT POST
    // ======================================

   const {
  data,
  error,
} = await supabase
  .from("posts")
  .insert.insert([
  {
    user_id: String(user_id),

    name,

    mentor_id,

    content,

    sentiment: analysis.sentiment,

    mood_score: analysis.moodScore,

    stress_level: analysis.stressLevel,
  },
])
  .select();
// ==========================
// GET USER POSTS
// ==========================

const getUserPosts =
  async (req, res) => {

    try {

      const {
        user_id,
      } = req.params;

      const {
        data,
        error,
      } = await supabase
        .from("posts")
        .select("*")
        .eq(
          "user_id",
          String(user_id)
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {

        return res
          .status(400)
          .json(error);

      }

      res.json(data);

    } catch (error) {

      res.status(500).json({

        error:
          error.message,

      });

    }

  };


/// ==========================
// GET MENTOR POSTS
// ==========================

const getMentorPosts = async (req, res) => {
  try {
    const { mentor_id } = req.params;

    // POSTS
    const { data: posts, error: postsError } =
      await supabase
        .from("posts")
        .select("*")
        .eq("mentor_id", mentor_id)
        .order("created_at", {
          ascending: false,
        });

    if (postsError) {
      return res.status(400).json(postsError);
    }

    // ASSIGNMENTS
 // FIND MENTOR UUID FROM CLERK ID

const {
  data: mentorUser,
  error: mentorError,
} = await supabase
  .from("users")
  .select("id")
  .eq("clerk_id", mentor_id)
  .single();

if (mentorError || !mentorUser) {

  return res.status(400).json({
    error: "Mentor not found",
  });

}

// ASSIGNMENTS USING UUID

const {
  data: assignments,
  error: assignmentError,
} = await supabase
  .from("mentor_assignments")
  .select("*")
  .eq(
    "mentor_id",
    mentorUser.id
  );

if (assignmentError) {

  return res.status(400).json(
    assignmentError
  );

}

    res.json({
      posts: posts || [],
      totalStudents:
        assignments?.length || 0,
    });

  } catch (error) {

  console.log("FULL ERROR:");
  console.log(error);

  res.status(500).json({
    error: error.message,
  });

}
};

// ==========================
// EXPORTS
// ==========================

module.exports = {
  createPost,
  getUserPosts,
  getMentorPosts,
};
