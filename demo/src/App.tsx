import { useMemo } from "react";
import { EChartsComponent, EChartsOption } from "../../src/index";
import "./App.css";

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
      opts={{ notMerge: true }}
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
