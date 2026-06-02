import { UserButton, SignOutButton } from "@clerk/clerk-react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-[#F5F3FF] p-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-600">
          Dashboard
        </h1>

        <div className="flex items-center gap-4">
          <UserButton />

          <SignOutButton>
            <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl">
              Logout
            </button>
          </SignOutButton>
        </div>
      </div>

      <div className="mt-10 bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-semibold text-slate-700">
          Welcome to MindConnect 👋
        </h2>

        <p className="mt-2 text-slate-500">
          Your account has been authenticated successfully.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;