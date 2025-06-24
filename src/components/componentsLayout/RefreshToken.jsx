import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../utils/apiClient";

export default function RefreshToken() {
  const { token } = useParams();
  const refreshToken = localStorage.getItem("refreshToken");
  const navigate = useNavigate();

  let decodedToken;
  try {
    decodedToken = refreshToken || token ? decodeURIComponent(token) : null;
  } catch (err) {
    console.error("Ошибка при декодировании токена:", err);
    decodedToken = null;
  }

  useEffect(() => {
    if (decodedToken) {
      localStorage.setItem("refreshToken", decodedToken);
    }
  }, [decodedToken]);

  const getAccessToken = async (refreshToken) => {
    if (!refreshToken) return;

    try {
      const res = await apiClient.post("auth/refresh", {
        refreshToken: refreshToken,
      });
      console.log("Новый access-токен:", res.data);
      const data = res.data.data;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      navigate("/");
    } catch (e) {
      // document.location.href = "http://localhost:5174"
      console.error("Ошибка при обновлении токена:", e);
    }
  };

  useEffect(() => {
    // const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      getAccessToken(refreshToken);
    }
  }, []);

  return <div></div>;
}
