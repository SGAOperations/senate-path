import { Routes, Route } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Nominations from './pages/Nominations';
import Applications from './pages/Applications';
import Admin from './pages/Admin';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { muiTheme } from './theme';

const App: React.FC = () => {
  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="nominations" element={<Nominations />} />
        <Route path="applications" element={<Applications />} />
        <Route path="admin" element={<Admin />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MuiThemeProvider>
  );
};

export default App;
