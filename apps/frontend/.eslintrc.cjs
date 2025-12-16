module.exports = {
    extends: ["../../.eslintrc.cjs"],
    env: {
        browser: true
    },
    rules: {
        // Nuxt-specific tweaks
        "vue/multi-word-component-names": "off"
    }
};