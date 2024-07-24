import Box from '@mui/system/Box';
import Typography from "@mui/material/Typography" // Corrected line
import Card from './Cards'
import DrawerTwo from './DrawerTwo'
import MenuBar from './MenuBar';
import Grid from '@mui/system/Unstable_Grid'

function Blocky() {
  return (
    <Grid>
    <MenuBar/>
    <Grid bgcolor={'pink'} container spacing={2}>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}> <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
        <Grid xs={2}>
          <Card />
        </Grid>
      </Grid>
      </Grid>
  )
}

export default Blocky 
