import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
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
import { mockDataTeam as data } from '../data/mockData';
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

        {/* view data */}


        <div>{dataJSON ? <h1>All IPs</h1> : <h6>Click Upload Button To Upload Data</h6>}</div>
      </Box>
    </Box>
  );
}

function Dash() {
  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#C8F0FF",
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
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      backgroundColor: "#0A4570",
      color: "white",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: 0, // Set width to 0 when collapsed
        display: 'none', // Ensure it does not take up any space
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
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>

              <Link2 to={"/"}>
            <img src={Logo} alt="Logo" style={{ height: 50, marginRight: 20 }} />
            </Link2>
            <Typography
              component="h1"
              variant="h5" // Smaller font size
              noWrap
              sx={{ flexGrow: 1, textAlign: "center", fontWeight: 'bold' }} // Bold font
            >
              Intel Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon sx={{ color: "white" }} />
            </IconButton>
          </Toolbar>
          <Divider sx={{ borderColor: "white" }} />
          <List component="nav">
            <Typography variant="h5" sx={{ padding: "16px", fontWeight: "bold", color: "white", display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon" style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
              </svg>
              <Link2 to={"/"}>
              Main Menu
              </Link2>
            </Typography>
            <Divider orientation="vertical" sx={{ borderColor: "white", height: "auto" }} />
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>Domains</Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link href="https://www.mandiant.com" target="_blank" sx={{ color: "inherit", textDecoration: "none" }}>Hashes</Link>
            </Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link2 to={`threat_hunting`}>
              Threat Hunting</Link2>
            </Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link href="https://www.flashpoint-intel.com" target="_blank" sx={{ color: "inherit", textDecoration: "none" }}>URL</Link>
            </Typography>
            <Divider sx={{ my: 1, borderColor: "white" }} />
            <Sheet onSubmit={getData} />
          </List>
        </Drawer>
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
          <Toolbar />
          <Container id="worldy" maxWidth={false} sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    height: 400,
                    width: '100%'
                  }}
                >
                  <Geo geoData={returnData} isDashboard={true} />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    width: '100%'
                  }}
                >
                  <Typography >
                    Average Abuse Per Country
                  </Typography>
                  <IpTwo barData={returnData} />
                  
                </Paper>
              </Grid>

              <Grid item xs={12} md={4} lg={6}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 240,
                    width: '100%'
                  }}
                >
                  <Typography >
                    Types Of Abusive IPs
                  </Typography>

                  <Ipchart pieData={returnData} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
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
