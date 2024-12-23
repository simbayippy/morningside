export const authConfig = {
  publicRoutes: ["/", "/events", "/events/[id]", "/login", "/signup"],
  authRoutes: ["/login", "/signup"],
  adminRoutes: ["/events/create", "/events/[id]/edit"],
} as const;
