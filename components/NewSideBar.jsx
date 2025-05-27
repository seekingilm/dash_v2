import Box from "@mui/material/Box";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

function NewSideBar({ open, setOpen, DrawerHeader }) {
  return(
    <Box sx={{
      backgroundColor: '#f7f7f7',
      width: '20%',
      display: 'flex',
      flowDirection: 'column',
      justifyContent: 'center',
      borderRadius: "2rem",
      mx: '1em',
      marginTop: '1.5em', 
    }}
    >
      <Avatar
        alt="Logo"
        src='../public/Logo.png'
        sx={{
          height: '90px',
          width: '90px',
          display: 'block',
          my: '1em',
        }}
      />
    </Box>
  );
}

export default NewSideBar;
