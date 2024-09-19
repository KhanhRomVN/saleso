import axios, { AxiosResponse } from "axios";
import {
  BACKEND_USER_URI,
  BACKEND_ORDER_URI,
  BACKEND_PRODUCT_URI,
  BACKEND_ANALYTICS_URI,
  BACKEND_OTHER_URI,
} from "@/api/index";

type ServiceAPI = "user" | "order" | "product" | "analytics" | "other";

const getBackendURI = (service: ServiceAPI): string => {
  switch (service) {
    case "user":
      return BACKEND_USER_URI;
    case "order":
      return BACKEND_ORDER_URI;
    case "product":
      return BACKEND_PRODUCT_URI;
    case "analytics":
      return BACKEND_ANALYTICS_URI;
    case "other":
      return BACKEND_OTHER_URI;
    default:
      throw new Error("Invalid service API");
  }
};

interface RefreshTokenResponse {
  newAccessToken: string;
  newRefreshToken: string;
}

const refreshTokenAndRetry = async (
  method: string,
  url: string,
  service: ServiceAPI,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<AxiosResponse> => {
  const refreshToken = localStorage.getItem("refreshToken");

  if (!refreshToken) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.get<RefreshTokenResponse>(
      `${getBackendURI(service)}/auth/refresh/token`,
      {
        headers: { refreshToken },
      }
    );

    const { newAccessToken, newRefreshToken } = response.data;

    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("refreshToken", newRefreshToken);

    return axios({
      method,
      url: `${getBackendURI(service)}${url}`,
      data: body,
      headers: { accessToken: newAccessToken },
    });
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login";
    throw error;
  }
};

const handleRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  service: ServiceAPI,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<any> => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("No access token found. Attempting to refresh...");
    return refreshTokenAndRetry(method, url, service, body);
  }

  try {
    const response = await axios({
      method,
      url: `${getBackendURI(service)}${url}`,
      data: body,
      headers: { accessToken },
    });
    return response.data.data; // Chỉ trả về phần 'data' của response
  } catch (error: any) {
    if (error.response?.data?.error === "Unauthorized - Invalid accessToken") {
      console.log("Invalid access token. Attempting to refresh...");
      return refreshTokenAndRetry(method, url, service, body);
    }
    throw error;
  }
};

const handlePublicRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  service: ServiceAPI,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
): Promise<any> => {
  try {
    const response = await axios({
      method,
      url: `${getBackendURI(service)}${url}`,
      data: body,
    });
    return response.data.data; // Chỉ trả về phần 'data' của response
  } catch (error) {
    throw error;
  }
};

// Authenticated API calls
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T = any,>(url: string, service: ServiceAPI): Promise<T> =>
  handleRequest("get", url, service);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handleRequest("post", url, service, body);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handleRequest("put", url, service, body);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const del = <T = any,>(url: string, service: ServiceAPI): Promise<T> =>
  handleRequest("delete", url, service);

// Public API calls (no authentication required)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPublic = <T = any,>(
  url: string,
  service: ServiceAPI
): Promise<T> => handlePublicRequest("get", url, service);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const postPublic = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handlePublicRequest("post", url, service, body);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const putPublic = <T = any,>(
  url: string,
  service: ServiceAPI,
  body?: any
): Promise<T> => handlePublicRequest("put", url, service, body);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const delPublic = <T = any,>(
  url: string,
  service: ServiceAPI
): Promise<T> => handlePublicRequest("delete", url, service);

export const authUtils = {
  get,
  post,
  put,
  del,
  getPublic,
  postPublic,
  putPublic,
  delPublic,
};
