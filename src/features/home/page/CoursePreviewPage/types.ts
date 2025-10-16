export interface CourseResponse {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  status: string;
  level: string;
  instructorId: string;
  instructorName: string;
  category: string;
  image: string;
  tags: TagResponse[];
  averageRating: number;
  totalReviews: number;
  totalLectures: number;
  totalStudents: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface TagResponse {
  tagId: string;
  name: string;
}

export interface SectionResponse {
  sectionId: string;
  courseId: string;
  title: string;
  position: number;
  lectures: LectureResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface LectureResponse {
  lectureId: string;
  sectionId: string;
  title: string;
  content: string;
  position: number;
  videoUrl: string;
  duration: number;
  createdAt: string;
  updatedAt: string;
}
