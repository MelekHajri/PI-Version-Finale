import axios from "axios";
import { useNavigate } from "react-router-dom";

const apiClient = axios.create({
  baseURL: "http://localhost:8084",
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Redirection après expiration de session
      const navigate = useNavigate();
      navigate("/sign-in");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
