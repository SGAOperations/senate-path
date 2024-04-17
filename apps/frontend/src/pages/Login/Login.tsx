import Button from '@mui/material/Button';

const Login: React.FC = () => {
  return (
    <>
      <h1>Login</h1>
      <p>This is the login page.</p>
      {/* Problem is here, button redirects to home page w auth token but how can we actually read that token? need some sort of proxy */}
      {/* https://abhik.hashnode.dev/next-x-nest-using-supabase-google-oauth-in-nestjs */}
      <Button variant="contained" color="primary" href="https://wrwhwpmodzditxopawrq.supabase.co/auth/v1/authorize?provider=google">
        Login
      </Button>
    </>
  );
};

export default Login;
