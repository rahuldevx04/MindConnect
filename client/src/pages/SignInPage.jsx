import {
  SignIn,
  useUser,
} from "@clerk/clerk-react";

import {
  Navigate,
} from "react-router-dom";

function SignInPage() {
  const { isSignedIn } = useUser();

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
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          afterSignInUrl="/role-redirect"
        />
      </div>
    </div>
  );
}

export default SignInPage;