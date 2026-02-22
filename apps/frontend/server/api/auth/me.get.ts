import { defineEventHandler, getHeader, proxyRequest } from "h3";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const targetUrl = config.public.apiBaseUrl;

  // Pobierz cookies z requestu i przekaż dalej
  const cookie = getHeader(event, "cookie");

  return proxyRequest(event, `${targetUrl}/auth/me`, {
    headers: {
      ...(cookie ? { cookie } : {}),
    },
  });
});
