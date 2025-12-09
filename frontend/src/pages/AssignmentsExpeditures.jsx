import React, { useState, useEffect } from 'react';
import { createAssignment, getAssignments, createExpenditure, getExpenditures, getBases, getEquipment } from '../api/api';

export default function AssignmentsAndExpenditures() {
  const [activeTab, setActiveTab] = useState('assignments');
  const [baseId, setBaseId] = useState('1');
  const [equipmentId, setEquipmentId] = useState('1');
  const [personnelName, setPersonnelName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bases, setBases] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    getBases().then(res => setBases(res.data)).catch(e => console.log(e));
    getEquipment().then(res => setEquipment(res.data)).catch(e => console.log(e));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const assignRes = await getAssignments({ base_id: baseId });
      setAssignments(assignRes.data || []);
      const expendRes = await getExpenditures({ base_id: baseId });
      setExpenditures(expendRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!personnelName.trim()) {
      setError('Personnel name is required');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        base_id: Number(baseId),
        equipment_id: Number(equipmentId),
        personnel_name: personnelName,
        quantity: Number(quantity),
        assigned_date: date
      };
      await createAssignment(payload);
      setSuccess('Assignment recorded successfully!');
      setPersonnelName('');
      setQuantity('1');
      setDate(new Date().toISOString().split('T')[0]);
      fetchData();
    } catch (err) {
      setError('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleExpenditureSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        base_id: Number(baseId),
        equipment_id: Number(equipmentId),
        quantity: Number(quantity),
        expended_date: date
      };
      await createExpenditure(payload);
      setSuccess('Expenditure recorded successfully!');
      setQuantity('1');
      setDate(new Date().toISOString().split('T')[0]);
      fetchData();
    } catch (err) {
      setError('Error: ' + (err.response?.data?.detail || err.message));
    } finally {
      setLoading(false);
    }
  };

  const getEquipmentName = (id) => equipment.find(e => e.id === id)?.name || `Equipment ${id}`;
  const getBaseName = (id) => bases.find(b => b.id === id)?.name || `Base ${id}`;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Assignments & Expenditures</h1>
        <p className="text-gray-600 mb-8">Logged in as: {user.name} ({user.role})</p>

        {/* Base Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <label className="block text-sm font-medium mb-2">Select Base</label>
          <select
            value={baseId}
            onChange={(e) => {
              setBaseId(e.target.value);
              fetchData();
            }}
            className="w-full md:w-64 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          >
            {bases.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => { setActiveTab('assignments'); setError(''); setSuccess(''); }}
            className={`px-6 py-3 font-medium border-b-2 ${activeTab === 'assignments' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Assignments
          </button>
          <button
            onClick={() => { setActiveTab('expenditures'); setError(''); setSuccess(''); }}
            className={`px-6 py-3 font-medium border-b-2 ${activeTab === 'expenditures' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
          >
            Expenditures
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'assignments' ? 'New Assignment' : 'New Expenditure'}
            </h2>

            <form onSubmit={activeTab === 'assignments' ? handleAssignmentSubmit : handleExpenditureSubmit} className="space-y-6">
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

              {activeTab === 'assignments' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Personnel Name *</label>
                  <input
                    type="text"
                    value={personnelName}
                    onChange={(e) => setPersonnelName(e.target.value)}
                    placeholder="Enter personnel name"
                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

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
                <label className="block text-sm font-medium mb-2">
                  {activeTab === 'assignments' ? 'Assignment Date' : 'Expenditure Date'}
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
                {loading ? 'Recording...' : `Record ${activeTab === 'assignments' ? 'Assignment' : 'Expenditure'}`}
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">
              {activeTab === 'assignments' ? 'Assignment History' : 'Expenditure History'}
            </h2>

            {activeTab === 'assignments' ? (
              assignments.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {assignments.map((a) => (
                    <div key={a.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-medium text-blue-600">{getEquipmentName(a.equipment_id)}</span>
                          <p className="text-sm text-gray-600 mt-1">Assigned to: {a.personnel_name}</p>
                        </div>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-sm">
                          {a.quantity} units
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(a.assigned_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No assignments recorded</p>
              )
            ) : (
              expenditures.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {expenditures.map((e) => (
                    <div key={e.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-medium text-red-600">{getEquipmentName(e.equipment_id)}</span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold text-sm">
                          {e.quantity} units
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(e.expended_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No expenditures recorded</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
