import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useUser,
} from "@clerk/clerk-react";

import Navbar
from "../../components/ui/Navbar";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  Badge,
} from "../../components/ui/badge";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
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

  Brain,

  AlertTriangle,

  Activity,

  HeartPulse,

  MessageCircle,

} from "lucide-react";

function MentorAnalysis() {

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

    totalStudents: 0,

    highStress: 0,

    avgMood: 0,

    positive: 0,

    negative: 0,

    neutral: 0,

    totalPosts: 0,

  });

  // ====================================
  // FETCH MENTOR POSTS
  // ====================================

 const fetchMentorData =
  async () => {

    try {

      if (!user?.id)
        return;

      const response =
        await axios.get(
          `http://localhost:5000/api/posts/mentor/${user.id}`
        );

      const postsData =
        response.data.posts || [];

      const totalStudents =
        response.data.totalStudents || 0;

      setPosts(postsData);

      calculateStats(
        postsData,
        totalStudents
      );

    } catch (error) {

      console.log(error);

    }

  };
  useEffect(() => {

    if (user) {

      fetchMentorData();

    }

  }, [user]);

  // ====================================
  // CALCULATE STATS
  // ====================================

 const calculateStats =
  (
    data,
    assignedStudents = 0
  ) => {
      let positive = 0;

      let negative = 0;

      let neutral = 0;

      let moodTotal = 0;

      let highStress = 0;

      const uniqueStudents =
        new Set();

      data.forEach(
        (post) => {

          uniqueStudents.add(
            post.user_id
          );

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

          moodTotal +=
            post.mood_score || 50;

          if (
            post.stress_level ===
            "High"
          ) {

            highStress++;

          }

        }
      );

      const avgMood =

        data.length > 0

          ? Math.floor(
              moodTotal /
              data.length
            )

          : 0;

      setStats({

      totalStudents:
  assignedStudents,

        highStress,

        avgMood,

        positive,

        negative,

        neutral,

        totalPosts:
          data.length,

      });

    };

// ====================================
// CHART DATA
// ====================================

const sentimentData = [
  {
    name: "Positive",
    value: stats.positive,
  },
  {
    name: "Negative",
    value: stats.negative,
  },
  {
    name: "Neutral",
    value: stats.neutral,
  },
];

const moodTrendData = Array.isArray(posts)
  ? posts.map((post, index) => ({
      post: `Post ${index + 1}`,
      mood: post.mood_score || 50,
    }))
  : [];

const stressData = [
  {
    level: "Low",
    count: Array.isArray(posts)
      ? posts.filter(
          (p) => p.stress_level === "Low"
        ).length
      : 0,
  },

  {
    level: "Medium",
    count: Array.isArray(posts)
      ? posts.filter(
          (p) => p.stress_level === "Medium"
        ).length
      : 0,
  },

  {
    level: "High",
    count: Array.isArray(posts)
      ? posts.filter(
          (p) => p.stress_level === "High"
        ).length
      : 0,
  },
];

const COLORS = [
  "#22c55e",
  "#ef4444",
  "#14b8a6",
];

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">

      {/* NAVBAR */}

      <Navbar role="mentor" />

      <div className="p-5 md:p-8 space-y-8">

        {/* HERO */}

        <div className="bg-white rounded-3xl shadow-lg border border-cyan-100 p-8">

          <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">

            Mentor Emotional Analytics

          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">

            Mentor

            <span className="block text-cyan-600 mt-1">

              Wellness Analysis

            </span>

          </h1>

          <p className="text-slate-600 text-base mt-5 leading-8 max-w-3xl">

            Analyze student emotional wellness,
            monitor stress trends,
            identify high-risk students,
            and provide effective mentorship support.

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* STUDENTS */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-500 text-sm">

                    Connected Students

                  </p>

                  <h2 className="text-4xl font-bold text-cyan-600 mt-4">

                    {stats.totalStudents}

                  </h2>

                </div>

                <Users className="text-cyan-600 w-10 h-10" />

              </div>

            </CardContent>

          </Card>

          {/* POSTS */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-500 text-sm">

                    Student Thoughts

                  </p>

                  <h2 className="text-4xl font-bold text-violet-500 mt-4">

                    {stats.totalPosts}

                  </h2>

                </div>

                <MessageCircle className="text-violet-500 w-10 h-10" />

              </div>

            </CardContent>

          </Card>

          {/* STRESS */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-500 text-sm">

                    High Stress Students

                  </p>

                  <h2 className="text-4xl font-bold text-red-500 mt-4">

                    {stats.highStress}

                  </h2>

                </div>

                <AlertTriangle className="text-red-500 w-10 h-10" />

              </div>

            </CardContent>

          </Card>

          {/* MOOD */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardContent className="p-7">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-slate-500 text-sm">

                    Average Mood

                  </p>

                  <h2 className="text-4xl font-bold text-green-500 mt-4">

                    {stats.avgMood}%

                  </h2>

                </div>

                <HeartPulse className="text-green-500 w-10 h-10" />

              </div>

            </CardContent>

          </Card>

        </div>

        {/* CHARTS */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* SENTIMENT */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardHeader>

              <CardTitle className="text-3xl font-bold text-slate-900">

                Emotional Distribution

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <PieChart>

                  <Pie
                    data={sentimentData}
                    dataKey="value"
                    outerRadius={110}
                    label
                  >

                    {sentimentData.map(
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

            </CardContent>

          </Card>

          {/* MOOD TREND */}

          <Card className="rounded-3xl shadow-lg border border-cyan-100">

            <CardHeader>

              <CardTitle className="text-3xl font-bold text-slate-900">

                Mood Trend Analysis

              </CardTitle>

            </CardHeader>

            <CardContent>

              <ResponsiveContainer
                width="100%"
                height={320}
              >

                <LineChart
                  data={
                    moodTrendData
                  }
                >

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="post" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#14b8a6"
                    strokeWidth={3}
                  />

                </LineChart>

              </ResponsiveContainer>

            </CardContent>

          </Card>

        </div>

        {/* STRESS GRAPH */}

        <Card className="rounded-3xl shadow-lg border border-cyan-100">

          <CardHeader>

            <CardTitle className="text-3xl font-bold text-slate-900">

              Stress Distribution

            </CardTitle>

          </CardHeader>

          <CardContent>

            <ResponsiveContainer
              width="100%"
              height={350}
            >

              <BarChart
                data={
                  stressData
                }
              >

                <CartesianGrid strokeDasharray="3 3" />

                <XAxis dataKey="level" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="count"
                  fill="#14b8a6"
                  radius={[10, 10, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </CardContent>

        </Card>

        {/* RECENT THOUGHTS */}

        <Card className="rounded-3xl shadow-lg border border-cyan-100">

          <CardHeader>

            <CardTitle className="text-3xl font-bold text-slate-900">

              Recent Student Thoughts

            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-5">

     {Array.isArray(posts) ? (
  posts.slice(0, 5).map((post) => (
                <div
                  key={post.id}
                  className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6"
                >

                  <p className="text-slate-700 leading-8">

                    {post.content}

                  </p>

                  <div className="flex flex-wrap gap-3 mt-5">

                    <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 border-0 rounded-full">

                      {post.sentiment}

                    </Badge>

                    <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 border-0 rounded-full">

                      Mood: {post.mood_score}

                    </Badge>

                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-0 rounded-full">

                      Stress: {post.stress_level}

                    </Badge>

                  </div>

                </div>

                ))
) : null}

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

export default MentorAnalysis;