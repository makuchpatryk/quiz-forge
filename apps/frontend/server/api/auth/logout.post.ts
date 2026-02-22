import { defineEventHandler, getHeader, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const targetUrl = config.public.apiBaseUrl;

  const cookie = getHeader(event, "cookie");

  return proxyRequest(event, `${targetUrl}/auth/logout`, {
    headers: {
      ...(cookie ? { cookie } : {}),
    },
  });
});
