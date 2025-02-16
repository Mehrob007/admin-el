import axios from "axios";

const apiClientFiles = axios.create({
  baseURL: import.meta.env.VITE_ENV_URL_FILE,
});

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

apiClientFiles.defaults.headers.common[
  "Authorization"
] = `Bearer ${localStorage.getItem("accessToken")}`;

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
        // Запрашиваем новый accessToken, используя refreshToken
        const refreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          import.meta.env.VITE_ENV_URL + "auth/refresh",
          {
            refreshToken: refreshToken,
          },
        );
        const data = response.data.data;
        const newAccessToken = data.accessToken;
        await localStorage.setItem("accessToken", data.accessToken);
        await localStorage.setItem("refreshToken", data.refreshToken);

        // Обновляем заголовки
        apiClientFiles.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return apiClientFiles(originalRequest);
      } catch (err) {
        processQueue(err, null);
        document.location.href = import.meta.env.VITE_ENV_URL_REDIRECT;
        // alert("Token просрочен!");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClientFiles;
