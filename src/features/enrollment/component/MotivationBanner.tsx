export function MotivationBanner() {
  const hour = new Date().getHours();
  let greeting = "Chào buổi sáng";
  let emoji = "🌅";

  if (hour >= 12 && hour < 17) {
    greeting = "Chào buổi chiều";
    emoji = "☀️";
  } else if (hour >= 17) {
    greeting = "Chào buổi tối";
    emoji = "🌙";
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/70 text-white p-8 md:p-12">
      {/* Decorative SVG background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 400 200"
        preserveAspectRatio="none"
      >
        <path
          d="M0,100 Q100,50 200,100 T400,100"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M0,150 Q100,100 200,150 T400,150"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
      </svg>

      <div className="relative z-10">
        <div className="text-5xl mb-4">{emoji}</div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-balance">
          {greeting}, học viên!
        </h1>
        <p className="text-base md:text-lg text-white/90 max-w-2xl">
          Hôm nay là một ngày tuyệt vời để học tập. Hãy tiếp tục hành trình của
          bạn và đạt được những mục tiêu mới.
        </p>
      </div>
    </div>
  );
}
