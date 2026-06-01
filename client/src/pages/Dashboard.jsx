import { useEffect } from "react";

import axios from "axios";

import {
  useAuth,
  UserButton,
  SignOutButton,
} from "@clerk/clerk-react";

function Dashboard() {

  const { getToken, isSignedIn } =
    useAuth();

  useEffect(() => {

    const syncUser = async () => {

      try {

        const token =
          await getToken();

        console.log(token);

        const response =
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

        console.log(response.data);

      } catch (error) {

        console.log(error);

      }

    };

    if (isSignedIn) {

      syncUser();

    }

  }, [isSignedIn]);

  return (

    <div className="min-h-screen bg-[#F5F3FF] p-10">

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold text-teal-600">
          Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <UserButton />

          <SignOutButton>

            <button className="bg-red-500 text-white px-4 py-2 rounded-xl">
              Logout
            </button>

          </SignOutButton>

        </div>

      </div>

    </div>

  );
}

export default Dashboard;