// import type { Config } from "jest";

// const config: Config = {
//   // Очищать моки перед каждым тестом
//   clearMocks: true,

//   // Тестовое окружение (jsdom для веб-приложений)
//   testEnvironment: "jsdom",
//   setupFiles: ["jest-localstorage-mock", "whatwg-fetch"],

//   // Где искать тесты
//   testMatch: ["<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)"],

//   // Настройки для работы с модулями
//   modulePaths: ["<rootDir>/src"],
//   moduleDirectories: ["node_modules"],
//   moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node", "mjs"],

//   // Алиасы для импортов (если используете)
//   moduleNameMapper: {
//     "\\.(css|less|scss|sass)$": "identity-obj-proxy",
//     "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/config/jest/fileMock.ts",
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },

//   // Настройки для покрытия кода
//   collectCoverage: false,
//   coverageDirectory: "coverage",
//   coveragePathIgnorePatterns: ["/node_modules/"],

//   // Настройки для работы с TypeScript и React
//   preset: "ts-jest",
//   transform: {
//     // Только ОДНО правило для всех JS/TS файлов
//     "^.+\\.(ts|tsx|js|jsx|mjs)$": "ts-jest",
//   },
//   transformIgnorePatterns: [
//     // Только ОДНО правило - исключаем все node_modules кроме указанных
//     "node_modules/(?!(msw|@mswjs|until-async)/)",

//     // Дополнительно можно игнорировать CSS модули если нужно
//     "^.+\\.module\\.(css|sass|scss)$",
//   ],

//   // Файлы, которые выполняются перед тестами
//   setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
//   verbose: true, // не выводить подробные логи
//   silent: true,
// };

// export default config;
import type { Config } from "jest";

const config: Config = {
  clearMocks: true,
  testEnvironment: "jsdom",

  // УБРАТЬ whatwg-fetch - он конфликтует с MSW
  setupFiles: ["jest-localstorage-mock"],

  testMatch: ["<rootDir>/src/**/*(*.)@(spec|test).[tj]s?(x)"],

  modulePaths: ["<rootDir>/src"],
  moduleDirectories: ["node_modules"],
  moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json", "node"],

  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/config/jest/fileMock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  collectCoverage: false,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: ["/node_modules/"],

  // ✅ ПРАВИЛЬНАЯ настройка transform
  preset: "ts-jest",
  transform: {
    // Только для файлов, которые НЕ обрабатываются ts-jest по умолчанию
    "^.+\\.(js|jsx|mjs)$": "babel-jest",
  },

  // ✅ ПРАВИЛЬНЫЙ transformIgnorePatterns
  transformIgnorePatterns: [
    // Исключаем ВСЕ node_modules, кроме тех, которые нужно трансформировать
    "node_modules/(?!(msw|@mswjs|until-async|other-esm-packages)/)",
  ],

  // ✅ Правильный путь к setupFilesAfterEnv
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  verbose: true,
  silent: false, // ❌ УБРАТЬ silent: true - чтобы видеть логи MSW!
};

export default config;
