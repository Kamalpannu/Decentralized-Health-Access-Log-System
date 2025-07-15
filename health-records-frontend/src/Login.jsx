function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div>
      <h2>Please login</h2>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
}

export default Login;
