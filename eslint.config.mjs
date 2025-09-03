import tseslint from "@electron-toolkit/eslint-config-ts";
import eslintConfigPrettier from "@electron-toolkit/eslint-config-prettier";
import eslintPluginVue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";

export default tseslint.config(
  { ignores: ["**/node_modules", "**/dist", "**/out"] },
  tseslint.configs.recommended,
  eslintPluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        extraFileExtensions: [".vue"],
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ["**/*.{ts,mts,tsx,vue}"],
    rules: {
      "vue/require-default-prop": "off",
      "vue/multi-word-component-names": "off",
      "vue/block-lang": [
        "error",
        {
          script: {
            lang: "ts",
          },
        },
      ],
      semi: ["error", "always"],
      "@typescript-eslint/ban-types": "off",
      "vue/padding-line-between-blocks": 1, // Vue 文件块之间加空行
      "vue/require-direct-export": 1, // 强制直接导出组件
      "@typescript-eslint/ban-ts-comment": 0, // 允许使用 @ts-ignore 注释
      "@typescript-eslint/no-unused-vars": 1, // 未使用变量警告
      "@typescript-eslint/no-empty-function": 1, // 空函数警告
      "@typescript-eslint/no-explicit-any": 0, // 允许使用 any 类型
      "prettier/prettier": 1, // Prettier 报告级别为 warning
      "vue/singleline-html-element-content-newline": 0, // 单行元素内容不需要换行
      "vue/max-attributes-per-line": 0, // 属性不限制每行数量
      "vue/custom-event-name-casing": [2, "camelCase"], // 自定义事件必须驼峰命名
      "vue/no-v-text": 1, // 警告不要使用 v-text（建议用 {{ }}）
    },
  },
  eslintConfigPrettier,
);
