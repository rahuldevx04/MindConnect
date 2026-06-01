import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import {
  useUser,
} from "@clerk/clerk-react";

import Navbar from "../../components/ui/Navbar";
function StudentChat() {

  const { user } =
    useUser();

const messagesEndRef =
  useRef(null);

  const [mentor, setMentor] =
    useState(null);

  const [student, setStudent] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

    const [message, setMessage] =
  useState("");


  // ======================================
  // MARK MESSAGES READ
  // ======================================

  const markAsRead =
    async (
      studentId,
      mentorId
    ) => {

      try {

        await axios.put(
          "import.meta.env.VITE_API_URL/api/chat/mark-read",
          {
            student_id:
              studentId,

            mentor_id:
              mentorId,

            reader_role:
              "student",
          }
        );

      } catch (error) {

        console.log(
          "READ ERROR:",
          error
        );

      }

    };

  // ======================================
  // LOAD CHAT
  // ======================================

  const loadChat =
    async () => {

      try {

        const info =
          await axios.get(
            `import.meta.env.VITE_API_URL/api/chat/student-info/${user.id}`
          );

        setStudent(
          info.data.student
        );

        setMentor(
          info.data.mentor
        );

        const chat =
          await axios.get(
            `import.meta.env.VITE_API_URL/api/chat/${info.data.student.id}/${info.data.mentor.id}`
          );

        setMessages(
          chat.data
        );

        await markAsRead(
          info.data.student.id,
          info.data.mentor.id
        );

      } catch (error) {

        console.log(
          "CHAT ERROR:",
          error
        );

      }

    };

  // ======================================
  // SEND MESSAGE
  // ======================================

  const sendMessage =
    async () => {

      if (
        !message.trim() ||
        !student ||
        !mentor
      ) {
        return;
      }

      try {

        await axios.post(
          "import.meta.env.VITE_API_URL/api/chat",
          {
            student_id:
              student.id,

            mentor_id:
              mentor.id,

            sender_id:
              student.id,

            sender_role:
              "student",

            message,
          }
        );

        setMessage("");

        loadChat();

      } catch (error) {

        console.log(
          "SEND ERROR:",
          error
        );

      }

    };



  // ======================================
  // INITIAL LOAD
  // ======================================

  useEffect(() => {

    if (!user?.id)
      return;

    loadChat();

    const interval =
      setInterval(
        loadChat,
        2000
      );

    return () =>
      clearInterval(
        interval
      );

      

  }, [user]);

  return (

    <div className="h-screen bg-slate-50 overflow-hidden">

      <Navbar role="student" />

    <div className="max-w-5xl mx-auto p-4 h-[calc(100vh-90px)]">

       <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full flex flex-col">

          {/* HEADER */}

          <div className="p-5 border-b bg-slate-50">

            <h2 className="font-bold text-xl">

              {mentor
                ? mentor.name
                : "Loading Mentor..."}

            </h2>
<p className="text-sm text-emerald-500 font-medium">

  Available for support

</p>
          </div>
<div className="flex-1 overflow-y-auto px-6 py-4 bg-slate-50">

  <div className="space-y-2">

    {messages.map((msg) => (

      <div
        key={msg.id}
        className={`flex ${
          msg.sender_role === "student"
            ? "justify-end"
            : "justify-start"
        }`}
      >

        <div
          className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-sm ${
            msg.sender_role === "student"
              ? "bg-cyan-500 text-white rounded-br-md"
              : "bg-white border border-slate-200 text-slate-800 rounded-bl-md"
          }`}
        >

          <p className="text-sm leading-relaxed">
            {msg.message}
          </p>

          <div
            className={`flex justify-end items-center gap-2 text-[10px] mt-2 ${
              msg.sender_role === "student"
                ? "text-cyan-100"
                : "text-slate-400"
            }`}
          >

            <span>
             {new Date(msg.created_at).toLocaleTimeString(
  "en-IN",
  {
    hour: "2-digit",
    minute: "2-digit",
  }
)}
            </span>

            {msg.sender_role === "student" && (
              <span>
                {msg.is_read
                  ? "✓✓ Seen"
                  : "✓ Sent"}
              </span>
            )}

          </div>

        </div>

      </div>

    ))}

    {/* <div ref={messagesEndRef} /> */}

  </div>

</div>

          {/* INPUT */}

          <div className="border-t p-4 flex gap-3">

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (
                  e.key ===
                  "Enter"
                ) {

                  sendMessage();

                }

              }}
              placeholder="Type a message..."
              className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

            <button
              onClick={
                sendMessage
              }
              className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-xl transition"
            >

            ➤ Send

            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default StudentChat;