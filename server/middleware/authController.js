const supabase = require("../config/supabase");

const syncUser = async (req, res) => {

  try {

    const { id, email_addresses, first_name } = req.auth;

    const email = email_addresses?.[0]?.email_address;

    const clerkId = id;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", clerkId)
      .single();

    if (existingUser) {
      return res.status(200).json(existingUser);
    }

    // Insert new user
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          clerk_id: clerkId,
          email,
          role: "student",
          name: first_name || "User",
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({
        error: error.message,
      });
    }

    res.status(201).json(data);

  } catch (error) {

    res.status(500).json({
      error: error.message,
    });

  }
};

module.exports = {
  syncUser,
};