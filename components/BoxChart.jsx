import { ResponsiveBoxPlot } from "@nivo/boxplot";
import { useState, useEffect } from "react";
import { mockBoxData as data } from "../data/mockData";

function BoxChart(updating) {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updating),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.constructor === Array) {
          console.log('In the Boxchart the data is ', newRes);
          setApiData(newRes);
        }
      });
  }, [updating]);

  return (
    <ResponsiveBoxPlot
      data={apiData} // set up the API call an populate with real data
      margin={{ top: 60, right: 80, bottom: 60, left: 80 }}
      minValue={0}
      maxValue={10}
      subGroupBy="subgroup"
      padding={0.12}
      enableGridX={true}
      axisTop={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: 36,
        truncateTickAt: 0,
      }}
      axisRight={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "",
        legendOffset: 0,
        truncateTickAt: 0,
      }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "group",
        legendPosition: "middle",
        legendOffset: 32,
        truncateTickAt: 0,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "value",
        legendPosition: "middle",
        legendOffset: -40,
        truncateTickAt: 0,
      }}
      colors={{ scheme: "nivo" }}
      borderRadius={2}
      borderWidth={2}
      borderColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      medianWidth={2}
      medianColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      whiskerEndSize={0.6}
      whiskerColor={{
        from: "color",
        modifiers: [["darker", 0.3]],
      }}
      motionConfig="stiff"
    />
  );
}

export default BoxChart;
