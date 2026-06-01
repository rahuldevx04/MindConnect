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

} from "recharts";

function AdminAnalytics({

  users,

  assignments,

}) {

  // ROLE COUNTS
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

  // PIE DATA
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

  // BAR DATA
  const mentorLoad =
    assignments.reduce(
      (acc, item) => {

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

        } else {

          acc.push({

            name: mentor,

            students: 1,

          });

        }

        return acc;

      },
      []
    );

  const COLORS = [

    "#3B82F6",

    "#10B981",

    "#8B5CF6",

  ];

  return (

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* PIE CHART */}
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">

          User Roles

        </h2>

        <div className="h-350px">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <PieChart>

              <Pie
                data={roleData}
                dataKey="value"
                outerRadius={120}
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
      <div className="bg-white rounded-2xl shadow-lg p-8">

        <h2 className="text-3xl font-bold mb-6">

          Mentor Load

        </h2>

        <div className="h-350px">

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={mentorLoad}
            >

              <CartesianGrid
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
              />

              <YAxis />

              <Tooltip />

              <Bar
                dataKey="students"
                fill="#3B82F6"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}

export default AdminAnalytics;