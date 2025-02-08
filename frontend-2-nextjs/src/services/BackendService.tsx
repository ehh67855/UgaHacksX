import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/entities/CustomJwtPayload";

export const BACKEND_API_URL = "http://localhost:8080";

export const formatApiUrl = (endpoint: string): string => {
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoints must begin with a `/` character.");
  }

  return BACKEND_API_URL + endpoint;
};

export const getAuthToken = (): string | null => {
  return window.localStorage.getItem("auth_token");
};

export const setAuthHeader = (token: string | null) => {
  if (token !== null) {
    window.localStorage.setItem("auth_token", token);
  } else {
    window.localStorage.removeItem("auth_token");
  }
};

export const isAuthenticated = (): boolean => {
  return getAuthToken() !== null;
};

export const isAdmin = (token: string | null): boolean => {
  if (token == null) {
    return false;
  }

  const decoded = jwtDecode<CustomJwtPayload>(token);
  return decoded.role == "ADMIN";
};

export const isUser = (token: string): boolean => {
  const decoded = jwtDecode<CustomJwtPayload>(token);
  return decoded.role == "USER";
};

export const getLogin = (token: string): string | undefined => {
  const decoded = jwtDecode<CustomJwtPayload>(token);
  return decoded.sub;
};
