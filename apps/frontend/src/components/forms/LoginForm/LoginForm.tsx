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
  const username = useState<string>('');
  const password = useState<string>('');

  const onSubmit = () => {};

  return (
    <>
      <FormControl>
        <TextField
          label="Username"
          required
          placeholder="Username"
          onChange={(e) =>
            e.target.value == 'password' ? setLoginStatus(true) : null
          }
        />
      </FormControl>
      <FormControl>
        <TextField
          type="password"
          label="Password"
          required
          placeholder="Password"
          onChange={(e) =>
            e.target.value == 'password' ? setLoginStatus(true) : null
          }
        />
      </FormControl>
      <Button variant="contained" onClick={onSubmit}>
        Submit
      </Button>
    </>
  );
};
