import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "../features/admin/routes";
import { profileRoutes } from "../features/profile/routes";
import { LearnRoutes } from "../features/enrollment/routes";
export const appRoutes = [...authRoutes, ...adminRoutes, ...profileRoutes, ...LearnRoutes];
