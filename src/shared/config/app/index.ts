export const APP_CONFIG = {
  appUrl: process.env.APP_URL || "http://localhost:3000",
  apiUrl: process.env.API_URL || "http://localhost:8000/api",
  appPort: parseInt(process.env.APP_PORT!) || 3000,
  appName: process.env.APP_NAME || "Brand",
  socketUrl: process.env.APP_SOCKET_URL || "http://localhost:3000",
  logoUrl: "",
};
