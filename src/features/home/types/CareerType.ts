export interface GenerateCareerPlanPayload {
  role: string;
  goal: string;
  answers: Record<string, any>;
}
export interface CareerPlanSection {
  section_title: string;
  description: string;
  course_ids: string[];
}

export interface CareerPlanRequest extends GenerateCareerPlanPayload {
  sections: CareerPlanSection[];
  answer: string;
}
