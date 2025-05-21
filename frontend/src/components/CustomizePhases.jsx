
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

// CustomizePhases component to manage phases for a lead
const CustomizePhases = ({ leadId, phases: initialPhases, setLead }) => {
  // State for edit mode, currently edited phase, new phase form, invalid phases, and local phases
  const [isEditing, setIsEditing] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [newPhase, setNewPhase] = useState({ name: '', date: '', status: 'Not Started' });
  const [invalidPhases, setInvalidPhases] = useState(new Set());
  const [phases, setPhases] = useState(initialPhases);

  // Fetch lead data on mount to ensure phases are up-to-date with the backend
  useEffect(() => {
    const fetchLeadData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/leads/${leadId}`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setLead(res.data.data);
          setPhases(res.data.data.phases || []);
          setInvalidPhases(new Set());
        } else {
          toast.error('Failed to fetch lead data');
        }
      } catch (err) {
        console.error('Error fetching lead data:', err);
        toast.error('Error fetching lead data');
      }
    };

    if (leadId) {
      fetchLeadData();
    }
  }, [leadId, setLead]);

  // Function to refetch lead data when needed (e.g., after a 404 error)
  const refetchLead = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/leads/${leadId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead(res.data.data);
        setPhases(res.data.data.phases || []);
        return res.data.data;
      } else {
        toast.error('Failed to refresh lead data');
        return null;
      }
    } catch (err) {
      console.error('Error refetching lead:', err);
      toast.error('Error refreshing lead data');
      return null;
    }
  };

  // Handle updating an existing phase
  const handleUpdatePhase = async (phase) => {
    if (!phase._id || !leadId) {
      toast.error('Invalid lead or phase ID');
      setEditingPhase(null);
      return;
    }

    console.log('Updating phase with ID:', phase._id); // Debug log

    try {
      const res = await axios.put(
        `http://localhost:3000/api/leads/${leadId}/phases/${phase._id}`,
        { name: phase.name, date: phase.date, status: phase.status },
        { withCredentials: true }
      );
      if (res.data.success) {
        console.log('Updated phase from backend:', res.data.data); // Debug log
        // Update both parent and local state with the backend's response
        setLead((prev) => ({
          ...prev,
          phases: prev.phases.map((p) =>
            p._id === phase._id ? res.data.data : p
          ),
        }));
        setPhases((prev) =>
          prev.map((p) =>
            p._id === phase._id ? res.data.data : p
          )
        );
        setEditingPhase(null);
        setInvalidPhases((prev) => {
          const newSet = new Set(prev);
          newSet.delete(phase._id);
          return newSet;
        });
        toast.success('Phase updated successfully');
      }
    } catch (err) {
      console.error('Update Phase Error:', err);
      if (err.response?.status === 404) {
        toast.error('Phase or lead not found. Refreshing data...');
        const updatedLead = await refetchLead();
        if (updatedLead) {
          const phaseExists = updatedLead.phases.some((p) => p._id === phase._id);
          if (!phaseExists) {
            toast.error('This phase no longer exists and cannot be edited.');
            setInvalidPhases((prev) => new Set(prev).add(phase._id));
            setPhases((prev) => prev.filter((p) => p._id !== phase._id));
          }
        }
      } else {
        toast.error('Failed to update phase: ' + (err.response?.data?.message || 'Unknown error'));
      }
      setEditingPhase(null);
    }
  };

  // Handle adding a new phase
  const handleAddPhase = async () => {
    if (!newPhase.name || !newPhase.date) {
      toast.error('Name and date are required');
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:3000/api/leads/${leadId}/phases`,
        { name: newPhase.name, date: newPhase.date, status: newPhase.status },
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead((prev) => ({
          ...prev,
          phases: [...prev.phases, res.data.data],
        }));
        setPhases((prev) => [...prev, res.data.data]);
        setNewPhase({ name: '', date: '', status: 'Not Started' });
        setEditingPhase(null);
        toast.success('Phase added successfully');
      }
    } catch (err) {
      console.error('Add Phase Error:', err);
      if (err.response?.status === 404) {
        toast.error('Lead not found. Refreshing data...');
        await refetchLead();
      } else {
        toast.error('Failed to add phase: ' + (err.response?.data?.message || 'Unknown error'));
      }
      setEditingPhase(null);
    }
  };

  // Handle deleting a phase
  const handleDeletePhase = async (phaseId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/leads/${leadId}/phases/${phaseId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setLead((prev) => ({
          ...prev,
          phases: prev.phases.filter((p) => p._id !== phaseId),
        }));
        setPhases((prev) => prev.filter((p) => p._id !== phaseId));
        setInvalidPhases((prev) => {
          const newSet = new Set(prev);
          newSet.delete(phaseId);
          return newSet;
        });
        toast.success('Phase deleted successfully');
      }
    } catch (err) {
      console.error('Delete Phase Error:', err);
      if (err.response?.status === 404) {
        toast.error('Phase or lead not found. Refreshing data...');
        const updatedLead = await refetchLead();
        if (updatedLead) {
          const phaseExists = updatedLead.phases.some((p) => p._id === phaseId);
          if (!phaseExists) {
            setInvalidPhases((prev) => new Set(prev).add(phaseId));
            setPhases((prev) => prev.filter((p) => p._id !== phaseId));
          }
        }
      } else {
        toast.error('Failed to delete phase: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  // Calculate the progress bar width based on phase statuses
  const getProgressWidth = () => {
    const completedCount = phases.filter((p) => p.status === 'Completed').length;
    const inProgressCount = phases.filter((p) => p.status === 'In Progress').length;
    return `${((completedCount + inProgressCount * 0.5) / phases.length) * 100}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-4">
      {/* Header with title and edit/add buttons */}
      <div className="bg-[#4B7889] p-3 flex justify-between items-center rounded-t-lg">
        <h2 className="text-white font-semibold">Customize Phases</h2>
        <div className="flex space-x-2">
          {isEditing && (
            <button
              onClick={() => {
                setEditingPhase({ name: '', date: '', status: 'Not Started' });
              }}
              className="bg-white rounded-full w-6 h-6 flex items-center justify-center text-[#4B7889]"
            >
              <Plus size={16} />
            </button>
          )}
          <button
            onClick={() => setIsEditing((prev) => !prev)}
            className="bg-white text-black px-3 py-1 rounded text-sm"
          >
            {isEditing ? 'Done' : 'Edit'}
          </button>
        </div>
      </div>
      {/* Phases display with progress bar */}
      <div className="p-4 bg-gray-50">
        <div className="relative pt-8">
          <div className="absolute top-4 left-0 w-full">
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: phases.length > 0 ? getProgressWidth() : '0%' }}
              />
            </div>
          </div>
          <div className="flex justify-between relative">
            {phases.length > 0 ? (
              phases.map((phase, idx) => (
                <div key={phase._id} className="flex flex-col items-center text-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 relative z-10 ${
                      invalidPhases.has(phase._id)
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'cursor-pointer ' +
                          (phase.status === 'Completed'
                            ? 'bg-green-500 text-white'
                            : phase.status === 'In Progress'
                            ? 'bg-blue-500 text-white'
                            : phase.status === 'Stopped'
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-200')
                    }`}
                    onClick={() => {
                      if (isEditing && !invalidPhases.has(phase._id)) {
                        setEditingPhase({ ...phase });
                      }
                    }}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-xs font-medium">{phase.name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(phase.date).toLocaleDateString()}
                  </span>
                  {isEditing && !invalidPhases.has(phase._id) && (
                    <button
                      onClick={() => handleDeletePhase(phase._id)}
                      className="mt-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">No phases yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modal for adding/editing a phase */}
      {editingPhase && isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">
              {editingPhase._id ? 'Edit Phase' : 'Add Phase'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingPhase._id ? editingPhase.name : newPhase.name}
                  onChange={(e) =>
                    editingPhase._id
                      ? setEditingPhase({ ...editingPhase, name: e.target.value })
                      : setNewPhase({ ...newPhase, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={
                    editingPhase._id
                      ? editingPhase.date?.split('T')[0] || ''
                      : newPhase.date
                  }
                  onChange={(e) =>
                    editingPhase._id
                      ? setEditingPhase({ ...editingPhase, date: e.target.value })
                      : setNewPhase({ ...newPhase, date: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingPhase._id ? editingPhase.status : newPhase.status}
                  onChange={(e) =>
                    editingPhase._id
                      ? setEditingPhase({ ...editingPhase, status: e.target.value })
                      : setNewPhase({ ...newPhase, status: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Stopped">Stopped</option>
                  <option value="Not Started">Not Started</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setEditingPhase(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (editingPhase._id) {
                    handleUpdatePhase(editingPhase);
                  } else {
                    handleAddPhase();
                  }
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizePhases;