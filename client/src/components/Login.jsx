import React from "react";

const Login = ({ username, setUsername, handleLogin }) => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-xl login-container w-96">
      <h2 className="mb-4 text-2xl font-bold">Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Masukan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded-md hover:border-blue-500 focus:ring-black focus:outline-none"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 text-white rounded-md custom-gradient"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
