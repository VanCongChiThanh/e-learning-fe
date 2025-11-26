export function LearningPathSection() {
  const pathItems = [
    {
      step: 1,
      title: "Kiến thức cơ bản",
      description: "Nắm vững các khái niệm nền tảng",
      icon: "🎓",
    },
    {
      step: 2,
      title: "Thực hành dự án",
      description: "Áp dụng kỹ năng vào dự án thực",
      icon: "💼",
    },
    {
      step: 3,
      title: "Nâng cao kỹ năng",
      description: "Phát triển khả năng cao cấp",
      icon: "🚀",
    },
    {
      step: 4,
      title: "Chứng chỉ hoàn thành",
      description: "Nhận chứng chỉ sau khi hoàn thành",
      icon: "🏆",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <div className="w-1.5 h-8 bg-accent rounded-full"></div>
          Lộ trình học tập
        </h2>
        <p className="text-muted-foreground mt-1">
          Làm theo các bước này để đạt thành công
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pathItems.map((item, idx) => (
          <div key={idx} className="relative">
            {/* Connector line */}
            {idx < pathItems.length - 1 && (
              <div className="hidden lg:block absolute top-16 -right-4 w-8 h-0.5 bg-gradient-to-r from-accent to-transparent"></div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-border hover:border-accent transition-colors relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {item.step}
                </div>
                <span className="text-2xl">{item.icon}</span>
              </div>
              <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
