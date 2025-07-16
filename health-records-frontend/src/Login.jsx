function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:4000/auth/google';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Please login</h2>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-black font-semibold px-6 py-3 rounded-xl transition duration-200"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Login;
