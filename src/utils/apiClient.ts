import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api",
});

apiClient.interceptors.request.use(async (config) => {
  let accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.response.data.error === "Invalid or expired token."
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post("/api/auth", { action: "refresh_token" });

        const newAccessToken = refreshResponse.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Redirect to login or handle accordingly
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
