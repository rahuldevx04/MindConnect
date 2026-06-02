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

  Users,

  MessageCircle,

  Brain,

  ShieldCheck,

  HeartHandshake,

  AlertTriangle,

} from "lucide-react";

function MentorHome() {

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

    activeChats: 0,

    wellnessScore: 0,

  });

  // ===================================
  // FETCH MENTOR POSTS
  // ===================================

 const fetchMentorData = async () => {
  try {
    if (!user?.id) return;

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/posts/mentor/${user.id}`
    );

    console.log("API DATA:", response.data);

    const postsData = response.data.posts || [];
    const totalStudents = response.data.totalStudents || 0;

    setPosts(postsData);

    calculateStats(postsData, totalStudents);

  } catch (error) {
    console.log("FETCH ERROR:", error);
  }
};

const calculateStats = (
  data,
  assignedStudents = 0
) => {

  let highStress = 0;

  let moodTotal = 0;

  data.forEach((post) => {

    moodTotal +=
      post.mood_score || 50;

    if (
      post.stress_level === "High"
    ) {
      highStress++;
    }

  });

  const wellnessScore =
    data.length > 0
      ? Math.floor(
          moodTotal / data.length
        )
      : 0;

  setStats({

    totalStudents:
      assignedStudents,

    highStress,

    activeChats:
      data.length,

    wellnessScore,

  });

};

  // ===================================
  // INITIAL LOAD
  // ===================================

  useEffect(() => {

    if (!user?.id)
      return;

    fetchMentorData();

    const interval =
      setInterval(() => {

        fetchMentorData();

      }, 3000);

    return () =>
      clearInterval(interval);

  }, [user?.id]);

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">

      {/* NAVBAR */}

      <Navbar role="mentor" />

      <div className="p-5 md:p-8 space-y-8">

        {/* HERO */}

        <div className="bg-white border border-cyan-100 rounded-3xl shadow-lg p-8">

          <div className="inline-block bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold mb-5">

            Mentor Wellness Portal

          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">

            Mentor

            <span className="block text-cyan-600 mt-1">

              Dashboard

            </span>

          </h1>

          <p className="text-slate-600 text-base mt-5 leading-8 max-w-3xl">

            Support students emotionally,
            monitor wellness trends,
            identify high-risk students,
            and provide impactful mental health guidance.

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* STUDENTS */}

          <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-slate-500">

                Connected Students

              </CardTitle>

              <Users className="text-cyan-600 w-6 h-6" />

            </CardHeader>

            <CardContent>

              <h2 className="text-4xl font-bold text-cyan-600">

                {stats.totalStudents}

              </h2>

              <p className="text-slate-500 mt-4 leading-7 text-sm">

                Students assigned for emotional wellness mentoring.

              </p>

            </CardContent>

          </Card>

          {/* STRESS */}

          <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-slate-500">

                High Stress Alerts

              </CardTitle>

              <AlertTriangle className="text-red-500 w-6 h-6" />

            </CardHeader>

            <CardContent>

              <h2 className="text-4xl font-bold text-red-500">

                {stats.highStress}

              </h2>

              <p className="text-slate-500 mt-4 leading-7 text-sm">

                Students currently showing high emotional stress indicators.

              </p>

            </CardContent>

          </Card>

          {/* POSTS */}

          <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-slate-500">

                Student Thoughts

              </CardTitle>

              <MessageCircle className="text-emerald-500 w-6 h-6" />

            </CardHeader>

            <CardContent>

              <h2 className="text-4xl font-bold text-emerald-500">

                {stats.activeChats}

              </h2>

              <p className="text-slate-500 mt-4 leading-7 text-sm">

                Total student emotional thoughts shared.

              </p>

            </CardContent>

          </Card>

          {/* WELLNESS */}

          <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-sm font-medium text-slate-500">

                Wellness Score

              </CardTitle>

              <Brain className="text-violet-500 w-6 h-6" />

            </CardHeader>

            <CardContent>

              <h2 className="text-4xl font-bold text-violet-500">

                {stats.wellnessScore}%

              </h2>

              <p className="text-slate-500 mt-4 leading-7 text-sm">

                Average emotional wellness score across assigned students.

              </p>

            </CardContent>

          </Card>

        </div>

        {/* STUDENT FEED */}

        <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

          <CardHeader>

            <CardTitle className="text-3xl font-bold text-slate-900">

              Student Wellness Feed

            </CardTitle>

            <p className="text-slate-500 text-sm leading-7 mt-2">

              Real-time emotional thoughts and stress indicators
              from assigned students.

            </p>

          </CardHeader>
          {/* <div className="bg-yellow-100 p-4 rounded-xl mb-4">
  <p>Mentor ID: {user?.id}</p>
  <p>Posts Count: {posts.length}</p>
</div> */}

          <CardContent className="space-y-6">

            {!Array.isArray(posts) ||
            posts.length === 0 ? (

              <div className="text-center py-10 text-slate-500">

                No student thoughts available yet.

              </div>

            ) : (

              posts
                .slice(0, 6)
                .map((post, index) => (

                  <div
                    key={
                      post?.id || index
                    }
                    className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6"
                  >

                    {/* CONTENT */}

                    <p className="text-slate-700 leading-8 text-base">

                      {post?.content || "No content"}

                    </p>

                    {/* BADGES */}

                    <div className="flex flex-wrap gap-3 mt-5">

                      <Badge className="bg-cyan-100 text-cyan-700 border-0 rounded-full">

                        {post?.sentiment || "neutral"}

                      </Badge>

                      <Badge className="bg-pink-100 text-pink-700 border-0 rounded-full">

                        Mood:
                        {" "}
                        {post?.mood_score || 0}

                      </Badge>

                      <Badge className="bg-red-100 text-red-700 border-0 rounded-full">

                        Stress:
                        {" "}
                        {post?.stress_level || "Low"}

                      </Badge>

                      <Badge className="bg-slate-100 text-slate-700 border-0 rounded-full">

                     {post?.name || "Student"}

                      </Badge>

                    </div>

                  </div>

                ))

            )}

          </CardContent>

        </Card>

        {/* GUIDELINES */}

        <Card className="rounded-3xl border border-cyan-100 shadow-lg bg-white">

          <CardHeader>

            <CardTitle className="text-3xl font-bold text-slate-900">

              Mentor Guidelines

            </CardTitle>

            <p className="text-slate-500 text-sm leading-7 mt-2">

              Best practices for providing healthy,
              empathetic,
              and impactful emotional mentorship.

            </p>

          </CardHeader>

          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6">

              <ShieldCheck className="text-cyan-600 w-10 h-10 mb-5" />

              <h3 className="text-xl font-bold text-slate-900 mb-3">

                Active Listening

              </h3>

              <p className="text-slate-600 leading-7">

                Encourage students to express their thoughts openly
                without fear of judgment or criticism.

              </p>

            </div>

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6">

              <HeartHandshake className="text-pink-500 w-10 h-10 mb-5" />

              <h3 className="text-xl font-bold text-slate-900 mb-3">

                Emotional Support

              </h3>

              <p className="text-slate-600 leading-7">

                Provide calm,
                empathetic,
                and reassuring guidance during stressful situations.

              </p>

            </div>

            <div className="rounded-3xl border border-cyan-100 bg-cyan-50/40 p-6">

              <Brain className="text-violet-500 w-10 h-10 mb-5" />

              <h3 className="text-xl font-bold text-slate-900 mb-3">

                Wellness Strategies

              </h3>

              <p className="text-slate-600 leading-7">

                Suggest healthy routines,
                mindfulness techniques,
                and balanced academic habits.

              </p>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>

  );

}

export default MentorHome;