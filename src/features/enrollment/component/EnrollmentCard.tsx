interface EnrollmentCardProps {
  enrollment: any;
}

export function EnrollmentCard({ enrollment }: EnrollmentCardProps) {
  const progress = enrollment.enrollmentProgressPercentage || 0;
  const courseImage = enrollment.courseImageUrl || "/placeholder.svg?key=87v2y";
  const currentStatus = enrollment.currentLearningStatus || "CONTINUE_WATCHING";
  const recommendedAction = enrollment.recommendedAction || "Tiếp tục";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONTINUE_WATCHING":
        return "bg-accent/20 text-accent";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "NOT_STARTED":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "CONTINUE_WATCHING":
        return "Đang học";
      case "COMPLETED":
        return "Hoàn thành";
      case "NOT_STARTED":
        return "Chưa bắt đầu";
      default:
        return "Đang học";
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30">
      {/* Course Image */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
        <img
          src={courseImage || "/placeholder.svg"}
          alt={enrollment.courseTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 ${getStatusColor(
            currentStatus
          )} px-3 py-1 rounded-full text-xs font-semibold`}
        >
          {getStatusLabel(currentStatus)}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h3 className="font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {enrollment.courseTitle}
        </h3>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              Tiến độ
            </span>
            <span className="text-xs font-bold text-primary">{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Course Info */}
        {enrollment.sectionCount && (
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              📖 {enrollment.sectionCount} chương
            </span>
            <span className="flex items-center gap-1">
              ▶️ {enrollment.lectureCount || 0} bài học
            </span>
          </div>
        )}

        {/* Action Button */}
        <button className="w-full mt-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold py-2.5 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {recommendedAction}
        </button>
      </div>
    </div>
  );
}
