import pl from "./locales/pl.json";
export default defineI18nConfig(() => {
  console.log("I18N LOADED");
  return {
    legacy: false,
    locale: "pl",
    messages: { pl },
  };
});
