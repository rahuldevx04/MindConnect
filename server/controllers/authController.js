const supabase =
  require("../config/supabase");

const { createClerkClient } =
  require("@clerk/backend");

const clerkClient =
  createClerkClient({
    secretKey:
      process.env.CLERK_SECRET_KEY,
  });

const syncUser = async (req, res) => {

  try {

    const clerkId =
      req.auth.userId;

    if (!clerkId) {

      return res.status(401).json({
        error: "Unauthorized",
      });

    }

    // CHECK EXISTING USER
    const { data: existingUser } =
      await supabase
        .from("users")
        .select("*")
        .eq("clerk_id", clerkId)
        .maybeSingle();

    if (existingUser) {

      return res.json(existingUser);

    }

    // GET REAL CLERK USER
    const user =
      await clerkClient.users.getUser(
        clerkId
      );

    const email =
      user.emailAddresses[0]
        ?.emailAddress;

    const name =
      `${user.firstName || ""}
       ${user.lastName || ""}`.trim();

    // INSERT USER
    const { data, error } =
      await supabase
        .from("users")
        .insert([
          {
            clerk_id: clerkId,
            email,
            role: "student",
            name,
          },
        ])
        .select();

    if (error) {

      console.log(error);

      return res.status(400).json({
        error,
      });

    }

    res.status(201).json(data);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: error.message,
    });

  }

};

module.exports = {
  syncUser,
};