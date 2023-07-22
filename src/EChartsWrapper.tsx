import type { ECharts } from "echarts";
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
import { MeasureObserver } from "./MeasureObserver";

type InitParams = Parameters<typeof echarts.init>;

export type { ECharts };

export type EChartsWrapperProps = HTMLAttributes<HTMLElement> & {
  onInit: (instance: ECharts) => void;
  theme?: InitParams[1];
  initOpts?: InitParams[2];
};

export const EChartsWrapper = memo(
  forwardRef(function EChartsWrapper(
    props: EChartsWrapperProps,
    ref: React.Ref<HTMLElement | null>
  ) {
    const { onInit, theme, initOpts, ...htmlProps } = props;

    const containerRef = useRef<HTMLDivElement | null>(null);
    const instanceRef = useRef<ECharts | null>(null);

    useImperativeHandle(ref, () => containerRef.current, []);

    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const observer = useMemo(
      () =>
        new MeasureObserver((entries) => {
          if (entries[0]) {
            const { width, height } = entries[0].contentRect;
            setHeight(height);
            setWidth(width);
            if (height > 0 && width > 0) {
              if (!instanceRef.current && containerRef.current) {
                const instance = echarts.init(containerRef.current, theme, initOpts);
                instanceRef.current = instance;
                onInit(instance);
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

    return <div ref={containerRef} {...htmlProps} />;
  })
);
