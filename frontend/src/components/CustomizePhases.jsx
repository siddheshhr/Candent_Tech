import React, { useState } from 'react';
import { Edit, Plus, Trash2, X } from 'lucide-react';

const CustomizePhases = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [phases, setPhases] = useState([
    { id: 1, name: 'Customer', date: '2024-01-20', status: 'completed' },
    { id: 2, name: 'Shipping', date: '2024-01-25', status: 'completed' },
    { id: 3, name: 'Payment', date: '2024-02-01', status: 'in-progress' },
    { id: 4, name: 'Confirm', date: '', status: 'pending' },
    { id: 5, name: 'Success', date: '', status: 'pending' },
  ]);

  const [editingPhase, setEditingPhase] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPhase, setNewPhase] = useState({});

  const handleAddPhase = () => {
    if (!newPhase.name) return;

    const newId = Math.max(...phases.map((p) => p.id)) + 1;
    const phase = {
      id: newId,
      name: newPhase.name,
      date: '',
      status: 'pending',
    };

    setPhases([...phases, phase]);
    setShowAddModal(false);
    setNewPhase({});
  };

  const handleUpdatePhase = (phase) => {
    setPhases(phases.map((p) => (p.id === phase.id ? phase : p)));
    setEditingPhase(null);
  };

  const handleDeletePhase = (id) => {
    setPhases(phases.filter((p) => p.id !== id));
  };

  const getProgressWidth = () => {
    const completedCount = phases.filter((p) => p.status === 'completed').length;
    const inProgressCount = phases.filter((p) => p.status === 'in-progress').length;
    return `${((completedCount + inProgressCount * 0.5) / phases.length) * 100}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header Section */}
      <div className="bg-[#4B7889] p-4 rounded-t-lg flex justify-between items-center">
        <h2 className="text-white text-xl font-bold">Customize Phases</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-gray-50 flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-400"
        >
          <Edit size={16} />
          <span>{isEditing ? 'Done' : 'Edit'}</span>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="bg-gray-50 p-6 rounded-b-lg">
        <div className="relative">
          <div className="absolute top-4 left-0 w-full">
            <div className="h-1 bg-gray-200 rounded">
              <div
                className="h-full bg-green-500 rounded transition-all duration-300"
                style={{ width: getProgressWidth() }}
              />
            </div>
          </div>

          <div className="flex justify-between mb-2 relative">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="flex flex-col items-center text-center w-1/5"
              >
                {isEditing ? (
                  <div className="relative">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 cursor-pointer ${
                        phase.status === 'completed'
                          ? 'bg-green-500 text-white'
                          : phase.status === 'in-progress'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200'
                      }`}
                      onClick={() => setEditingPhase(phase)}
                    >
                      {phase.id}
                    </div>
                    <button
                      onClick={() => handleDeletePhase(phase.id)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 ${
                      phase.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : phase.status === 'in-progress'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}
                  >
                    {phase.id}
                  </div>
                )}
                <span className="text-sm font-medium">{phase.name}</span>
                <span className="text-xs text-gray-500 mt-1">
                  {phase.date || '-'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isEditing && (
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={16} />
            <span>Add Phase</span>
          </button>
        )}
      </div>

      {/* Edit Phase Modal */}
      {editingPhase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Edit Phase</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingPhase.name}
                  onChange={(e) =>
                    setEditingPhase({ ...editingPhase, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={editingPhase.date}
                  onChange={(e) =>
                    setEditingPhase({ ...editingPhase, date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingPhase.status}
                  onChange={(e) =>
                    setEditingPhase({ ...editingPhase, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingPhase(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdatePhase(editingPhase)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Phase Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add New Phase</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={newPhase.name || ''}
                  onChange={(e) =>
                    setNewPhase({ ...newPhase, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPhase}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add Phase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizePhases;
