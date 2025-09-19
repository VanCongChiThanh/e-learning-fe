import { authRoutes } from "../features/auth/routes";
import {profileRoutes} from "../features/profile/routes";
import { adminRoutes } from "../features/admin/routes";
import {homeRoutes} from "../features/home/routes";
export const appRoutes = [...authRoutes, ...profileRoutes, ...adminRoutes, ...homeRoutes];
