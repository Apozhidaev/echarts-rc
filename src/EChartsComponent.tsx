import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";
import { memo, forwardRef, useState, useEffect } from "react";
import { EChartsWrapper, EChartsWrapperProps } from "./EChartsWrapper";

export type { EChartsOption, SetOptionOpts };

export type EChartsComponentProps = Partial<EChartsWrapperProps> & {
  option: EChartsOption;
  opts?: SetOptionOpts;
};

export const EChartsComponent = memo(
  forwardRef(function EChartsComponent(
    props: EChartsComponentProps,
    ref: React.ForwardedRef<HTMLElement | null>
  ) {
    const { option, opts, onInit, ...wrapperProps } = props;
    const [instance, setInstance] = useState<ECharts>();

    useEffect(() => {
      if (instance) {
        instance.setOption(option, opts);
      }
    }, [instance, option]);

    return (
      <EChartsWrapper
        {...wrapperProps}
        ref={ref}
        onInit={(inst) => {
          setInstance(inst);
          onInit?.(inst);
        }}
      />
    );
  })
);
