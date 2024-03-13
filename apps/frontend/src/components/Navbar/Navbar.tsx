import { AppBar, Button } from '@mui/material';
import { NAVBAR_MENUS } from './constants';

import { NavbarLink, SGALogo, StyledToolbar } from './styles';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <StyledToolbar>
        <SGALogo>SGA Logo</SGALogo>

        {NAVBAR_MENUS.map((menu) => (
          <Button key={menu.text}>
            <NavbarLink to={menu.path}>{menu.text}</NavbarLink>
          </Button>
        ))}
      </StyledToolbar>
    </AppBar>
  );
};

export default Navbar;
