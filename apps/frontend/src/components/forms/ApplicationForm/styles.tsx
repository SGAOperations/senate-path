import FormGroup from '@mui/material/FormGroup';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';

export const SampleForm = styled(FormGroup)(() => ({
  display: 'flex',
  flexDirection: 'column',
  rowGap: 16,
  width: '70%',
  paddingBottom: '2%',
}));

export const FormInput = styled(TextField)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: '100%',
  id: 'filled-required',
}));

export const FormSelect = styled(Select)(() => ({
  width: '50%',
  justifyContent: 'center',
}));

export const FormText = styled.div(() => ({
  border: '1px',
  boxShadow: '2px 2px 5px #ccc',
  borderRadius: '5px',
  margin: '10px',
}));

export const FormQuestionContainer = styled.div(() => ({
  border: '1px',
  alignItems: 'center',
  justifyContent: 'center',
  flexDirection: 'column',
  boxShadow: '2px 2px 5px #ccc',
  borderRadius: '5px',
  margin: '10px',
  display: 'block',
}));

export const FormTextContainer = styled.div(() => ({
  padding: '3%',
  justifyContent: 'center',
  alignItems: 'center',
}));

export const FormTextAnswerContainer = styled.div(() => ({
  display: 'flex',
  paddingBottom: '3%',
  width: '100%',
  justifyContent: 'center',
}));

export const Introduction = styled('div')({
  width: '100%',
  textAlign: 'center',
  margin: '20px 0',
});

export const FormInputCheckbox = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '3%',
  justifyContent: 'center',
  paddingBottom: '3%',
});

export const RadioButtons = styled('div')({
  width: '100%',
  textAlign: 'center',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '3%',
});
