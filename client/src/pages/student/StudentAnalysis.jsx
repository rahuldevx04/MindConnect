import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useUser,
} from "@clerk/clerk-react";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import Navbar
from "../../components/ui/Navbar";

const COLORS = [

  "#10b981",

  "#ef4444",

  "#f59e0b",

];

function StudentAnalysis() {

  // CLERK USER
  const { user } =
    useUser();

  const [
    posts,
    setPosts,
  ] = useState([]);

  const [
    stats,
    setStats,
  ] = useState({

    positive: 0,

    negative: 0,

    neutral: 0,

    moodAverage: 0,

  });

  // ==========================
  // FETCH POSTS
  // ==========================

  const fetchPosts =
    async () => {

      try {

        if (!user) return;

        const response =
          await axios.get(
  `${import.meta.env.VITE_API_URL}/api/posts/user/${user.id}`
          );

        setPosts(
          response.data
        );

        calculateStats(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };

  // ==========================
  // INITIAL LOAD
  // ==========================

  useEffect(() => {

    if (user) {

      fetchPosts();

    }

  }, [user]);

  // ==========================
  // CALCULATE ANALYTICS
  // ==========================

  const calculateStats =
    (data) => {

      let positive = 0;

      let negative = 0;

      let neutral = 0;

      let totalMood = 0;

      data.forEach(
        (post) => {

          if (
            post.sentiment ===
            "positive"
          ) {

            positive++;

          }

          else if (
            post.sentiment ===
            "negative"
          ) {

            negative++;

          }

          else {

            neutral++;

          }

          totalMood +=
            post.mood_score || 50;

        }
      );

      const moodAverage =

        data.length > 0

          ? Math.floor(
              totalMood /
              data.length
            )

          : 50;

      setStats({

        positive,

        negative,

        neutral,

        moodAverage,

      });

    };

  // ==========================
  // PIE DATA
  // ==========================

  const pieData = [

    {
      name: "Positive",
      value:
        stats.positive,
    },

    {
      name: "Negative",
      value:
        stats.negative,
    },

    {
      name: "Neutral",
      value:
        stats.neutral,
    },

  ];

  // ==========================
  // MOOD TREND GRAPH
  // ==========================

  const moodTrendData =
    posts
      .slice()
      .reverse()
      .map(
        (
          post,
          index
        ) => ({

          post:
            `Post ${index + 1}`,

          mood:
            post.mood_score || 50,

        })
      );

  // ==========================
  // STRESS DISTRIBUTION
  // ==========================

  const stressData = [

    {
      level: "Low",

      count:
        posts.filter(
          (p) =>
            p.stress_level ===
            "Low"
        ).length,
    },

    {
      level: "Medium",

      count:
        posts.filter(
          (p) =>
            p.stress_level ===
            "Medium"
        ).length,
    },

    {
      level: "High",

      count:
        posts.filter(
          (p) =>
            p.stress_level ===
            "High"
        ).length,
    },

  ];

  // ==========================
  // OVERALL STRESS LEVEL
  // ==========================

  let stressLevel =
    "Medium";

  if (
    stats.moodAverage >= 75
  ) {

    stressLevel =
      "Low";

  }

  else if (
    stats.moodAverage <= 40
  ) {

    stressLevel =
      "High";

  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">

      <Navbar role="student" />

      <div className="p-5 md:p-8">

        {/* HERO SECTION */}

        <div className="bg-white border border-cyan-100 rounded-3xl shadow-lg p-8 mb-10">

          <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">

            AI Wellness Analytics

          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">

            Your

            <span className="block text-cyan-600 mt-1">

              Wellness Analysis

            </span>

          </h1>

          <p className="text-slate-600 text-base mt-5 leading-8 max-w-3xl">

            AI-powered emotional wellness,
            stress monitoring,
            mood tracking,
            and personalized mental health insights.

          </p>

        </div>

        {/* ANALYTICS CARDS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          {/* POSTS */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-slate-500 text-sm font-medium">

              Total Thoughts

            </h2>

            <h1 className="text-4xl font-bold text-violet-500 mt-4">

              {posts.length}

            </h1>

            <p className="text-slate-500 text-sm leading-7 mt-4">

              Emotional thoughts shared anonymously on the platform.

            </p>

          </div>

          {/* MOOD */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-slate-500 text-sm font-medium">

              Mood Score

            </h2>

            <h1 className="text-4xl font-bold text-pink-500 mt-4">

              {stats.moodAverage}%

            </h1>

            <p className="text-slate-500 text-sm leading-7 mt-4">

              AI-generated emotional wellness score from your posts.

            </p>

          </div>

          {/* STRESS */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-slate-500 text-sm font-medium">

              Stress Level

            </h2>

            <h1 className="text-4xl font-bold text-red-500 mt-4">

              {stressLevel}

            </h1>

            <p className="text-slate-500 text-sm leading-7 mt-4">

              AI emotional stress prediction based on recent thoughts.

            </p>

          </div>

          {/* POSITIVE */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-slate-500 text-sm font-medium">

              Positive Thoughts

            </h2>

            <h1 className="text-4xl font-bold text-green-500 mt-4">

              {stats.positive}

            </h1>

            <p className="text-slate-500 text-sm leading-7 mt-4">

              Positive emotional expressions identified using NLP.

            </p>

          </div>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

          {/* EMOTIONAL DISTRIBUTION */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-3xl font-bold text-slate-900 mb-3">

              Emotional Distribution

            </h2>

            <p className="text-slate-500 text-sm leading-7 mb-6">

              Visualization of positive,
              negative,
              and neutral emotional activity.

            </p>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <PieChart>

                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  dataKey="value"
                  label
                >

                  {pieData.map(
                    (
                      entry,
                      index
                    ) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[index]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* MOOD TREND */}

          <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7">

            <h2 className="text-3xl font-bold text-slate-900 mb-3">

              Mood Trend Analysis

            </h2>

            <p className="text-slate-500 text-sm leading-7 mb-6">

              Analyze emotional wellness progression
              and mood score changes over time.

            </p>

            <ResponsiveContainer
              width="100%"
              height={320}
            >

              <BarChart
                data={
                  moodTrendData
                }
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="post" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="mood"
                  fill="#14b8a6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* STRESS GRAPH */}

        <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-7 mb-10">

          <h2 className="text-3xl font-bold text-slate-900 mb-3">

            Stress Distribution

          </h2>

          <p className="text-slate-500 text-sm leading-7 mb-6">

            AI-generated emotional stress categorization
            based on your wellness activity.

          </p>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <PieChart>

              <Pie
                data={stressData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                dataKey="count"
                nameKey="level"
                label
              >

                <Cell fill="#22c55e" />

                <Cell fill="#f59e0b" />

                <Cell fill="#ef4444" />

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

export default StudentAnalysis;