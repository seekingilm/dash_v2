import React from "react";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MuiDrawer from "@mui/material/Drawer";
import { Box, Tooltip, Typography, styled, useTheme } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ContactSupportOutlinedIcon from "@mui/icons-material/ContactSupportOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import DonutLargeOutlinedIcon from "@mui/icons-material/DonutLargeOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { grey } from "@mui/material/colors";
import PiePage from './PiePage'

// Import the image using ES6 import syntax
import logoImage from '../public/Green Modern Data Connect Logo (1).jpg';

const Arr1 = [
  { text: "IP Address ", icon: <HomeOutlinedIcon />, path: "/" },
  { text: "Domains", icon: <PeopleOutlinedIcon />, path: "/GeoPage" },
  { text: "Pie Chart", icon: <PiePage />, path: "/Pie" },
  { text: "IOC Lookup", icon: <ReceiptOutlinedIcon />, path: "/invoices" },
];

const Arr2 = [
  { text: "Resources", icon: <PersonOutlineOutlinedIcon />, path: "/form" },
  { text: "Threat Report", icon: <CalendarMonthOutlinedIcon />, path: "/calendar" },
  { text: "FAQ Page", icon: <ContactSupportOutlinedIcon />, path: "/faq" },
];

const Arr3 = [
  { text: "Bar Chart", icon: <BarChartOutlinedIcon />, path: "/GeoPage" },
  { text: " Pie Chart", icon: <DonutLargeOutlinedIcon />, path: "/redialChart" },
  { text: "Network Map Domains", icon: <LanguageOutlinedIcon />, path: "/lineChart" },
  { text: "Geography Map IP ", icon: <LanguageOutlinedIcon />, path: "/geography" },
];

function SideBar({ open, setOpen, DrawerHeader }) {
  const location = useLocation();
  const navigate = useNavigate();
  const drawerWidth = 240;

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const theme = useTheme();

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

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Link
          to={"/"}
          style={{
            color: "inherit",
            textAlign: "center",
            fontWeight: "900",
            fontSize: "25px",
            width: "100%",
          }}
        >
          Dashboard
        </Link>
        <IconButton onClick={handleDrawerClose}>
          <CancelOutlinedIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          my: "10px",
        }}
      >
        <Box
          component="img"
          alt="Logo"
          src={logoImage}
          sx={{
            width: open ? "90px" : "50px",
            height: open ? "90px" : "50px",
            transition: "0.25s",
          }}
        />
        <Typography
          sx={{
            my: "5px",
            fontWeight: "600",
            fontSize: open ? "22px" : "0",
            transition: "0.5s",
          }}
        >
          Sumaya Yusuf
        </Typography>
        <Typography
          sx={{
            fontSize: open ? "18px" : "0",
            transition: "0.5s",
            color: theme.palette.info.main,
          }}
        >
          Admin
        </Typography>
      </Box>
      <Divider />
      <List>
        {Arr1.map((item, index) => (
          <Tooltip key={index} title={open ? "" : item.text} placement="left-start">
            <Box sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[600]
                        : grey[300]
                      : null,
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </Box>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        {Arr2.map((item, index) => (
          <Tooltip key={index} title={open ? "" : item.text} placement="left-start">
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[600]
                        : grey[300]
                      : null,
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
      <Divider />
      <List>
        {Arr3.map((item, index) => (
          <Tooltip key={index} title={open ? "" : item.text} placement="left-start">
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  backgroundColor:
                    location.pathname === item.path
                      ? theme.palette.mode === "dark"
                        ? grey[600]
                        : grey[300]
                      : null,
                }}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
      </List>
    </Drawer>
  );
}

export default SideBar;