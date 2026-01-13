// Temporary empty hook to fix build
export function useToolCallAccumulator() {
  return {
    accumulator: null,
    current: null,
    setCurrent: () => {},
    reset: () => {},
    handleToolCallDelta: () => {},
    handleToolOutput: () => {},
  };
}