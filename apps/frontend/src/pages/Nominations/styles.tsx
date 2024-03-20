import { TextField } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';

import styled from 'styled-components';

export const HomeContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  height: '100%'
}));

export const SampleForm = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: 16,
  width: '50%',
}));

export const FormInput = styled(TextField)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '100%',
  id: 'filled-required',
  
}));

export const FormSelect = styled(Select)(() => ({
  width: '100%',
}));

export const FormText = styled.div(() => ({
  border: '1 px',
  boxShadow: '2px 2px 5px #ccc',
  borderRadius: '5px',
  margin: '10px',
}))
export const FormQuestionContainer = styled.div(() => ({
  border: '1 px',
  alignItems: 'center',
  justifyContent:'center',
  flexDirection: 'column',
  boxShadow: '2px 2px 5px #ccc',
  borderRadius: '5px',
  margin: '10px',
  display:'flex',
}))
export const FormTextContainer = styled.div(() => ({
padding: '3%'
}))
export const FormTextAnswerContainer = styled.div(() => ({
  display: 'flex',
  paddingBottom: '3%',
  width: '100%',
  justifyContent: 'center',
}))