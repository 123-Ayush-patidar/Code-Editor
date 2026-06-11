import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          Login
        </h1>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full border p-3 rounded"
          />

          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-3 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;