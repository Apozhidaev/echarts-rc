import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";
import * as echarts from "echarts";
import {
  memo,
  useRef,
  forwardRef,
  useImperativeHandle,
  HTMLAttributes,
  useState,
  useEffect,
  useMemo,
} from "react";
import { IsomorphicResizeObserver } from "./IsomorphicResizeObserver";

export type Theme = Parameters<typeof echarts.init>[1];
export type InitOpts = Parameters<typeof echarts.init>[2];

export type { ECharts, EChartsOption, SetOptionOpts };

export type EChartsComponentProps = HTMLAttributes<HTMLElement> & {
  option?: EChartsOption;
  opts?: SetOptionOpts;
  theme?: Theme;
  initOpts?: InitOpts;
  onInit?: (instance: ECharts) => void;
};

export const EChartsComponent = memo(
  forwardRef(function EChartsWrapper(
    props: EChartsComponentProps,
    ref: React.Ref<HTMLElement | null>
  ) {
    const { option, opts, theme, initOpts, onInit, ...htmlProps } = props;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<ECharts | null>(null);
    const [instance, setInstance] = useState<ECharts>();

    useImperativeHandle(ref, () => containerRef.current, []);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const observer = useMemo(
      () =>
        new IsomorphicResizeObserver((entries) => {
          if (entries[0]) {
            const { width, height } = entries[0].contentRect;
            setHeight(height);
            setWidth(width);
            if (height > 0 && width > 0) {
              if (!instanceRef.current && containerRef.current) {
                const instance = echarts.init(containerRef.current, theme, initOpts);
                instanceRef.current = instance;
                setInstance(instance);
                onInit?.(instance);
              }
            }
          }
        }),
      []
    );

    useEffect(() => {
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        observer.disconnect();
        instanceRef.current?.dispose();
        instanceRef.current = null;
      };
    }, []);

    useEffect(() => {
      instanceRef.current?.resize({
        width,
        height,
      });
    }, [width, height]);

    useEffect(() => {
      if (instance && option) {
        instance.setOption(option, opts);
      }
    }, [instance, option]);

    return <div ref={containerRef} {...htmlProps} />;
  })
);
