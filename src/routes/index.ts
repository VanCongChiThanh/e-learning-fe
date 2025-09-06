import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "../features/admin/routes";
import {profileRoutes} from "../features/profile/routes";
export const appRoutes = [...authRoutes, ...adminRoutes, ...profileRoutes];
