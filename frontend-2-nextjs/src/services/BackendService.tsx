import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/entities/CustomJwtPayload";

const BACKEND_API_URL = "http://localhost:8080";
const AUTH_TOKEN_COOKIE_NAME = "auth_token";

export const formatApiUrl = (endpoint: string): string => {
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoints must begin with a `/` character.");
  }
  return BACKEND_API_URL + endpoint;
};

export const getAuthToken = async (): Promise<string | null> => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_TOKEN_COOKIE_NAME);
  if (authToken) {
    return authToken.value;
  }
  return null;
};

export const setAuthHeader = async (token: string | null) => {
  const cookieStore = await cookies();
  if (token !== null) {
    cookieStore.set(AUTH_TOKEN_COOKIE_NAME, token);
  } else {
    cookieStore.delete(AUTH_TOKEN_COOKIE_NAME);
  }
};

export const isAuthenticated = async (): Promise<boolean> => {
  const authToken = await getAuthToken();
  return authToken !== null;
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
