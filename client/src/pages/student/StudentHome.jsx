import { useEffect, useState } from "react";

import axios from "axios";

import { useUser } from "@clerk/clerk-react";

import Navbar from "../../components/ui/Navbar";

import { MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Badge } from "@/components/ui/badge";

import {
  Brain,
  HeartPulse,
  Users,
  NotebookPen,
  Sparkles,
} from "lucide-react";

function StudentHome() {

  const { user } =
    useUser();

  const [thought, setThought] =
    useState("");

  const [posts, setPosts] =
    useState([]);

  const [moodScore, setMoodScore] =
    useState(50);

  const [stressLevel, setStressLevel] =
    useState("Medium");

  const [mentorStatus, setMentorStatus] =
    useState("Not Connected");

  // FETCH POSTS
  const fetchPosts =
    async () => {

      try {

        if (!user)
          return;

        const response =
  await axios.get(
    `${import.meta.env.VITE_API_URL}/api/posts/user/${user.id}`
  );

const postsData = Array.isArray(response.data)
  ? response.data
  : [];

setPosts(postsData);

calculateAnalytics(postsData);
      } catch (error) {

        console.log(error);

      }

    };

  // CHECK MENTOR
 const checkMentor =
  async () => {

    try {

      if (!user)
        return;

      // Get current user from DB

      const usersResponse =
        await axios.get(
  `${import.meta.env.VITE_API_URL}/api/admin/users`
);


      const users = Array.isArray(usersResponse.data)
  ? usersResponse.data
  : [];
console.log("Users API:", usersResponse.data);
console.log("Assignments API:", assignmentsResponse.data);
const currentUser =
  users.find(
    (u) => u.clerk_id === user.id
  );

      if (!currentUser) {

        setMentorStatus(
          "Not Connected"
        );

        return;

      }

      // Get assignments

      const assignmentsResponse =
        await axios.get(
  `${import.meta.env.VITE_API_URL}/api/admin/assignments`
);

      const assignments = Array.isArray(assignmentsResponse.data)
  ? assignmentsResponse.data
  : [];

const found =
  assignments.find(
    (assignment) =>
      assignment.student?.id === currentUser.id
  );

      if (found) {

        setMentorStatus(
          `Connected - ${found.mentor?.name}`
        );

      } else {

        setMentorStatus(
          "Not Connected"
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  // ANALYTICS
  const calculateAnalytics =
    (
      allPosts
    ) => {

      if (
        allPosts.length === 0
      ) {

        setMoodScore(50);

        setStressLevel(
          "Medium"
        );

        return;

      }

      let totalMood = 0;

      let highStress = 0;

      let mediumStress = 0;

      allPosts.forEach(
        (post) => {

          totalMood +=
            post.mood_score || 50;

          if (
            post.stress_level ===
            "High"
          ) {

            highStress++;

          }

          else if (
            post.stress_level ===
            "Medium"
          ) {

            mediumStress++;

          }

        }
      );

      const averageMood =
        Math.floor(
          totalMood /
            allPosts.length
        );

      setMoodScore(
        averageMood
      );

      if (
        highStress >= 3
      ) {

        setStressLevel(
          "High"
        );

      }

      else if (
        mediumStress >= 1
      ) {

        setStressLevel(
          "Medium"
        );

      }

      else {

        setStressLevel(
          "Low"
        );

      }

    };

  // INITIAL LOAD
  useEffect(() => {

    if (user) {

      fetchPosts();

      checkMentor();

    }

  }, [user]);

  // SUBMIT POST
  const submitPost =
    async () => {

      if (!thought)
        return;

      try {

        await axios.get(
  `${import.meta.env.VITE_API_URL}/api/posts`,
          {
            user_id:
              user.id,

            content:
              thought,
          }
        );

        setThought("");

        fetchPosts();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">

      {/* NAVBAR */}
      <Navbar role="student" />

      <div className="p-5 md:p-8 space-y-8">

        {/* HERO */}

        <div className="bg-white border border-cyan-100 rounded-3xl p-7 shadow-lg">

          <div className="inline-block bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">

            AI Wellness Dashboard

          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight">

            Student

            <span className="block text-cyan-600 mt-1">

              Wellness Center

            </span>

          </h1>

          <p className="text-slate-600 text-sm md:text-base mt-4 max-w-3xl leading-7">

            Track your emotional wellness,
            share anonymous thoughts,
            monitor stress levels,
            and connect with mentors for better mental wellbeing.

          </p>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* STRESS */}

          <Card className="rounded-3xl shadow-md border-0 hover:shadow-xl transition duration-300">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-lg font-semibold text-slate-700">

                Stress Level

              </CardTitle>

              <div className="bg-red-100 p-3 rounded-2xl">

                <Brain className="text-red-500 w-6 h-6" />

              </div>

            </CardHeader>

            <CardContent>

              <h2 className="text-3xl font-bold text-red-500">

                {stressLevel}

              </h2>

              <p className="text-slate-500 mt-3 text-sm leading-6">

                AI-powered emotional stress prediction
                based on recent thought patterns.

              </p>

            </CardContent>

          </Card>

          {/* MOOD */}

          <Card className="rounded-3xl shadow-md border-0 hover:shadow-xl transition duration-300">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-lg font-semibold text-slate-700">

                Mood Score

              </CardTitle>

              <div className="bg-pink-100 p-3 rounded-2xl">

                <HeartPulse className="text-pink-500 w-6 h-6" />

              </div>

            </CardHeader>

            <CardContent>

              <h2 className="text-3xl font-bold text-pink-500">

                {moodScore}%

              </h2>

              <p className="text-slate-500 mt-3 text-sm leading-6">

                NLP-generated emotional wellness score
                calculated from your posts.

              </p>

            </CardContent>

          </Card>

          {/* MENTOR */}

          <Card className="rounded-3xl shadow-md border-0 hover:shadow-xl transition duration-300">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-lg font-semibold text-slate-700">

                Mentor Status

              </CardTitle>
              

              <div className="bg-blue-100 p-3 rounded-2xl">

                <Users className="text-blue-500 w-6 h-6" />

              </div>

            </CardHeader>

            <CardContent>

              <h2 className="text-2xl font-bold text-blue-500">

                {mentorStatus}

              </h2>

              <p className="text-slate-500 mt-3 text-sm leading-6">

                Current mentor support availability
                for emotional guidance and wellbeing.

              </p>

            </CardContent>

          </Card>

          

          {/* POSTS */}

          <Card className="rounded-3xl shadow-md border-0 hover:shadow-xl transition duration-300">

            <CardHeader className="flex flex-row items-center justify-between pb-2">

              <CardTitle className="text-lg font-semibold text-slate-700">

                Anonymous Posts

              </CardTitle>

              <div className="bg-violet-100 p-3 rounded-2xl">

                <NotebookPen className="text-violet-500 w-6 h-6" />

              </div>

            </CardHeader>

            <CardContent>

              <h2 className="text-3xl font-bold text-violet-500">

                {posts.length}

              </h2>

              <p className="text-slate-500 mt-3 text-sm leading-6">

                Total anonymous thoughts shared
                on the platform.

              </p>

            </CardContent>

          </Card>

        </div>

        

        {/* CREATE POST */}

        <Card className="rounded-3xl shadow-lg border-0">

          <CardHeader>

            <div className="flex items-center gap-3 mb-2">

              <Sparkles className="text-cyan-600 w-7 h-7" />

              <CardTitle className="text-2xl font-bold text-cyan-600">

                Share Your Thoughts

              </CardTitle>

            </div>

            <p className="text-slate-600 text-sm leading-7">

              Express your feelings anonymously.
              AI analyzes your thoughts to help improve emotional wellness support.

            </p>

          </CardHeader>

          <CardContent className="space-y-5">

            <Textarea
              value={thought}
              onChange={(e) =>
                setThought(
                  e.target.value
                )
              }
              placeholder="Write what's on your mind..."
              className="min-h-[180px] rounded-2xl border-cyan-100 focus-visible:ring-cyan-400"
            />

            <div className="flex justify-between items-center">

              <Badge className="bg-cyan-500 hover:bg-cyan-500 text-white px-4 py-2 rounded-xl">

                Anonymous Mode Enabled

              </Badge>

              <Button
                onClick={submitPost}
                className="bg-cyan-600 hover:bg-cyan-700 rounded-xl px-6"
              >

                Post Thought

              </Button>

            </div>

          </CardContent>

        </Card>

        {/* POSTS */}

        <div>

          {/* TITLE */}

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl md:text-3xl font-bold text-cyan-600">

                Recent Anonymous Thoughts

              </h2>

              <p className="text-slate-500 text-sm md:text-base mt-2 leading-7">

                View your latest emotional reflections,
                AI mood analysis,
                stress indicators,
                and anonymous wellness activity.

              </p>

            </div>

            {/* POSTS COUNT */}

            <div className="bg-cyan-100 text-cyan-700 px-5 py-3 rounded-2xl shadow-sm w-fit">

              <span className="text-sm font-semibold">

                Total Posts:

              </span>

              <span className="text-lg font-bold ml-2">

                {posts.length}

              </span>

            </div>

          </div>

          {/* POSTS LIST */}

          <div className="space-y-6">

            {posts
              .slice(0, 5)
              .map((post) => (

                <Card
                  key={post.id}
                  className="rounded-3xl border border-cyan-100 bg-white shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >

                  {/* TOP BORDER */}

                  <div className="h-2 bg-gradient-to-r from-cyan-500 via-teal-500 to-blue-500" />

                  <CardContent className="p-7">

                    {/* HEADER */}

                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">

                      {/* USER */}

                      <div className="flex items-center gap-4">

                        {/* AVATAR */}

                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">

                          A

                        </div>

                        {/* DETAILS */}

                        <div>

                          <h3 className="text-lg font-bold text-slate-900">

                            Anonymous Student

                          </h3>

                          <p className="text-sm text-slate-500 mt-1">

                            {post.anonymous_id}

                          </p>

                        </div>

                      </div>

                      {/* DATE */}

                      <div className="bg-slate-100 text-slate-600 text-xs px-4 py-2 rounded-xl font-medium shadow-sm">

                        {new Date(
                          post.created_at
                        ).toLocaleString()}

                      </div>

                    </div>

                    {/* CONTENT */}

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">

                      <p className="text-slate-700 text-base leading-8">

                        {post.content}

                      </p>

                    </div>

                    {/* BADGES */}

                    <div className="flex flex-wrap gap-3 mt-6">

                      {/* SENTIMENT */}

                      <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100 rounded-xl px-4 py-2 text-sm font-semibold border-0">

                        Sentiment:
                        {" "}
                        {post.sentiment}

                      </Badge>

                      {/* MOOD */}

                      <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100 rounded-xl px-4 py-2 text-sm font-semibold border-0">

                        Mood Score:
                        {" "}
                        {post.mood_score}

                      </Badge>

                      {/* STRESS */}

                      <Badge className="bg-red-100 text-red-700 hover:bg-red-100 rounded-xl px-4 py-2 text-sm font-semibold border-0">

                        Stress:
                        {" "}
                        {post.stress_level}

                      </Badge>

                    </div>

                  </CardContent>

                </Card>

              ))}

          </div>

        </div>

      </div>

    </div>

    

  );

}

export default StudentHome;