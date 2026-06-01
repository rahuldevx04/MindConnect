import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../../components/ui/Navbar";

import AdminAnalytics from "../../components/ui/AdminAnalytics";

import { Users, UserCheck, Shield, Settings } from "lucide-react";

function AdminHome() {
  const [users, setUsers] = useState([]);

  const [assignments, setAssignments] = useState([]);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/users");

      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH ASSIGNMENTS
  const fetchAssignments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/admin/assignments",
      );

      setAssignments(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();

    fetchAssignments();
  }, []);

  // UPDATE ROLE
  const updateRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}`, { role });

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // DELETE USER
  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  // ASSIGN MENTOR
  const assignMentor = async (student_id, mentor_id) => {
    if (mentor_id === "default") return;

    try {
      await axios.post("http://localhost:5000/api/admin/assign-mentor", {
        student_id,
        mentor_id,
      });

      fetchAssignments();
    } catch (error) {
      console.log(error);
    }
  };

  // REMOVE ASSIGNMENT
  const removeAssignment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/assignments/${id}`);

      fetchAssignments();
    } catch (error) {
      console.log(error);
    }
  };

  // FILTER USERS
  const students = users.filter((user) => user.role === "student");

  const mentors = users.filter((user) => user.role === "mentor");

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* NAVBAR */}
      <Navbar role="admin" />

      <div className="p-5 md:p-8 space-y-8">
        {/* HERO SECTION */}

        <div className="bg-white/80 backdrop-blur-lg border border-cyan-100 rounded-3xl p-7 shadow-lg">
          <div className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            AI Administration Dashboard
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Admin
            <span className="block text-cyan-600 mt-1">Control Center</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base mt-4 max-w-3xl leading-7">
            Manage students, mentors, emotional wellness assignments, mentor
            allocation, and platform analytics from one intelligent dashboard.
          </p>
        </div>

        {/* ANALYTICS */}

        {/* <AdminAnalytics users={users} assignments={assignments} /> */}

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* TOTAL USERS */}

          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-cyan-600">Total Users</h2>

                <p className="text-4xl font-extrabold text-slate-900 mt-4">
                  {users.length}
                </p>
              </div>

              <Users className="w-10 h-10 text-cyan-500" />
            </div>
          </div>

          {/* STUDENTS */}

          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-emerald-600">Students</h2>

                <p className="text-4xl font-extrabold text-slate-900 mt-4">
                  {students.length}
                </p>
              </div>

              <UserCheck className="w-10 h-10 text-emerald-500" />
            </div>
          </div>

          {/* MENTORS */}

          <div className="bg-white rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-violet-600">Mentors</h2>

                <p className="text-4xl font-extrabold text-slate-900 mt-4">
                  {mentors.length}
                </p>
              </div>

              <Shield className="w-10 h-10 text-violet-500" />
            </div>
          </div>
        </div>

        {/* USER MANAGEMENT */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-teal-500 p-5">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Settings size={24} />
              User Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="p-4 text-left text-sm">Name</th>

                  <th className="p-4 text-left text-sm">Email</th>

                  <th className="p-4 text-left text-sm">Role</th>

                  <th className="p-4 text-left text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t hover:bg-cyan-50 transition"
                  >
                    <td className="p-4 font-medium text-sm">{user.name}</td>

                    <td className="p-4 text-slate-600 text-sm">{user.email}</td>

                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user.id, e.target.value)}
                        className="border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="student">Student</option>

                        <option value="mentor">Mentor</option>

                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ASSIGN MENTORS */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5">
            <h2 className="text-2xl font-bold text-white">Assign Mentors</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cyan-50">
                <tr>
                  <th className="p-4 text-left text-sm">Student</th>

                  <th className="p-4 text-left text-sm">Assign Mentor</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="border-t hover:bg-cyan-50 transition"
                  >
                    <td className="p-4 font-medium text-sm">{student.name}</td>

                    <td className="p-4">
                      <select
                        onChange={(e) =>
                          assignMentor(student.id, e.target.value)
                        }
                        className="border border-cyan-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="default">Select Mentor</option>

                        {mentors.map((mentor) => (
                          <option key={mentor.id} value={mentor.id}>
                            {mentor.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CURRENT ASSIGNMENTS */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-violet-600 to-purple-500 p-5">
            <h2 className="text-2xl font-bold text-white">
              Current Assignments
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-violet-50">
                <tr>
                  <th className="p-4 text-left text-sm">Student</th>

                  <th className="p-4 text-left text-sm">Mentor</th>

                  <th className="p-4 text-left text-sm">Action</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-t hover:bg-violet-50 transition"
                  >
                    <td className="p-4 font-medium text-sm">
                      {assignment.student?.name}
                    </td>

                    <td className="p-4 text-slate-700 text-sm">
                      {assignment.mentor?.name}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => removeAssignment(assignment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
