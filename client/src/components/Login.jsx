import React from "react";

const Login = ({ username, setUsername, handleLogin }) => {
  return (
    <div className="login-container w-96 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Masukkan username Anda"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <button
          type="submit"
          className="w-full py-2 px-4 rounded bg-blue-500 text-white"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
