import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function RoleRedirect() {
  const { getToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        console.log("STEP 1");

        const token = await getToken();

        console.log("TOKEN:");
        console.log(token);

        console.log("API URL:");
        console.log(import.meta.env.VITE_API_URL);

        if (!token) {
          console.log("No token found");
          navigate("/");
          return;
        }

        // ==========================
        // SYNC USER
        // ==========================

        const syncResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/sync-user`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("USER SYNCED:");
        console.log(syncResponse.data);

        // ==========================
        // GET USER FROM DATABASE
        // ==========================

        const userResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("USER DATA:");
        console.log(userResponse.data);

        const role = userResponse.data?.role
          ?.trim()
          ?.toLowerCase();

        console.log("ROLE:");
        console.log(role);

        // ==========================
        // REDIRECT BASED ON ROLE
        // ==========================

        if (role === "mentor") {
          console.log("Redirecting to Mentor");

          navigate("/mentor-home");
        } else if (role === "admin") {
          console.log("Redirecting to Admin");

          navigate("/admin-home");
        } else {
          console.log("Redirecting to Student");

          navigate("/student-home");
        }
      } catch (error) {
        console.error("ROLE REDIRECT ERROR:");

        if (error.response) {
          console.log("STATUS:");
          console.log(error.response.status);

          console.log("DATA:");
          console.log(error.response.data);
        } else {
          console.log(error);
        }

        navigate("/");
      }
    };

    checkUser();
  }, [getToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-cyan-600 animate-pulse">
          Loading MindConnect...
        </h1>

        <p className="mt-4 text-slate-500">
          Checking your account...
        </p>
      </div>
    </div>
  );
}

export default RoleRedirect;