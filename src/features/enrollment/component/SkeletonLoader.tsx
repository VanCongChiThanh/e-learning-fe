import HomeLayout from "../../home/layout/HomeLayout";

export function SkeletonLoader() {
  return (
    <HomeLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
        <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8 animate-pulse">
          {/* Banner Skeleton */}
          <div className="h-40 bg-gradient-to-r from-muted to-muted/50 rounded-2xl"></div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-border h-32"
              ></div>
            ))}
          </div>

          {/* Cards Skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl overflow-hidden border border-border"
                >
                  <div className="h-48 bg-muted"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-2 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}
