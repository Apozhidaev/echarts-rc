class ResizeObservePolyfill {
  constructor(
    private callback: (entries: { contentRect: { width: number; height: number } }[]) => void
  ) {}

  observe(target: Element) {
    this.callback([{ contentRect: { width: target.clientWidth, height: target.clientHeight } }]);
  }

  disconnect() {}
}

export const IsomorphicResizeObserver =
  typeof ResizeObserver !== "undefined" ? ResizeObserver : ResizeObservePolyfill;
