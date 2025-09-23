module.exports = {
  testEnvironment: "jsdom", // Для тестирования DOM
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // Подключает матчеры RTL
};
