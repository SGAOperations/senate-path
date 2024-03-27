import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import styled from 'styled-components';

export const HomeContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const SampleForm = styled(Box)(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: 16,
  width: '50%',
}));

export const FormInput = styled(TextField)(() => ({
  width: '50%',
}));
