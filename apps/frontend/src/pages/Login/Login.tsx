import Button from '@mui/material/Button';

const Login: React.FC = () => {
  return (
    <>
      <h1>Login</h1>
      <p>This is the login page.</p>
      <Button variant="contained" color="primary" href="https://wrwhwpmodzditxopawrq.supabase.co/auth/v1/authorize?provider=google">
        Login
      </Button>
    </>
  );
};

export default Login;
