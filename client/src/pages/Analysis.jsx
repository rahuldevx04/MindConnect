import { useEffect, useState } from "react";

import axios from "axios";

import Navbar from "../components/ui/Navbar";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
 Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

import {
  Users,
  Shield,
  Activity,
  BarChart3,
} from "lucide-react";

function Analysis() {

  const [users, setUsers] =
    useState([]);

  const [assignments, setAssignments] =
    useState([]);

  useEffect(() => {

    fetchUsers();

    fetchAssignments();

  }, []);

  // FETCH USERS
  const fetchUsers =
    async () => {

      try {

        const response =
          await axios.get(
            "http://localhost:5000/api/admin/users"
          );

        setUsers(response.data);

      } catch (error) {

        console.log(error);

      }

    };

  // FETCH ASSIGNMENTS
  const fetchAssignments =
    async () => {

      try {

        const response =
          await axios.get(
  `${import.meta.env.VITE_API_URL}/api/admin/assignments`
          );

        setAssignments(response.data);

      } catch (error) {

        console.log(error);

      }

    };

  // ROLE DATA
  const students =
    users.filter(
      (u) =>
        u.role ===
        "student"
    ).length;

  const mentors =
    users.filter(
      (u) =>
        u.role ===
        "mentor"
    ).length;

  const admins =
    users.filter(
      (u) =>
        u.role ===
        "admin"
    ).length;

  const roleData = [

    {
      name: "Students",
      value: students,
    },

    {
      name: "Mentors",
      value: mentors,
    },

    {
      name: "Admins",
      value: admins,
    },

  ];

  // MENTOR LOAD
  const mentorLoad =
    assignments.reduce(
      (
        acc,
        item
      ) => {

        const mentor =
          item.mentor?.name;

        if (!mentor)
          return acc;

        const existing =
          acc.find(
            (m) =>
              m.name === mentor
          );

        if (existing) {

          existing.students += 1;

        }

        else {

          acc.push({

            name: mentor,

            students: 1,

          });

        }

        return acc;

      },
      []
    );

  // MOCK STRESS DATA
  const stressData = [

    {
      day: "Mon",
      stress: 3,
    },

    {
      day: "Tue",
      stress: 5,
    },

    {
      day: "Wed",
      stress: 4,
    },

    {
      day: "Thu",
      stress: 7,
    },

    {
      day: "Fri",
      stress: 6,
    },

    {
      day: "Sat",
      stress: 4,
    },

  ];

  const COLORS = [
    "#0891B2",
    "#14B8A6",
    "#8B5CF6",
  ];

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">

      {/* NAVBAR */}
      <Navbar role="admin" />

      <div className="p-5 md:p-8 space-y-8">

        {/* HERO SECTION */}

        <div className="bg-white border border-cyan-100 rounded-3xl p-7 shadow-lg">

          <div className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">

            AI Analytics Dashboard

          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">

            Platform

            <span className="block text-cyan-600 mt-1">

              Analytics Center

            </span>

          </h1>

          <p className="text-slate-600 text-sm md:text-base mt-4 max-w-3xl leading-7">

            Gain insights into platform activity,
            mentor workload distribution,
            student wellness trends,
            and overall system performance using intelligent analytics.

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* USERS */}

          <div className="bg-white rounded-3xl shadow-md p-7 hover:shadow-xl transition duration-300">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-cyan-600">

                  Total Users

                </h2>

                <p className="text-4xl font-bold text-slate-900 mt-4">

                  {users.length}

                </p>

              </div>

              <div className="bg-cyan-100 p-4 rounded-2xl">

                <Users className="text-cyan-600 w-8 h-8" />

              </div>

            </div>

          </div>

          {/* ASSIGNMENTS */}

          <div className="bg-white rounded-3xl shadow-md p-7 hover:shadow-xl transition duration-300">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-teal-600">

                  Assignments

                </h2>

                <p className="text-4xl font-bold text-slate-900 mt-4">

                  {assignments.length}

                </p>

              </div>

              <div className="bg-teal-100 p-4 rounded-2xl">

                <Shield className="text-teal-600 w-8 h-8" />

              </div>

            </div>

          </div>

          {/* MENTORS */}

          <div className="bg-white rounded-3xl shadow-md p-7 hover:shadow-xl transition duration-300">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-violet-600">

                  Active Mentors

                </h2>

                <p className="text-4xl font-bold text-slate-900 mt-4">

                  {mentors}

                </p>

              </div>

              <div className="bg-violet-100 p-4 rounded-2xl">

                <Activity className="text-violet-600 w-8 h-8" />

              </div>

            </div>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* PIE CHART */}

          <div className="bg-white rounded-3xl shadow-lg p-7">

            <div className="flex items-center gap-3 mb-6">

              <BarChart3 className="text-cyan-600 w-7 h-7" />

              <h2 className="text-2xl font-bold text-slate-900">

                User Roles

              </h2>

            </div>

            <p className="text-slate-600 text-sm leading-7 mb-5">

              Distribution of students,
              mentors, and administrators
              using the MindConnect platform.

            </p>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={roleData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >

                    {roleData.map(
                      (
                        entry,
                        index
                      ) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[
                              index %
                              COLORS.length
                            ]
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

          {/* BAR CHART */}

          <div className="bg-white rounded-3xl shadow-lg p-7">

            <div className="flex items-center gap-3 mb-6">

              <Shield className="text-teal-600 w-7 h-7" />

              <h2 className="text-2xl font-bold text-slate-900">

                Mentor Workload

              </h2>

            </div>

            <p className="text-slate-600 text-sm leading-7 mb-5">

              Analyze mentor assignment distribution
              to ensure balanced emotional support
              and guidance across students.

            </p>

            <div className="h-[320px]">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart data={mentorLoad}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="name" />

                  <YAxis />

                  <Tooltip />

                  <Bar
                    dataKey="students"
                    fill="#0891B2"
                    radius={[10, 10, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* LINE CHART */}

        <div className="bg-white rounded-3xl shadow-lg p-7">

          <div className="flex items-center gap-3 mb-6">

            <Activity className="text-red-500 w-7 h-7" />

            <h2 className="text-2xl font-bold text-slate-900">

              Student Stress Analysis

            </h2>

          </div>

          <p className="text-slate-600 text-sm leading-7 mb-6">

            Weekly emotional wellness trend analysis
            based on student mood activity,
            stress indicators,
            and AI-powered behavioral insights.

          </p>

          <div className="h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <LineChart data={stressData}>

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#EF4444"
                  strokeWidth={4}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </div>

  );

}

export default Analysis;