const supabase =
  require("../config/supabase");

const vader =
  require("vader-sentiment");


// ==========================
// NLP SENTIMENT DETECTION
// ==========================

const detectSentiment = (text) => {

  const result =
    vader.SentimentIntensityAnalyzer
      .polarity_scores(text);

  const score =
    result.compound;

  const lowerText =
    text.toLowerCase();

  // ==========================
  // CRISIS WORDS
  // ==========================

  const crisisWords = [
    "suicide",
    "suicidal",
    "kill myself",
    "end my life",
    "want to die",
    "die",
    "self harm",
    "self-harm",
    "cut myself",
    "worthless",
    "hopeless",
    "no reason to live",
    "can't go on",
    "life is pointless",
    "give up",
    "end it all"
  ];

  // ==========================
  // STRESS / NEGATIVE WORDS
  // ==========================

  const stressWords = [
    "stressed",
    "stress",
    "anxiety",
    "anxious",
    "panic",
    "burnout",
    "burnt out",
    "burned out",
    "depressed",
    "sad",
    "lonely",
    "crying",
    "overwhelmed",
    "exhausted",
    "tired",
    "worried",
    "fear",
    "afraid",
    "nervous",
    "frustrated",
    "angry",
    "upset",

    // Gen Z / Millennials

    "drained",
    "mentally drained",
    "emotionally drained",
    "not okay",
    "feeling low",
    "broken",
    "empty",
    "dead inside",
    "can't cope",
    "can't handle",
    "lost",
    "numb",
    "unmotivated",
    "demotivated",
    "overthinking",
    "spiraling",
    "falling apart",
    "breakdown",
    "messed up",
    "stuck",
    "isolated",
    "ignored",
    "rejected",
    "heartbroken",
    "toxic",
    "trauma",
    "traumatized"
  ];

  // ==========================
  // STUDENT / COLLEGE STRESS
  // ==========================

  const academicStressWords = [
    "exam",
    "exams",
    "internal",
    "internals",
    "assignment",
    "deadline",
    "project",
    "backlog",
    "attendance",
    "placement",
    "placements",
    "interview",
    "cgpa",
    "grades",
    "marks",
    "semester",
    "college pressure",
    "study pressure",
    "failed",
    "failure"
  ];

  // ==========================
  // RELATIONSHIP STRESS
  // ==========================

  const relationshipWords = [
    "breakup",
    "break up",
    "heartbroken",
    "relationship",
    "cheated",
    "betrayed",
    "ghosted",
    "ignored",
    "rejected",
    "toxic relationship"
  ];

  // ==========================
  // POSITIVE WORDS
  // ==========================

  const positiveWords = [
    "happy",
    "great",
    "amazing",
    "awesome",
    "fantastic",
    "good",
    "excited",
    "motivated",
    "confident",
    "peaceful",
    "grateful",
    "thankful",
    "blessed",
    "content",
    "relaxed",
    "hopeful",
    "optimistic",

    // Gen Z

    "slaying",
    "thriving",
    "living my best life",
    "feeling good",
    "doing well",
    "doing great",
    "productive",
    "energized",
    "winning",
    "vibing",
    "chilling",
    "feeling myself",
    "locked in",
    "on track"
  ];

  // ==========================
  // DETECTION
  // ==========================

  const hasCrisis =
    crisisWords.some(word =>
      lowerText.includes(word)
    );

  const hasStress =
    stressWords.some(word =>
      lowerText.includes(word)
    );

  const hasAcademicStress =
    academicStressWords.some(word =>
      lowerText.includes(word)
    );

  const hasRelationshipStress =
    relationshipWords.some(word =>
      lowerText.includes(word)
    );

  const hasPositive =
    positiveWords.some(word =>
      lowerText.includes(word)
    );

  // ==========================
  // CRISIS
  // ==========================

  if (hasCrisis) {

    return {
      sentiment: "negative",
      moodScore: 5,
      stressLevel: "Critical",
    };

  }

  // ==========================
  // HIGH STRESS
  // ==========================

  if (
    hasStress ||
    hasAcademicStress ||
    hasRelationshipStress
  ) {

    return {
      sentiment: "negative",
      moodScore: 25,
      stressLevel: "High",
    };

  }

  // ==========================
  // VERY NEGATIVE
  // ==========================

  if (score <= -0.5) {

    return {
      sentiment: "negative",
      moodScore: 20,
      stressLevel: "High",
    };

  }

  // ==========================
  // NEGATIVE
  // ==========================

  if (score < 0) {

    return {
      sentiment: "negative",
      moodScore: 40,
      stressLevel: "Medium",
    };

  }

  // ==========================
  // VERY POSITIVE
  // ==========================

  if (
    score >= 0.6 ||
    hasPositive
  ) {

    return {
      sentiment: "positive",
      moodScore: 90,
      stressLevel: "Low",
    };

  }

  // ==========================
  // POSITIVE
  // ==========================

  if (score > 0) {

    return {
      sentiment: "positive",
      moodScore: 75,
      stressLevel: "Low",
    };

  }

  // ==========================
  // NEUTRAL
  // ==========================

  return {
    sentiment: "neutral",
    moodScore: 55,
    stressLevel: "Medium",
  };

};


// ==========================
// CREATE POST
// ==========================

// ==========================
// CREATE POST
// ==========================


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

  

    // ======================================
    // INSERT POST
    // ======================================

   const {
  data,
  error,
} = await supabase
  .from("posts")
  .insert([
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
  if (error) {
  return res.status(400).json(error);
}

return res.status(201).json(data);

} catch (error) {

  console.log(error);

  return res.status(500).json({
    error: error.message,
  });

}
};
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
