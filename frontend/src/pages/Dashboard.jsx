import { useEffect, useState, useCallback } from "react";
import { getDashboardData, getBases, getEquipment } from "../api/api";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [filters, setFilters] = useState({
    base_id: "1",
    start_date: "",
    end_date: ""
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getBases().then(res => setBases(res.data)).catch(e => console.log(e));
    getEquipment().then(res => setEquipment(res.data)).catch(e => console.log(e));
  }, []);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardData(filters);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const openNetMovementModal = () => {
    setModalContent("net_movement");
    setShowModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome, {user.name || user.username} ({user.role})</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Base</label>
              <select
                value={filters.base_id}
                onChange={(e) => setFilters({ ...filters, base_id: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              >
                {bases.map(base => (
                  <option key={base.id} value={base.id}>{base.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <input
                type="date"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchDashboard}
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        )}

        {/* Dashboard Cards */}
        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard title="Opening Balance" value={data.opening_balance} color="bg-blue-500" />
              <MetricCard title="Purchases" value={data.purchases} color="bg-green-500" />
              <MetricCard title="Transfer In" value={data.transfer_in} color="bg-indigo-500" />
              <MetricCard title="Transfer Out" value={data.transfer_out} color="bg-yellow-500" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard title="Assigned" value={data.assigned} color="bg-purple-500" />
              <MetricCard title="Expended" value={data.expended} color="bg-red-500" />
              <MetricCard
                title="Net Movement"
                value={data.net_movement}
                color="bg-orange-500"
                clickable={true}
                onClick={openNetMovementModal}
              />
              <MetricCard title="Closing Balance" value={data.closing_balance} color="bg-teal-500" />
            </div>
          </>
        )}
      </div>

      {/* Net Movement Modal */}
      {showModal && modalContent === "net_movement" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Net Movement Breakdown</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-medium">Purchases</span>
                <span className="text-green-600 font-bold">+{data?.purchases || 0}</span>
              </div>
              <div className="flex justify-between p-3 bg-indigo-50 rounded-lg">
                <span className="font-medium">Transfer In</span>
                <span className="text-indigo-600 font-bold">+{data?.transfer_in || 0}</span>
              </div>
              <div className="flex justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="font-medium">Transfer Out</span>
                <span className="text-yellow-600 font-bold">-{data?.transfer_out || 0}</span>
              </div>
              <div className="border-t pt-3 mt-3 flex justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-bold">Net Movement</span>
                <span className="text-blue-600 font-bold">{data?.net_movement || 0}</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-6 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ title, value, color, clickable, onClick }) {
  return (
    <div
      className={`rounded-lg shadow-lg p-6 text-white ${color} cursor-pointer hover:shadow-xl transition ${clickable ? "hover:scale-105" : ""}`}
      onClick={onClick}
    >
      <h3 className="text-sm font-medium opacity-90">{title}</h3>
      <p className="text-4xl font-bold mt-3">{value}</p>
      {clickable && <p className="text-xs mt-2 opacity-75">Click to see details</p>}
    </div>
  );
}
