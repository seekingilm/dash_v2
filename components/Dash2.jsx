import React, { useState, useEffect } from "react";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import DangerousIcon from "@mui/icons-material/Dangerous";
import Looks3Icon from "@mui/icons-material/Looks3";
import {
  styled,
  createTheme,
  ThemeProvider,
  useTheme,
} from "@mui/material/styles";
import { Link as Link2 } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Modal from "@mui/material/Modal";
import * as XLSX from "xlsx";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { FormControl, Button, Input } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
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
import PieChart from "./PieChart";
import BarChart from "./BarChart";
import World from "./World";
import Tab_display from "./TableDisplay";
import TableDisplay from "./TableDisplay";
import Logo from "./Colorful Illustrative 3D Robot Artificial Intelligence Logo (3).jpg";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import NewSideBar from "./NewSideBar";
import RadialChart from "./RadialChart";
import GeographyChart from "./Geochart";
import IpRow from "./IpRow";
import AreaBump from "./AreaBump";
import UploadIcon from '@mui/icons-material/Upload'; 

import BoxChart from "./BoxChart";

const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: "space-between",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "#0039a6",
  color: "white",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  ...(!open && {
    marginLeft: 0,
    width: `calc(100% - 0px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

function Sheet(props) {
  const [excelFile, setExcelFile] = useState(null);
  const [dataJSON, setDataJSON] = useState(null);
  const [typeError, setTypeError] = useState(null);

  const [excelData, setExcelData] = useState(null);
  let apiKey =
    "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c";

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 300,
    bgcolor: "background.paper",
    borderRadius: "1rem",
    boxShadow: 24,
    p: 4,
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
      handleClose();
    }
  };

  return (
    <Box display={"inline-block"} ml={1} marginTop={"24px"}>
      <Button onClick={handleOpen} variant="contained"  startIcon={<UploadIcon />} 
        sx={{
          borderRadius: '2em',
          backgroundColor: "#436746",
          '&:hover': {
            backgroundColor: "#436746",
          },
          '&:submit': { 
            backgroundColor: "#436746",
          },       
        }}
      >
        Upload  
      </Button>
      <Button variant="contained" 
        sx={{
          borderRadius: '2em',
          ml: 2,
          backgroundColor: "#ffffff",
          '&:hover': {
            backgroundColor: 'transparent', // or the same color as the default
          },
        }}> 
        <Link2 to="/" ><span style={{
          color: 'black'
        }}>General Report</span></Link2>
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFileSubmit}>
            <FormControl sx={{ width: "25ch" }}>
              <Input
                sx={{ display: "inline-block" }}
                type="file"
                required
                onChange={handleFile}
              />
              <Button
                sx={{ display: "inline-block" }}
                variant="contained"
                m={3}
                type="submit"
              >
                Upload
              </Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

function Dash() {
  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#ffffff",
      },
    },
  });

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [returnData, setReturnData] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  let isDashboard = false;

  const getData = (data) => {
    setReturnData(data);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <>
      <Box sx={{ display: "flex", width: "100%" }}>
        <CssBaseline />
        <NewSideBar/>
        <Box
          component="main"
          sx={{
            backgroundColor: '#f7f7f7',
            flexGrow: 1,
            borderRadius: "2rem",
            height: "100vh",
            overflow: "auto",
            width: '100%',
            marginTop: '1.5em', 
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
            <Box display={"flex"} justifyContent={"space-between"}>
              <Typography
                display={"inline-block"}
                variant="h4"
                ml={1}
                my={3}
                sx={{
                  fontWeight: "700",
                }}
              >
                Intel Dashboard
              </Typography>
              <Sheet onSubmit={getData} />
            </Box>
            <Grid container spacing={2}>
              <IpRow IpSource={returnData} />
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "1em",
                    height: 400,
                    width: "100%",
                  }}
                >
                  <GeographyChart
                    geoData={((isDashboard = false), returnData)}
                  />
                </Card>
              </Grid>

              <Grid item xs={5}>
                <Card
                  sx={{
                    display: "flex",
                    borderRadius: "1em",
                    flexDirection: "column",
                    height: 300,
                    width: "100%",
                  }}
                >
                  <Typography
                    mx={3}
                    marginTop={2}
                    sx={{
                      fontWeight: 900,
                      color: "#615d5c",
                    }}
                  >
                    Types Of Abusive IPs
                  </Typography>
                  <PieChart pieData={returnData} dumb={"dumb"} />
                </Card>
              </Grid>

              <Grid item xs={7}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    borderRadius: "1em",
                    height: 300,
                    width: "100%",
                  }}
                >
                  <Typography
                    mx={3}
                    marginTop={0}
                    sx={{
                      fontWeight: 900,
                      color: "#615d5c",
                    }}
                  >
                    Average Abuse Per Country
                  </Typography>
                  <BarChart barData={returnData} />
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Card
                  sx={{
                    display: "flex",
                    borderRadius: "1em",
                    flexDirection: "column",
                    height: 400,
                    width: "100%",
                  }}
                >
                  <Typography
                    mx={3}
                    marginTop={2}
                    sx={{
                      fontWeight: 900,
                      color: "#615d5c",
                    }}
                  >
                    Types Of Abusive IPs
                  </Typography>
                  <RadialChart radialData={returnData} />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <TableDisplay tableData={returnData} />
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </>
  );
}

export default Dash;
