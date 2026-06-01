import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  UserButton,
  SignOutButton,
  useUser,
} from "@clerk/clerk-react";

import {
  Moon,
  Sun,
} from "lucide-react";

import {
  useTheme,
} from "../../context/ThemeContext";

import {
  Link,
} from "react-router-dom";

import {
  BarChart3,
  LogOut,
  MessageCircle,
} from "lucide-react";

function Navbar({
  role,
}) {

  const { user } =
    useUser();

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const {
  darkMode,
  setDarkMode,
} = useTheme();

  // ==========================
  // ROUTES
  // ==========================

  let analysisRoute =
    "/analysis";

  let chatRoute =
    null;

  if (
    role === "student"
  ) {

    analysisRoute =
      "/student-analysis";

    chatRoute =
      "/student-chat";

  }

  else if (
    role === "mentor"
  ) {

    analysisRoute =
      "/mentor-analysis";

    chatRoute =
      "/mentor-chat";

  }

  else if (
    role === "admin"
  ) {

    analysisRoute =
      "/analysis";

  }

  // ==========================
  // LOAD UNREAD COUNT
  // ==========================

  useEffect(() => {

    if (
      !user?.id ||
      !chatRoute
    ) {
      return;
    }

    const loadUnread =
      async () => {

        try {

          const res =
            await axios.get(
              `http://localhost:5000/api/chat/unread/${user.id}/${role}`
            );

          setUnreadCount(
            res.data.count || 0
          );

        } catch (error) {

          console.log(
            "UNREAD ERROR:",
            error
          );

        }

      };

    loadUnread();

    const interval =
      setInterval(
        loadUnread,
        3000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    user,
    role,
    chatRoute,
  ]);

  return (

    <nav className="w-full border-b border-cyan-100 bg-white shadow-sm px-5 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">

      {/* LOGO */}

      <Link to="/">

        <div className="cursor-pointer">

          <h1 className="text-2xl md:text-3xl font-bold text-cyan-600">

            MindConnect

          </h1>

          <p className="text-xs md:text-sm text-slate-500 mt-0.5 hidden md:block">

            AI Mental Wellness Support Platform

          </p>

        </div>

      </Link>

      {/* NAVIGATION */}

      <div className="flex items-center gap-3 md:gap-4">

        {/* ANALYSIS */}

        <Link to={analysisRoute}>

          <button className="flex items-center gap-2 border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">

            <BarChart3 size={16} />

            <span className="hidden sm:block">

              Analysis

            </span>

          </button>

        </Link>

        {/* CHAT */}

        {chatRoute && (

          <Link to={chatRoute}>

            <button className="relative flex items-center gap-2 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">

              <MessageCircle size={16} />

              <span className="hidden sm:block">

                Chat

              </span>

              {unreadCount > 0 && (

                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full px-1 font-bold">

                  {unreadCount}

                </span>

              )}

            </button>

          </Link>

        )}

        {/* ROLE */}

        <div className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-xl text-sm font-semibold capitalize shadow-sm">

          {role}

        </div>

        {/* USER */}

        <div className="scale-105">

          <UserButton />

        </div>

        

        {/* LOGOUT */}

        <SignOutButton>

          <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 border border-red-100 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md">

            <LogOut size={16} />

            <span className="hidden sm:block">

              Logout

            </span>

          </button>

        </SignOutButton>

      </div>

    </nav>

  );

}

export default Navbar;