module.exports = [
"[project]/lib/color-utils.ts [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/ssr/lib_color-utils_ts_99cfc488._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/lib/color-utils.ts [app-ssr] (ecmascript)");
    });
});
}),
"[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.resolve().then(() => {
        return parentImport("[project]/node_modules/sonner/dist/index.mjs [app-ssr] (ecmascript)");
    });
});
}),
];