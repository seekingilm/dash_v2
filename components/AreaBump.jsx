import { mockAreaData  as data } from "../data/mockData"
import { ResponsiveAreaBump } from '@nivo/bump'
import { useTheme } from "@mui/material";
import { useState, useEffect } from "react";

function AreaBump({ areaData }) {
  const [apiData, setApiData] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/data', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(areaData)
    }).then(res => res.json()).
      then(res => {
        if (res.constructor === Array) {
          let newRes = res.filter(item => item.country !== null && item.abuse != 0);
          setApiData((newRes))
        }
      })
  }, [areaData])
  
  return (
    <ResponsiveAreaBump
        data={data}
        margin={{ top: 40, right: 100, bottom: 40, left: 100 }}
        spacing={8}
        colors={{ scheme: 'nivo' }}
        blendMode="multiply"
        defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: '#38bcb2',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
                startLabel="id"
        endLabel="id"
        axisTop={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: -36,
            truncateTickAt: 0
        }}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 32,
            truncateTickAt: 0
        }}
    />
  );

}

export default AreaBump
