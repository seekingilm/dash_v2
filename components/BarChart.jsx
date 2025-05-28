import { useTheme } from "@mui/material";
import { mockBarData as data } from "../data/mockData";
import { ResponsiveBar } from "@nivo/bar";
import { useState, useEffect } from "react";

function BarChart({ barData }) {
  const [apiData, setApiData] = useState([]);

  function sumAbuseByCountry(arr) {
    const result = {};

    arr.forEach((obj) => {
      const country = obj.country;
      const abuse = obj.abuse;

      if (result[country] === undefined) {
        result[country] = abuse;
      } else {
        result[country] = Math.round((result[country] + abuse) / 2);
      }
    });

    const sortedCountries = Object.keys(result)
      .map((country) => ({
        country: country,
        abuse: result[country],
      }))
      .sort((a, b) => b.abuse - a.abuse);

    return sortedCountries.slice(0, 5);
  }

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(barData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.constructor === Array) {
          let newRes = res.filter(
            (item) => item.country !== null && item.abuse != 0,
          );
          setApiData(sumAbuseByCountry(newRes));
        }
      });
  }, [barData]);

  return (
    <ResponsiveBar
      data={apiData}
      colors={{ scheme: "dark2" }}
      keys={["abuse"]} indexBy="country"
      margin={{ top: 30, right: 60, bottom: 60, left: 60 }}
      padding={0.3}
      valueScale={{ type: "linear" }}
      indexScale={{ type: "band", round: true }}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Country", // changed
        legendPosition: "middle",
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Abuse Score", // changed
        legendPosition: "middle",
        legendOffset: -50,
      }}
      enableLabel={false}
      labelSkipWidth={12}
      labelSkipHeight={12}
      defs={[
        {
          id: "dots",
          type: "patternDots",
          background: "inherit",
          color: "#38bcb2",
          size: 4,
          padding: 1,
          stagger: true,
        },
        {
          id: "lines",
          type: "patternLines",
          background: "inherit",
          color: "#eed312",
          rotation: -45,
          lineWidth: 6,
          spacing: 10,
        },
      ]}
      fill={[
        {
          match: {
            id: "abuse",
          },
          id: "dots",
        },
        {
          match: {
            id: "sandwich",
          },
          id: "lines",
        },
      ]}
      role="application"
      barAriaLabel={function (e) {
        return e.id + ": " + e.formattedValue + " in country: " + e.indexValue;
      }}
    />
  );
}

export default BarChart;
