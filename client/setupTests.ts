import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;
import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, jest } from "@jest/globals";

global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
  disconnect() {
    return null;
  }
} as unknown as typeof IntersectionObserver;
// global.IntersectionObserver = class IntersectionObserver {
//   readonly root: Element | Document | null = null;
//   readonly rootMargin: string = "0px";
//   readonly thresholds: ReadonlyArray<number> = [0];

//   constructor(
//     public callback: IntersectionObserverCallback,
//     options?: IntersectionObserverInit
//   ) {
//     if (options) {
//       // Здесь можно обработать options если нужно
//     }
//   }

//   observe(): void {
//     return null;
//   }

//   unobserve(): void {
//     return null;
//   }

//   disconnect(): void {
//     return null;
//   }

//   takeRecords(): IntersectionObserverEntry[] {
//     return [];
//   }
// } as unknown as typeof IntersectionObserver;
