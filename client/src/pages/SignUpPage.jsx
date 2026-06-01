import {
  SignUp,
  useUser,
} from "@clerk/clerk-react";

import {
  Navigate,
} from "react-router-dom";

function SignUpPage() {
  const { isSignedIn } =
    useUser();

  if (isSignedIn) {
    return (
      <Navigate
        to="/role-redirect"
        replace
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-teal-50 p-6">
      <div className="w-full max-w-md">
        <SignUp
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          afterSignUpUrl="/role-redirect"
        />
      </div>
    </div>
  );
}

export default SignUpPage;