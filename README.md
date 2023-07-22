# echarts-rc

The React wrapper for [Apache ECharts](https://github.com/apache/incubator-echarts).


### Attributes

* **option** - the echarts option config, can see [https://echarts.apache.org/option.html#title](https://echarts.apache.org/option.html#title).
* **opts** - setOption options
* **theme** - theme to be applied. [https://echarts.apache.org/en/api.html#echarts.init](https://echarts.apache.org/en/api.html#echarts.init).
* **onInit** - when the chart is init, will callback the function with the `echartsInstance` as it's paramter.
* **initOpts** - init options
* **...htmlProps[]** - html props


### How to Use

Step 1.
```bash
npm i echarts-rc

# `echarts` is the peerDependence of `echarts-rc`, you can install echarts with your own version.
$ npm i echarts
```

Step 2.
```jsx
import { useMemo } from "react";
import EChartsComponent, { EChartsOption } from "echarts-rc";

function App() {
  const options: EChartsOption = useMemo(
    () => ({
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: "line",
        },
      ],
    }),
    []
  );

  return (
    <EChartsComponent
      option={options}
      style={{ height: 500 }}
      onInit={(instance) => {
        instance.on("click", (e) => {
          console.log(e);
        });
      }}
    />
  );
}

export default App;
```
