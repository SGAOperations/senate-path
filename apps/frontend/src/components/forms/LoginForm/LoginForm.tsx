import {
  Button,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';

interface Props {
  setLoginStatus: (isLoggedIn: boolean) => void;
}

export const LoginForm: React.FC<Props> = ({ setLoginStatus }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onSubmit = () => {
    if (username === 'username' && password === 'password') {
      setLoginStatus(true);
    }
  };

  return (
    <>
      <FormControl>
        <TextField
          label="Username"
          required
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl>
        <TextField
          type="password"
          label="Password"
          required
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormControl>
      <Button variant="contained" onClick={onSubmit}>
        Submit
      </Button>
    </>
  );
};
