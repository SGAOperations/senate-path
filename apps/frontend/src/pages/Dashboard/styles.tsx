import styled from 'styled-components';

export const HomeContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start', // Align children to the top
  padding: '20px',
  backgroundColor: '#f7f9fc',
  minHeight: '100vh',
}));

export const Nominations = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: '#fff',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '20px 0',
  width: '80%',
  maxWidth: '500px',
  textAlign: 'center',
}));

export const InputContainer = styled.div(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  width: '80%',
  maxWidth: '500px',
  padding: '15px 20px',
  borderRadius: '8px',
  position: 'sticky', // Keeps it in view while scrolling
  top: '0', // Positions it at the top
  zIndex: '1000', // Ensures it stays above other content
}));

export const SubmitButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  marginTop: '10px',
  '&:hover': {
    backgroundColor: '#0056b3',
  },
}));
