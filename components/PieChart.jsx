import { ResponsivePie } from '@nivo/pie'
import { useState, useEffect } from "react";
import { mockPieData as data } from "../data/mockData"

function PieChart({ pieData }) {
  const [apiData, setApiData] = useState([])

  function sumAbuseByCountry(arr) {
    const result = {};

    arr.forEach(obj => {
      const country = obj.country;
      const abuse = obj.abuse;

      if (result[country] === undefined) {
        result[country] = abuse;
      } else {
        result[country] += abuse;
      }
    });

    function consolidateData(data) {
      // Create an object to store aggregated results
      const resultMap = {};

      // Iterate over each item in the data array
      data.forEach(item => {
        const { id, value } = item;

        // If the id is null, skip it or handle it as needed
        if (id === null) return;

        // Initialize the resultMap entry if it does not exist
        if (!resultMap[id]) {
          resultMap[id] = { id, label: item.label, value: 0 };
        }

        // Add the value to the existing entry
        resultMap[id].value += value;
      });
      return Object.values(resultMap);
    }

    let a = consolidateData(Object.values(result))
    return a

    return Object.keys(result).map(country => ({
      country: country,
      label: country,
      abuse: result[country]
    }));
  }

  function reduceData(data) {
    const result = {};

    data.forEach(item => {
      if (item.id) { // Check if id is not null
        if (!result[item.id]) {
          console.log(item)
          result[item.id] = { id: item.id, label: item.label, value: 0};
        }
        result[item.id].value += item.value;
      }
    });

    
    return Object.values(result);
  }


  useEffect(() => {
    fetch('http://127.0.0.1:5000/pie', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pieData)
    }).then(res => res.json()).
      then(res => {
        if (res.constructor === Array) {
          let newRes = res.filter(item => item.id !== null && item.value !== 0);
          setApiData(reduceData(newRes))
        }
      })
  }, [pieData])


  return (
    <ResponsivePie
      data={apiData}
      margin={{ top: 10, right: 60, bottom: 80, left: 80}}
      colors={{ scheme: 'set2' }}
      indexBy={'abuse'}
      innerRadius={0.8}
      padAngle={0.7}
      cornerRadius={3}
      activeOuterRadiusOffset={8}
      borderWidth={1}
      enableArcLinkLabels={true}
      arcLinkLabelsSkipAngle={5}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      arcLabelsSkipAngle={10}
              defs={[
            {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true
            },
            {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'DWT'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Mobile'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'CDN'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Commercial'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'Fixed Line ISP'
                },
                id: 'lines'
            },
                    ]}
            />
  )
}

export default PieChart 
