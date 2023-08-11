import { useMemo } from "react";
import { EChartsComponent, EChartsOption } from "../../src/index";
import "./App.css";

function App() {
  const options: EChartsOption = useMemo(
    () => ({
      xAxis: {
        id: "id",
        type: "category",
        data: ["Mon Long Name Long Name Long Name", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
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
      opts={{ notMerge: true }}
      style={{ height: 500 }}
      onInit={(instance) => {
        instance.on("click", (e) => {
          console.log(e);
        });
      }}
      onResize={(i, w) => {
        i.setOption({
          xAxis: {
            id: "id",
            axisLabel: {
              overflow: "truncate",
              width: w / 7,
              interval: 0,
            },
          },
        });
      }}
    />
  );
}

export default App;
