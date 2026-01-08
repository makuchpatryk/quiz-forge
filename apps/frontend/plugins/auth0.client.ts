import { createAuth0Client } from "@auth0/auth0-spa-js";
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app";

export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();

  const auth0 = await createAuth0Client({
    domain: config.public.auth0Domain,
    clientId: config.public.auth0ClientId,
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });

  return {
    provide: {
      auth0,
    },
  };
});
