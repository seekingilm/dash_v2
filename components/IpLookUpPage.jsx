import React, { useState, useEffect } from "react";
import { styled, createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import { Outlet, Link as Link2 } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Modal from '@mui/material/Modal';
import * as XLSX from "xlsx";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { FormControl, Button, Input } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import TextField from '@mui/material/TextField';
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
import GeographyChart from './Geochart'
import Tab_display from './TableDisplay';
import TableDisplay from "./TableDisplay";
import Logo from './Colorful Illustrative 3D Robot Artificial Intelligence Logo (3).jpg';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SideBar from "./Sidebar"
import RadialChart from './RadialChart'
import { Page, Text, View, Document, Image, StyleSheet } from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';


const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'space-between',
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "magenta",
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
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
  },
  section: {
    margin: 10,
    padding: 10,
    width: '100%',
    flexGrow: 1
  },
  image: {
    margin: 10,
    padding: 10,
    width: '250px',
    flexGrow: 1
  }
})


function Sheet(props) {
  const [excelFile, setExcelFile] = useState(null);
  const [dataJSON, setDataJSON] = useState(null);
  const [typeError, setTypeError] = useState(null);

  const [excelData, setExcelData] = useState(null);
  let apiKey = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c";

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
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    borderRadius: '1rem',
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
    }
  };

  return (
    <Box display={'inline-block'} ml={1} marginTop={'24px'}>
      <Button onClick={handleOpen} variant="contained">Upload From Excel</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={handleFileSubmit}>
            <FormControl sx={{ width: '25ch' }}>
              <Input sx={{ display: 'inline-block' }} type="file" required onChange={handleFile} />
              <Button sx={{ display: 'inline-block' }} variant="contained" m={3} type="submit">Upload</Button>
            </FormControl>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}


function IpLookUpPage() {
  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#f3f3f3",
      },
    },
  });

  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const [returnData, setReturnData] = useState(null);
  const [allData, setAllData] = useState([]);
  const [ipAddress, saveIpAddress] = useState(null);
  let tempIp = '';
  let versionOfAPI = 0;

  const getData = (data) => {
    console.log("setting returnData to " + JSON.stringify(data));
    setReturnData(data);
  };

  const toggleDrawer = () => {
    setOpen(!open);
  };

  function updateInput(ish){
    tempIp = ish
    console.log('The Ip is: ', tempIp)
  }

  function saveIp(){
    saveIpAddress(tempIp);
  }

  useEffect(() => {
    if (ipAddress != null) {
      fetch('http://127.0.0.1:5000/table', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{"IPV4": ipAddress}])
      }).then(res => res.json()).
        then(res => {
          if (res.constructor === Array) {
            if (res[0].abuse < 5) {
              setAllData(res)
            }
            else if(res[0].abuse > 5  && res[0].abuse < 20){
              fetch('http://127.0.0.1:5000/virus', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(ipAddress)
              }).then(res => res.json()).then(res => setAllData(res))
            }
            else if (res[0].abuse > 20){
              fetch('http://127.0.0.1:5000/alien', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(ipAddress)
              }).then(res => res.json()).then(res => setAllData(res))
            }
          }
        })
    }
  }, [ipAddress]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex", width: "100vw" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
            }}
          >
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
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1, textAlign: "center" }}
            >
              Intel Dashboard
            </Typography>
            <IconButton color="inherit">
              <Badge badgeContent={4} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
        <SideBar open={open} setOpen={setOpen} DrawerHeader={DrawerHeader} />
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
            transition: theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            marginLeft: open
              ? `${drawerWidth}px`
              : `calc(${theme.spacing(7)} + 1px)`,
            width: open
              ? `calc(100% - ${drawerWidth}px)`
              : `calc(100% - ${theme.spacing(7)} - 1px)`,
          }}
        >
          <DrawerHeader />
          <Container sx={{ mt: 4, mb: 4 }}>
            <Box display={"flex"}>
              <Typography
                display={"inline-block"}
                variant="h4"
                ml={1}
                my={3}
                sx={{
                  fontWeight: "700",
                }}
              >
                Dashboard
              </Typography>
              <Sheet onSubmit={getData} />
              <GeographyChart geoData={returnData} />
            </Box>
            <Grid container >
              <Grid item xs={24}>
                <Card
                  sx={{
                    p: 2,
                    display: "flex",
                    flexFlow: "column",
                    borderRadius: "1em",
                    justifyContent: "center",
                    height: 800,
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
                    <Box
                      sx={{
                        width: 500,
                        margin: 'auto',
                        marginBottom: '10px',
                        display: 'flex',
                        maxWidth: '100%',
                      }}
                    >
                      <TextField
                        fullWidth
                        onChange={(event) => updateInput(event.target.value)}
                        label="Search For IP"
                        id="fullWidth"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{marginLeft: '0.5rem'}}
                        onClick={() => {
                          event.preventDefault();
                          saveIp()
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Typography>
                  <Box sx={{
                    maxWidth: '100%',
                  }}
                  >
                    <PDFViewer style={{ width: '100%', height: '600px' }}>
                      <Document>
                        <Page style={styles.page}>
                          <View style={styles.section}>
                            <Text>IP Search Report On {new Date().toLocaleDateString('en-US')}</Text>
                            <Text>{allData ? JSON.stringify(allData) : "No Data"} </Text>
                            <Text>IP Lookup: {ipAddress ? ipAddress: "No IP"}</Text>
                            <Text>Abuse Score: {allData.length > 0 ? JSON.stringify(allData[0].abuse) : 0}</Text>
                            <Text>Country: {allData.length > 0 ? allData[0].country : 'N/A'}</Text>
                            <Text>ISP: {allData.length > 0 ? allData[0].category : 'N/A'}</Text>
                            <Text>Total Reports: {allData.length > 0 ? JSON.stringify(allData[0].total) : 'N/A'}</Text>
                          </View>
                        </Page>
                      </Document>
                    </PDFViewer>
                  </Box>

                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}


export default IpLookUpPage 
