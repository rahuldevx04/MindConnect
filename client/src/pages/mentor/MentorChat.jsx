import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import {
  useUser,
} from "@clerk/clerk-react";

import Navbar from "../../components/ui/Navbar";

function MentorChat() {

  const { user } =
    useUser();

  const [mentor, setMentor] =
    useState(null);

  const [students, setStudents] =
    useState([]);

  const [
    selectedStudent,
    setSelectedStudent,
  ] = useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

    const [
  unreadCounts,
  setUnreadCounts,
] = useState({});

  // ======================================
  // LOAD ASSIGNED STUDENTS
  // ======================================
const loadStudents = async () => {
  try {
    if (!user?.id) return;

   const res = await axios.get(
  `${import.meta.env.VITE_API_URL}/api/chat/mentor-students/${user.id}`
);

    console.log("CHAT DATA:");
    console.log(res.data);

    setMentor(res.data.mentor);
    setStudents(res.data.students || []);

  } catch (error) {
    console.log("LOAD STUDENTS ERROR:", error);
  }
};
  // ======================================
  // MARK AS READ
  // ======================================

  const markAsRead =
    async (studentId) => {

      try {

        if (!mentor)
          return;

        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/chat/mark-read`,
          {
            student_id:
              studentId,

            mentor_id:
              mentor.id,

            reader_role:
              "mentor",
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

const loadMessages =
  async (student) => {

    try {

      if (!mentor)
        return;

      const res =
        await axios.get(
          `${import.meta.env.VITE_API_URL}/api/chat/${student.id}/${mentor.id}`
        );

      setMessages(
        res.data
      );

      await markAsRead(
        student.id
      );

      // await loadUnreadCounts();

    } catch (error) {

      console.log(
        "LOAD CHAT ERROR:",
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
        !selectedStudent ||
        !mentor
      ) {
        return;
      }

      try {

        await axios.post(
  `${import.meta.env.VITE_API_URL}/api/chat`,
          {
            student_id:
              selectedStudent.id,

            mentor_id:
              mentor.id,

            sender_id:
              mentor.id,

            sender_role:
              "mentor",

            message,
          }
        );

        setMessage("");

        loadMessages(
          selectedStudent
        );

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

    if (
      user?.id
    ) {

      loadStudents();

    }

  }, [user]);

  useEffect(() => {

  if (!mentor)
    return;

  // loadUnreadCounts();

  // const interval =
  //   setInterval(
  //     loadUnreadCounts,
  //     2000
  //   );

  return () =>
    clearInterval(
      interval
    );

}, [mentor]);

  // ======================================
  // AUTO REFRESH
  // ======================================

  useEffect(() => {

    if (
      !selectedStudent ||
      !mentor
    ) {
      return;
    }

    loadMessages(
      selectedStudent
    );

    const interval =
      setInterval(
        () => {

          loadMessages(
            selectedStudent
          );

        },
        2000
      );

    return () =>
      clearInterval(
        interval
      );

  }, [
    selectedStudent,
    mentor,
  ]);

  return (

    <div className="min-h-screen bg-slate-100">

      <Navbar role="mentor" />

      <div className="max-w-7xl mx-auto p-6">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[80vh] flex">

          {/* LEFT PANEL */}

          <div className="w-80 border-r bg-white">

            <div className="p-4 border-b font-bold text-lg">

              Assigned Students

            </div>

            {students.length === 0 ? (

              <div className="p-4 text-slate-400">

                No students assigned

              </div>

            ) : (

              students.map(
                (student) => (

                  <div
                    key={
                      student.id
                    }
                    onClick={() =>
                      setSelectedStudent(
                        student
                      )
                    }
                    className={`p-4 border-b cursor-pointer hover:bg-slate-50 transition ${
                      selectedStudent?.id ===
                      student.id
                        ? "bg-cyan-50"
                        : ""
                    }`}
                  >

                   <div className="flex items-center justify-between">

  <div className="font-semibold">

    {
      student.name
    }

  </div>

  {unreadCounts[
    student.id
  ] > 0 && (

    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full min-w-[22px] text-center">

      {
        unreadCounts[
          student.id
        ]
      }

    </span>

  )}

</div>

<div className="text-xs text-slate-500">

  {
    student.email
  }

</div>
                  </div>

                )
              )

            )}

          </div>

          {/* RIGHT PANEL */}

          <div className="flex-1 flex flex-col">

            {!selectedStudent ? (

              <div className="flex-1 flex items-center justify-center text-slate-400 text-lg">

                Select a student to start chatting

              </div>

            ) : (

              <>

                {/* HEADER */}

                <div className="p-4 border-b bg-slate-50">

                  <h2 className="font-bold text-lg">

                    {
                      selectedStudent.name
                    }

                  </h2>

                  <p className="text-sm text-slate-500">

                    {
                      selectedStudent.email
                    }

                  </p>

                </div>

                {/* CHAT AREA */}

                <div className="flex-1 overflow-y-auto p-4 space-y-3">

                  {messages.length === 0 ? (

                    <div className="text-center text-slate-400 mt-10">

                      No messages yet

                    </div>

                  ) : (

                    messages.map(
                      (
                        msg
                      ) => (

                        <div
                          key={
                            msg.id
                          }
                          className={`flex ${
                            msg.sender_role ===
                            "mentor"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >

                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl break-words ${
                              msg.sender_role ===
                              "mentor"
                                ? "bg-cyan-500 text-white"
                                : "bg-slate-200 text-slate-800"
                            }`}
                          >

                            {
                              msg.message
                            }

                          </div>

                        </div>

                      )
                    )

                  )}

                </div>

                {/* INPUT */}

                <div className="border-t p-4 flex gap-3">

                  <input
                    type="text"
                    value={
                      message
                    }
                    onChange={(
                      e
                    ) =>
                      setMessage(
                        e.target
                          .value
                      )
                    }
                    onKeyDown={(
                      e
                    ) => {

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

                    Send

                  </button>

                </div>

              </>

            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default MentorChat;