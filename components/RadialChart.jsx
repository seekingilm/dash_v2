import { ResponsiveRadialBar } from "@nivo/radial-bar";
import { useState, useEffect } from "react";
import { mockRadialData as data } from "../data/mockData";

function topFive(data) {
  let returnCountries = [];

  data.forEach((item) => {
    let country = item["country"];

    if (returnCountries.length === 0) {
      returnCountries.push({ country: item["country"], abuse: item["abuse"] });
    }

    returnCountries.forEach((x) => {
      if (x["country"] === country) {
        x["abuse"] = x["abuse"] + item["abuse"];
      } else {
        returnCountries.push({ country: country, abuse: item["abuse"] });
      }
    });
  });

  return 0;
}

function getTopCountriesByAbuse(objectsList) {
  // Create a dictionary to store abuse totals by country
  const abuseTotals = {};

  // Loop through each object and accumulate the abuse score by country
  objectsList.forEach((obj) => {
    const country = obj.country;
    const abuseScore = obj.abuse;

    // If the country is already in the dictionary, add the abuse score to its total
    // Otherwise, initialize it with the current abuse score
    if (abuseTotals[country]) {
      abuseTotals[country] += abuseScore;
    } else {
      abuseTotals[country] = abuseScore;
    }
  });

  // Convert the dictionary to an array of [country, totalAbuse] pairs
  const sortedCountries = Object.entries(abuseTotals)
    // Sort the array by abuse totals in descending order
    .sort(([, a], [, b]) => b - a)
    // Take the first 5 entries
    .slice(0, 5)
    // Extract only the country names
    .map(([country]) => country);

  return sortedCountries;
}

function findHighestAbuseScoreForCountry(data, country) {
  let lowestAbuseScore = 0;

  if (data.constructor === Array) {
    data.forEach((entry) => {
      if (entry.country === country) {
        const abuseScore = entry.abuse;
        if (abuseScore > lowestAbuseScore) {
          lowestAbuseScore = abuseScore;
        }
      }
    });
  }

  if (lowestAbuseScore === 0) {
    return null;
  }

  return lowestAbuseScore;
}

function findLowestAbuseScoreForCountry(data, country) {
  let lowestAbuseScore = Infinity;

  if (data.constructor === Array) {
    data.forEach((entry) => {
      if (entry.country === country) {
        const abuseScore = entry.abuse;
        if (abuseScore < lowestAbuseScore) {
          lowestAbuseScore = abuseScore;
        }
      }
    });
  }

  if (lowestAbuseScore === Infinity) {
    return null;
  }

  return lowestAbuseScore;
}

function findMedianAbuseScoreForCountry(data, country) {
  // Filter the data to get only the entries for the specified country
  const countryData = data.filter((entry) => entry.country === country);
  console.log(countryData);

  // Extract the abuse scores from the filtered data
  const abuseScores = countryData.map((entry) => entry.abuse);
  console.log(abuseScores);

  if (abuseScores.length === 0) {
    return null; // Return null if there are no abuse scores for the country
  }

  // Calculate the average
  const total = abuseScores.reduce((sum, score) => sum + score, 0);
  const average = total / abuseScores.length;

  return average;
}

function createDataStructure(countries, inputData) {
  let returnList = countries.map((country) => ({
    id: country,
    data: [
      { x: "Low", y: findLowestAbuseScoreForCountry(inputData, country) }, // Random value for 'Low'
      { x: "Medium", y: findMedianAbuseScoreForCountry(inputData, country) }, // Random value for 'Medium'
      { x: "High", y: findHighestAbuseScoreForCountry(inputData, country) }, // Random value for 'High'
    ],
  }));

  console.log(returnList);

  return returnList;
}

function createData(data) {
  return createDataStructure(getTopCountriesByAbuse(data), data);
}

function RadialChart({ radialData }) {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/table", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(radialData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.constructor === Array) {
          console.log(createData(res));
          setApiData(createData(res));
        }
      });
  }, [radialData]);

  return (
    <ResponsiveRadialBar
      data={apiData}
      valueFormat=">-.2f"
      padding={0.4}
      cornerRadius={2}
      margin={{ top: 25, right: 0, bottom: 80, left: 0 }}
      radialAxisStart={{ tickSize: 5, tickPadding: 5, tickRotation: 0 }}
      circularAxisOuter={{ tickSize: 5, tickPadding: 12, tickRotation: 0 }}
    />
  );
}

export default RadialChart;
