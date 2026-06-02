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
        const token = await getToken();

        console.log("TOKEN:", token);

        // SYNC USER TO DATABASE
await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/sync-user`,
  {},
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        console.log("User synced successfully");

        // GET CURRENT USER
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("USER DATA:");
        console.log(response.data);

        const role = response.data?.role;

        console.log("ROLE:", role);

        if (role === "student") {
          navigate("/student-home");
        } else if (role === "mentor") {
          navigate("/mentor-home");
        } else if (role === "admin") {
          navigate("/admin-home");
        } else {
          console.log("Unknown role, redirecting to student");
          navigate("/student-home");
        }
      } catch (error) {
        console.error("ROLE REDIRECT ERROR:");

        if (error.response) {
          console.log("STATUS:", error.response.status);
          console.log("DATA:", error.response.data);
        } else {
          console.log(error);
        }
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