const supabase =
  require("../config/supabase");

const getCurrentUser =
  async (req, res) => {

    try {

      const clerkId =
        req.auth.userId;

      console.log(
        "CLERK ID:"
      );

      console.log(
        clerkId
      );

      // FIND USER
      const {
        data,
        error,
      } = await supabase
        .from("users")
        .select("*")
        .eq(
          "clerk_id",
          clerkId
        )
        .maybeSingle();

      console.log(
        "USER DATA:"
      );

      console.log(data);

      console.log(
        "ERROR:"
      );

      console.log(error);

      // USER NOT FOUND
      if (!data) {

        return res
          .status(404)
          .json({
            error:
              "User not found in database",
          });

      }

      res.json(data);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        error:
          error.message,
      });

    }

  };

module.exports = {
  getCurrentUser,
};