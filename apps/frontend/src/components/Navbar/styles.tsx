import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const StyledToolbar = styled(Toolbar)(() => ({
  display: 'flex',
}));

export const NavbarLink = styled(Link)(() => ({
  color: '#fff',
  textDecoration: 'none',
  textTransform: 'none',

  '&:hover': {
    textDecoration: 'underline',
  },
}));
