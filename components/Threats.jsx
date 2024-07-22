import TextField from '@mui/material/TextField'
import { Outlet, Link as Link2 } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from 'react';
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Box from '@mui/material/Box'

import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography"; // Corrected line
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Logo from './Colorful Illustrative 3D Robot Artificial Intelligence Logo (3).jpg';  // Updated path to your logo image

function Threats() {
  const defaultTheme = createTheme({
    palette: {
      background: {
        default: "#C8F0FF",
      },
    },
  });

  const drawerWidth = 240;

  const [open, setOpen] = useState(false); // Default set to false to fully collapse the side header
  const [selectedOption, setSelectedOption] = useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
  })(({ theme, open }) => ({ "& .MuiDrawer-paper": {
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
            Intel Dashboard For Threat Hunting
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
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link2 to={"/domain"}>
                Domains
              </Link2>
              </Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link2 to={'/Hash'}>Hashes</Link2>
            </Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              <Link2 to={`/threat_hunting`}>
              Threat Hunting</Link2>
            </Typography>
            <Typography variant="h6" sx={{ padding: "8px", color: "white" }}>
              URL
            </Typography>
            <Divider sx={{ my: 1, borderColor: "white" }} />
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
        <TextField id="outlined-basic" label="Search For IP" variant="outlined" />
      </Box>
    </ThemeProvider>

  );

}

export default Threats
