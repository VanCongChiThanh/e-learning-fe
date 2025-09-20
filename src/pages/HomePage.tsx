import { UUID } from "crypto";
import EnrollmentList from "../features/enrollment/EnrollmentList";

const HomePage = () => {
  const userId: UUID = "b6f5f220-8d9b-4e71-9ef9-8760f5e15d1c";
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold">Welcome to E-Learning</h1>
      <p className="mt-4">Khám phá các khóa học online.</p>
      <EnrollmentList userId={userId} />
    </div>
  );
};

export default HomePage;
