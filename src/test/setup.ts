import '@testing-library/jest-dom';

// Optional: silence React act warnings in specific versions if needed
// Optional: add global mocks used across tests

// Example: mock matchMedia for components that rely on it
if (!window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}
