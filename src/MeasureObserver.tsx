class ResizeObserverPolyfill {
  constructor(
    private callback: (entries: { contentRect: { width: number; height: number } }[]) => void
  ) {}

  observe(target: Element) {
    this.callback([{ contentRect: { width: target.clientWidth, height: target.clientHeight } }]);
  }

  disconnect() {}
}

export const MeasureObserver =
  typeof ResizeObserver !== "undefined" ? ResizeObserver : ResizeObserverPolyfill;
