import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import Filter1Icon from "@mui/icons-material/Filter1";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DangerousIcon from "@mui/icons-material/Dangerous";
import Looks3Icon from "@mui/icons-material/Looks3";

import { useEffect, useState } from "react";
import StorageIcon from "@mui/icons-material/Storage";

function highestReportCountry(data) {
  let highestReport = { country: "", report: 0 };

  data.forEach((item) => {
    if (item["total"] > highestReport["report"]) {
      highestReport["report"] = item["total"];
      highestReport["country"] = item["country"];
    }
  });

  return highestReport["country"];
}

function highestIpByAbuseScore(data) {
  let highestAbuseIp = { ip: "", abuse: 0 };

  data.forEach((item) => {
    if (item["abuse"] > highestAbuseIp["abuse"]) {
      highestAbuseIp["abuse"] = item["abuse"];
      highestAbuseIp["ip"] = item["ip"];
    }
  });

  return highestAbuseIp["ip"];
}

function highestAbuseCountry(data) {
  let highestAbuseCountry = { country: "", abuse: 0 };

  data.forEach((item) => {
    if (item["abuse"] > highestAbuseCountry["abuse"]) {
      highestAbuseCountry["abuse"] = item["abuse"];
      highestAbuseCountry["country"] = item["country"];
    }
  });

  return highestAbuseCountry["country"];
}

function IpRow({ IpSource }) {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/table", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(IpSource),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.constructor === Array) {
          setApiData(res);
        }
      });
  }, [IpSource]);

  return (
    <>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexFlow: "column",
            borderRadius: "1em",
            justifyContent: "center",
            height: "100%",
            background: 'linear-gradient(to right, #134e5e, #71b280);', // Gradient colors
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              marginRight: 5,
              marginTop: 1,
              marginBottom: 2,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "23px",
              color: "white",
            }}
          >
            IPs Count
          </Typography>
          <Typography 
            sx={{ 
              fontSize: 56, 
              color: "white",
              fontWeight: 600,
              marginBottom: '0.5em',
              fontFamily: '"Open Sans", sans-serif',
            }}>
              {apiData.length}
          </Typography>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: "100%",
            width: "100%",
          }}
        >
            <Typography
              sx={{
                fontWeight: 500,
                marginTop: 1,
                marginBottom: 3,
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "20px",
                color: "black",
              }}
            >
              Most Reported Country
            </Typography>
            <Typography
              sx={{
              color: "black",
              fontWeight: 600,
              marginRight: 5,
              marginBottom: 1,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "35px",
              }}
            >
              {highestReportCountry(apiData)
                ? highestReportCountry(apiData)
                : "N/A"}
            </Typography>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: '100%',
            width: "100%",
          }}
        >
            <Typography
              sx={{
                fontWeight: 500,
                marginTop: 1,
                marginBottom: 3,
                fontFamily: '"Open Sans", sans-serif',
                fontSize: "20px",
                color: "black",   
              }}
            >
              Highest Abuse Country 
            </Typography>
            <Typography
              sx={{
              fontWeight: 600,
              marginRight: 5,
              marginBottom: 1,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "35px",
              color: "black",
              }}
            >
              {highestAbuseCountry(apiData)
                ? highestAbuseCountry(apiData)
                : "N/A"}
            </Typography>
        </Card>
      </Grid>

      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: '100%',
            width: "100%",
          }}
        >
          <Typography sx={{
              marginRight: 0,
              marginTop: 1,
              marginBottom: 3,
              fontSize: "20px",
              color: "black",
            }}>
            Highest Abuse Score I.P 
          </Typography>
            <Typography
            sx={{ 
              fontWeight: 600,
              marginRight: 5,
              marginBottom: 1,
              fontFamily: '"Open Sans", sans-serif',
              fontSize: "30px",
              color: "black",
            }}>
              {highestIpByAbuseScore(apiData)
                ? highestIpByAbuseScore(apiData)
                : "N/A"}
            </Typography>
        </Card>
      </Grid>
    </>
  );
}

export default IpRow;
