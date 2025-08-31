import { authRoutes } from "../features/auth/routes";
import { adminRoutes } from "../features/admin/routes";

export const appRoutes = [...authRoutes, ...adminRoutes];
