import axios from "@/lib/axios";
import { setAccessToken } from "@/lib/cookies";

const useRefreshToken = () => {
  const refresh = async () => {
    const response = await axios.get("/api/v1/auth/refresh", {
      withCredentials: true,
    });
    await setAccessToken(response.data.accessToken);
    return response.data.accessToken;
  };
  return refresh;
};

export default useRefreshToken;
