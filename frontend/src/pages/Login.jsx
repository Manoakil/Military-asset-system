import { useState } from "react";
import { loginUser } from "../api/api";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoUsers = [
    { username: "admin1", password: "admin123", role: "Admin", description: "Full access to all data" },
    { username: "commander1", password: "cmd123", role: "Base Commander", description: "Access to Base Alpha data" },
    { username: "logistics1", password: "log123", role: "Logistics Officer", description: "Purchase & transfer access" },
  ];

  const fillDemo = (username, password) => {
    setForm({ username, password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!form.username.trim() || !form.password.trim()) {
        setError("Username and password are required");
        setLoading(false);
        return;
      }
      const res = await loginUser(form);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid username or password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-900 mb-2">
            Military Asset Management
          </h1>
          <p className="text-center text-gray-600 mb-8">System Login</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <p className="text-red-600 text-sm p-3 bg-red-50 rounded-lg">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-8 border-t pt-8">
            <h3 className="font-bold text-gray-800 mb-4">Demo Credentials:</h3>
            <div className="space-y-3">
              {demoUsers.map((user) => (
                <div
                  key={user.username}
                  onClick={() => fillDemo(user.username, user.password)}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                >
                  <div className="font-medium text-blue-600">{user.role}</div>
                  <div className="text-sm text-gray-600">{user.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.username} / {user.password}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
