import { useEffect }
from "react";

import axios
from "axios";

import {
  useAuth,
} from "@clerk/clerk-react";

import {
  useNavigate,
} from "react-router-dom";

function RoleRedirect() {

  const {
    getToken,
  } = useAuth();

  const navigate =
    useNavigate();

  useEffect(() => {

    const checkUser =
      async () => {

        try {

          // GET CLERK TOKEN
          const token =
            await getToken();

          // SYNC USER TO DATABASE
          await axios.post(
            "http://localhost:5000/api/auth/sync-user",
            {},
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

          // GET CURRENT USER
          const response =
            await axios.get(
              "http://localhost:5000/api/users/me",
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          console.log(
            response.data
          );

          const role =
            response.data.role;

          console.log(
            "ROLE:"
          );

          console.log(
            role
          );

          // STUDENT
          if (
            role ===
            "student"
          ) {

            navigate(
              "/student-home"
            );

          }

          // MENTOR
          else if (
            role ===
            "mentor"
          ) {

            navigate(
              "/mentor-home"
            );

          }

          // ADMIN
          else if (
            role ===
            "admin"
          ) {

            navigate(
              "/admin-home"
            );

          }

          // DEFAULT
          else {

            navigate(
              "/student-home"
            );

          }

        } catch (error) {

          console.log(
            error
          );

        }

      };

    checkUser();

  }, []);

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <h1 className="text-5xl font-bold text-teal-600 animate-pulse">

        Loading MindConnect...

      </h1>

    </div>

  );

}

export default RoleRedirect;