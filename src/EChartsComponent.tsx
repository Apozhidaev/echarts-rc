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
export type InitHandler = (instance: ECharts, width: number, height: number) => void;
export type UpdateHandler = (
  instance: ECharts,
  option: EChartsOption,
  opts?: SetOptionOpts
) => void;
export type ResizeHandler = (instance: ECharts, width: number, height: number) => void;

export type { ECharts, EChartsOption, SetOptionOpts };

export type EChartsComponentProps = Omit<HTMLAttributes<HTMLElement>, "onResize"> & {
  option?: EChartsOption;
  opts?: SetOptionOpts;
  theme?: Theme;
  initOpts?: InitOpts;
  onInit?: InitHandler;
  onUpdate?: UpdateHandler;
  onResize?: ResizeHandler;
};

export const EChartsComponent = memo(
  forwardRef(function EChartsWrapper(
    props: EChartsComponentProps,
    ref: React.Ref<HTMLElement | null>
  ) {
    const { option, opts, theme, initOpts, onInit, onUpdate, onResize, ...htmlProps } = props;

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
                onInit?.(instance, width, height);
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

    const updateRef = useRef<UpdateHandler | undefined>();
    useEffect(() => {
      updateRef.current = onUpdate;
    }, [onUpdate]);

    useEffect(() => {
      if (instance && option) {
        instance.setOption(option, opts);
        updateRef.current?.(instance, option, opts);
      }
    }, [instance, option]);

    const resizeRef = useRef<ResizeHandler | undefined>();
    useEffect(() => {
      resizeRef.current = onResize;
    }, [onResize]);

    useEffect(() => {
      if (instanceRef.current) {
        instanceRef.current.resize({
          width,
          height,
        });
        resizeRef.current?.(instanceRef.current, width, height);
      }
    }, [width, height]);

    return <div ref={containerRef} {...htmlProps} />;
  })
);
