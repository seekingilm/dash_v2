import { styled, createTheme, ThemeProvider } from "@mui/material/styles"
import Avatar from '@mui/material/Avatar'
import { Outlet, Link as Link2 } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from "xlsx";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { FormControl, Button, Input } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography"; // Corrected line
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import Ipchart from "./Ipchart";
import IpTwo from "./IpsTwo";
import World from "./World";
import Geo from "./Geochart";
import Tab_display from './TableDisplay';
import TableDisplay from "./TableDisplay";
import Logo from './Colorful Illustrative 3D Robot Artificial Intelligence Logo (3).jpg';  // Updated path to your logo image
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

function Sheet(props) {
  const [excelFile, setExcelFile] = useState(null);
  const [dataJSON, setDataJSON] = useState(null);
  const [typeError, setTypeError] = useState(null);

  const [excelData, setExcelData] = useState(null);
  let apiKey = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c";

  const handleFile = (e) => {
    let fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/csv",
    ];
    let selectedFile = e.target.files[0];

    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        };
      } else {
        setTypeError("Please select only excel file types");
        setExcelFile(null);
      }
    } else {
      console.log("Please select your file");
    }
  };

  const handleFileSubmit = (e) => {
    e.preventDefault();

    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setDataJSON(data);
      props.onSubmit(data);
      setExcelData(data.slice(0, 10));
    }
  };

  return (
    <Box>
      <Box>
        <h3>Upload Excel Sheet</h3>
        <form onSubmit={handleFileSubmit}>
          <FormControl sx={{ width: '25ch' }}>
            <Input type="file" required onChange={handleFile} />
            <Button variant="contained" m={3} type="submit">Upload</Button>
            {typeError && <div role="alert">{typeError}</div>}
          </FormControl>
        </form > 
        <div>{dataJSON ? <h1>All IPs</h1> : <h6>Click Upload Button To Upload Data</h6>}</div>
      </Box>
    </Box>
  );
}

function Dash() {
  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#f3f3f3",
      },
    },
  });

  const drawerWidth = 240;

  const [open, setOpen] = useState(false); // Default set to false to fully collapse the side header
  const [returnData, setReturnData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const getData = (data) => {
    console.log("setting returnData to " + JSON.stringify(data));
    setReturnData(data);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
      position: "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      boxSizing: "border-box",
      backgroundColor: "#000000",
      color: "white",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }),
    },
  }));

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", width: '100%' }}>
        <CssBaseline />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
            width: '100%' // Ensure the Box takes the full width
          }}
        >
          <Container id="worldy" maxWidth={false} sx={{ mb: 4 }}>
            <Typography variant="h4" ml={1} my={3} sx={{
              fontWeight: "700",
            }}
            >Dashboard</Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={12}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    height: 400,
                    width: '100%',
                    borderRadius: '1em',
                  }}
                >
                  <Geo/>
                </Card>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={6}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: '1em',
                    height: 300,
                    width: '100%'
                  }}
                >
                  <Typography mx={3} marginTop={0} sx={{
                    fontWeight: 900,
                    color: '#615d5c',
                  }}>
                    Average Abuse Per Country
                  </Typography>
                  <IpTwo barData={returnData} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4} lg={6}>
                <Card
                  sx={{
                    display: "flex",
                    borderRadius: '1em',
                    flexDirection: "column",
                    height: 300,
                    width: '100%'
                  }}
                >
                  <Typography mx={3} marginTop={2} sx={{
                    fontWeight: 900,
                    color: '#615d5c',
                  }}>
                    Types Of Abusive IPs
                  </Typography>
                  <Ipchart pieData={returnData} />
                </Card>
              </Grid>
              <Grid item xs={12} md={4} lg={12}>
                <TableDisplay tableData={returnData} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function helpLoop(ajson, nameOfColumn) {
  let cleanedUpList = [];
  for (let key in ajson) {
    key = ajson[key][nameOfColumn];
    cleanedUpList.push(key);
  }

  return cleanedUpList;
}

export default Dash;
