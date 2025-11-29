interface StatsOverviewProps {
  enrollments: any[];
}

export function StatsOverview({ enrollments }: StatsOverviewProps) {
  const totalProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (sum, e) => sum + (e.enrollmentProgressPercentage || 0),
            0
          ) / enrollments.length
        )
      : 0;

  const activeEnrollments = enrollments.filter(
    (e) => e.enrollmentStatus === "ACTIVE"
  ).length;

  const stats = [
    {
      label: "Khóa học đang học",
      value: activeEnrollments,
      icon: "📚",
      color: "from-primary to-primary/70",
    },
    {
      label: "Tiến độ trung bình",
      value: `${totalProgress}%`,
      icon: "📊",
      color: "from-accent to-accent/70",
    },
    {
      label: "Tổng cộng",
      value: enrollments.length,
      icon: "🎯",
      color: "from-chart-3 to-chart-3/70",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`bg-gradient-to-br ${stat.color} text-white rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300`}
        >
          {/* Decorative element */}
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-300"></div>

          <div className="relative z-10">
            <div className="text-4xl mb-2">{stat.icon}</div>
            <p className="text-white/80 text-sm font-medium">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
