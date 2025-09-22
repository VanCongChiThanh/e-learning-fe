import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "../features/admin/routes";
import { profileRoutes } from "../features/profile/routes";
import { LearnRoutes } from "../features/enrollment/routes";
import {homeRoutes} from "../features/home/routes";
import {courseRoutes} from "../features/course/routes";
import { courseRoutesForInstructor } from "../features/course/routes";
export const appRoutes = [...authRoutes, ...profileRoutes, ...adminRoutes, ...homeRoutes, ...courseRoutes, ...courseRoutesForInstructor, ...LearnRoutes];
