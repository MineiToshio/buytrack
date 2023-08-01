import { HTTP_METHOD } from "next/dist/server/web/http";

const getBody = (verb: HTTP_METHOD, data?: any) => ({
  method: verb,
  body: JSON.stringify(data),
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const request = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T | undefined> => {
  try {
    const res = await fetch(url, options);
    return res.json();
  } catch (error) {
    console.error(error);
  }
};

export const post = <T>(url: string, data?: any) =>
  request<T>(url, getBody("POST", data));

export const put = <T>(url: string, data?: any) =>
  request<T>(url, getBody("PUT", data));

export const del = (url: string) =>
  request<{ success: boolean }>(url, getBody("DELETE"));

export const get = <T>(url: string) => request<T>(url);
