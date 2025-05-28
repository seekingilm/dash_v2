import Box from "@mui/material/Box";
import {  Button } from "@mui/material";
import { Link } from "react-router-dom";
import DashboardIcon from '@mui/icons-material/Dashboard';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function NewSideBar({ open, setOpen, DrawerHeader }) {
  return(
    <Box sx={{
      backgroundColor: '#f7f7f7',
      width: '20%',
      borderRadius: "2rem",
      padding: '20px',
      marginRight: '1em',
      marginLeft: '1em',
      marginTop: '1.5em', 
    }}
    >
      <Avatar
        alt="Logo"
        src='../public/Logo.png'
        sx={{
          height: '90px',
          width: '90px',
          mx: 'auto',
          display: 'block',
          my: '1em',
        }}
      />
      <Typography sx={{
        fontSize: "18px",
        fontFamily: '"Open Sans", sans-serif',
        fontWeight: '400',
        color: 'darkgrey',
        marginBottom: '0.5em',
        }}>
        MENU
      </Typography>

      <Typography sx={{
        fontSize: "24px",
        fontFamily: '"Open Sans", sans-serif',
        '&:hover': {
          fontWeight: '900', 
          cursor: 'default',
        },
        marginBottom: '0.5em',
        }}>
        <Link to="/" style={{
          color: "black",
        }}>  <Button variant="contained"  startIcon={<DashboardIcon/>} 
          sx={{
            border: 'none', // Remove border
            boxShadow: 'none', // Remove shadow
            color: 'black',
            backgroundColor: "#f7f7f7",
            '&:hover': {
              backgroundColor: "#f7f7f7",
              boxShadow: 'none', // Remove hover shadow
            },
            '&:submit': { 
              backgroundColor: "#f7f7f7",
            },       
            '&:focus': {
              outline: 'none', // Remove focus outline
            },
        fontSize: '23px',
          }}
      >Dashboard</Button></Link>
      </Typography>
    </Box>
  );
}

export default NewSideBar;
