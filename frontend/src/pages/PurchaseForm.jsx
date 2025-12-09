import React, { useState, useEffect } from 'react';
import { createPurchase, getPurchases, getBases, getEquipment } from '../api/api';

export default function PurchasePage() {
  const [baseId, setBaseId] = useState('1');
  const [equipmentId, setEquipmentId] = useState('1');
  const [quantity, setQuantity] = useState('1');
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getBases().then(res => setBases(res.data)).catch(e => console.log(e));
    getEquipment().then(res => setEquipment(res.data)).catch(e => console.log(e));
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const res = await getPurchases({ base_id: baseId });
      setPurchases(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        base_id: Number(baseId),
        equipment_id: Number(equipmentId),
        quantity: Number(quantity),
        purchase_date: purchaseDate
      };
      const res = await createPurchase(payload);
      setSuccess('Purchase recorded successfully!');
      setQuantity('1');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      fetchPurchases();
    } catch (err) {
      setError('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  }

  const getEquipmentName = (id) => equipment.find(e => e.id === id)?.name || `Equipment ${id}`;
  const getBaseName = (id) => bases.find(b => b.id === id)?.name || `Base ${id}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Record Purchase</h1>
        <p className="text-gray-600 mb-8">Logged in as: {user.name} ({user.role})</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">New Purchase</h2>

            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Base *</label>
                <select
                  value={baseId}
                  onChange={(e) => {
                    setBaseId(e.target.value);
                    fetchPurchases();
                  }}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {bases.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Equipment *</label>
                <select
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  {equipment.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Quantity *</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Purchase Date</label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {error && <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{error}</p>}
              {success && <p className="text-green-600 bg-green-50 p-3 rounded-lg text-sm">{success}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Recording...' : 'Record Purchase'}
              </button>
            </form>
          </div>

          {/* Purchase History */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Purchase History</h2>

            {purchases.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {purchases.map((p) => (
                  <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-blue-600">{getEquipmentName(p.equipment_id)}</span>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold text-sm">
                        {p.quantity} units
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{getBaseName(p.base_id)}</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(p.purchase_date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No purchases recorded for this base</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
