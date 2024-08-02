import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";

import { useEffect, useState } from 'react';

function IpNumber({ IpSource }) {
  const [apiData, setApiData] = useState([])

  useEffect(() => {
    fetch('http://127.0.0.1:5000/table', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(IpSource)
    }).then(res => res.json()).
      then(res => {
        if (res.constructor === Array) {
          setApiData(res)
        }
      })
  }, [IpSource])


  return (
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
            color: "#615d5c",
          }}
        >
          The Number Of Ip Address 
        </Typography>
        <Typography>{apiData.length}</Typography>
      </Card>
    </Grid>
  )
}

export default IpNumber
