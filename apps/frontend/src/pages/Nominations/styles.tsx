import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';

import styled from 'styled-components';

export const HomeContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

export const SampleForm = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: 16,
  width: '50%',
}));

export const FormInput = styled(Input)(() => ({
  width: '50%',
}));

export const FormSelect = styled(Select)(() => ({
  width: '50%',
}));
