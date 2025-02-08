import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BACKEND_API_URL } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatApiUrl = (endpoint: string): string => {
  if (!endpoint.startsWith("/")) {
    throw new Error("Endpoints must begin with a `/` character.");
  }
  return BACKEND_API_URL + endpoint;
};
