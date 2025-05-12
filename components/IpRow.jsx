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
            height: 100,
            width: "100%",
          }}
        >
          <Typography
            sx={{
              fontWeight: 900,
              marginRight: 5,
              fontSize: "14px",
              color: "#615d5c",
            }}
          >
            <StorageIcon sx={{ height: "13px" }} />
            The Number Of Ip Address
          </Typography>
          <Typography>{apiData.length}</Typography>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: 100,
            width: "100%",
          }}
        >
          <p>
            <Filter1Icon sx={{ height: "13px" }} />
            Highest Report Country <br />
            <strong>
              {highestReportCountry(apiData)
                ? highestReportCountry(apiData)
                : "Loading"}
            </strong>
          </p>
        </Card>
      </Grid>
      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: 100,
            width: "100%",
          }}
        >
          <p>
            <ElectricBoltIcon sx={{ height: "13px" }} />
            Highest Abuse Country <br />
            <strong>
              {highestAbuseCountry(apiData)
                ? highestAbuseCountry(apiData)
                : "Loading"}
            </strong>
          </p>
        </Card>
      </Grid>

      <Grid item xs={3}>
        <Card
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            borderRadius: "1em",
            height: 100,
            width: "100%",
          }}
        >
          <p>
            <DangerousIcon p={0} sx={{ height: "15px" }} />
            Highest Abuse Score I.P <br />
            <strong>
              {highestIpByAbuseScore(apiData)
                ? highestIpByAbuseScore(apiData)
                : "Loading"}
            </strong>
          </p>
        </Card>
      </Grid>
    </>
  );
}

export default IpRow;
