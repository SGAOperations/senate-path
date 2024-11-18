import { FormControl, TextField } from '@mui/material';

interface Props {
  setLoginStatus: (isLoggedIn: boolean) => void;
}

export const LoginForm: React.FC<Props> = ({ setLoginStatus }) => {
  return (
    <>
      <FormControl>
        <p>Password</p>
        <TextField
          label="Required"
          required
          placeholder="Password"
          onChange={(e) =>
            e.target.value == 'password' ? setLoginStatus(true) : null
          }
        />
      </FormControl>
    </>
  );
};
