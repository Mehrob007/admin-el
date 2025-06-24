import axios from "axios";

const apiClientFiles = axios.create({
  baseURL: import.meta.env.VITE_ENV_URL_FILE,
});

// Глобальные переменные для управления обновлением токена
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Установка токена при инициализации
const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  apiClientFiles.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${accessToken}`;
}

apiClientFiles.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClientFiles(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          throw new Error("Refresh token отсутствует");
        }

        const response = await axios.post(
          `${import.meta.env.VITE_ENV_URL}auth/refresh`,
          { refreshToken },
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          response.data.data;

        // Обновляем токены в localStorage
        await localStorage.setItem("accessToken", newAccessToken);
        await localStorage.setItem("refreshToken", newRefreshToken);

        // Обновляем заголовки
        apiClientFiles.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClientFiles(originalRequest);
      } catch (err) {
        console.error(err);

        processQueue(err, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        document.location.href = import.meta.env.VITE_ENV_URL_REDIRECT;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClientFiles;
