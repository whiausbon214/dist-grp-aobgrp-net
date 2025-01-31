import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/joy';
import { NavLink } from 'react-router-dom';
import { FiMail, FiCloud, FiHome } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';

function AppNavbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <img src="/icon.svg" alt="AOBG" height={40} style={{ marginRight: '16px' }} />
          <Typography variant="h6">AOBG Internal Tools</Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton component={NavLink} to="/" color="inherit">
            <FiHome size={20} />
            <Typography variant="caption">Home</Typography>
          </IconButton>
          <IconButton component={NavLink} to="/distribution-groups" color="inherit">
            <FiMail size={20} />
            <Typography variant="caption">Dist Groups</Typography>
          </IconButton>
          <IconButton component={NavLink} to="/mailing-list" color="inherit">
            <SiMailchimp size={20} />
            <Typography variant="caption">Mailing List</Typography>
          </IconButton>
          <IconButton component={NavLink} to="/cloud-status" color="inherit">
            <FiCloud size={20} />
            <Typography variant="caption">Cloud Status</Typography>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default AppNavbar;
