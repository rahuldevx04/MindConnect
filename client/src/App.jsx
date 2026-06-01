import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import {
  useUser,
} from "@clerk/clerk-react";

import {
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";

import SignInPage from "./pages/SignInPage";

import SignUpPage from "./pages/SignUpPage";

import RoleRedirect from "./pages/RoleRedirect";

import StudentHome from "./pages/student/StudentHome";

import MentorAnalysis from "./pages/mentor/MentorAnalysis";

import MentorHome from "./pages/mentor/MentorHome";

import AdminHome from "./pages/admin/AdminHome";

import Analysis from "./pages/Analysis";

import StudentAnalysis from "./pages/student/StudentAnalysis";

import StudentChat from "./pages/student/StudentChat";
import MentorChat from "./pages/mentor/MentorChat";

// PROTECTED ROUTE
function ProtectedRoute({ children }) {

  return (

    <>

      <SignedIn>
        {children}
      </SignedIn>

      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

    </>

  );

}

function HomeRedirect() {

  const {
    isLoaded,
    isSignedIn,
  } = useUser();

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn) {
    return (
      <Navigate
        to="/role-redirect"
        replace
      />
    );
  }

  return <Home />;
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* HOME */}
       <Route
  path="/"
  element={<HomeRedirect />}
/>
        {/* SIGN IN */}
        <Route
          path="/sign-in"
          element={<SignInPage />}
        />

        {/* ROLE REDIRECT */}
        <Route
          path="/role-redirect"
          element={
            <ProtectedRoute>
              <RoleRedirect />
            </ProtectedRoute>
          }
        />

        {/* STUDENT HOME */}
        <Route
          path="/student-home"
          element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          }
        />

        {/* MENTOR HOME */}
        <Route
          path="/mentor-home"
          element={
            <ProtectedRoute>
              <MentorHome />
            </ProtectedRoute>
          }
        />


        {/* ADMIN HOME */}
        <Route
          path="/admin-home"
          element={
            <ProtectedRoute>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ANALYSIS */}
        <Route
          path="/analysis"
          element={
            <ProtectedRoute>
              <Analysis />
            </ProtectedRoute>
          }
        />

        {/* STUDENT ANALYSIS */}
        <Route
          path="/student-analysis"
          element={
            <ProtectedRoute>
              <StudentAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
  path="/mentor-analysis"
  element={
    <ProtectedRoute>
      <MentorAnalysis />
    </ProtectedRoute>
  }
/>

{/* STUDENT CHAT */}
<Route
  path="/student-chat"
  element={
    <ProtectedRoute>
      <StudentChat />
    </ProtectedRoute>
  }
/>

{/* MENTOR CHAT */}
<Route
  path="/mentor-chat"
  element={
    <ProtectedRoute>
      <MentorChat />
    </ProtectedRoute>
  }
/>

      </Routes>

      

    </BrowserRouter>

  );

}

export default App;