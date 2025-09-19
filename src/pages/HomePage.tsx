import React from "react";
import CourseList from "../features/course/CourseList";

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold">Welcome to E-Learning</h1>
      <CourseList />
    </div>
  );
};

export default HomePage;
