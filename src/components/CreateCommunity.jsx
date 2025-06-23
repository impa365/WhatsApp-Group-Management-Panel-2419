import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGroups } from '../context/GroupContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiMessageSquare, FiCheck } = FiIcons;

const CreateCommunity = () => {
  const navigate = useNavigate();
  const { groups, createCommunity } = useGroups();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    groups: []
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGroupToggle = (groupId) => {
    setFormData(prev => ({
      ...prev,
      groups: prev.groups.includes(groupId)
        ? prev.groups.filter(id => id !== groupId)
        : [...prev.groups, groupId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Community name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Community name must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (formData.groups.length === 0) {
      newErrors.groups = 'Select at least one group for the community';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const newCommunity = createCommunity(formData);
    navigate(`/communities/${newCommunity.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/communities')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Community</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Community Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Community Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter community name"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter community description (optional)"
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Select Groups */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Groups *
            </label>
            {groups.length > 0 ? (
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.groups.includes(group.id)}
                      onChange={() => handleGroupToggle(group.id)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <div className="ml-3 flex items-center space-x-3 flex-1">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiMessageSquare} className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{group.name}</p>
                        <p className="text-sm text-gray-500">
                          {group.participants} participants • {group.privacy}
                        </p>
                      </div>
                    </div>
                    {formData.groups.includes(group.id) && (
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-blue-600" />
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 border border-gray-200 rounded-lg">
                <SafeIcon icon={FiMessageSquare} className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-2">No groups available</p>
                <p className="text-sm text-gray-400">Create some groups first to add them to a community</p>
              </div>
            )}
            {errors.groups && (
              <p className="mt-1 text-sm text-red-600">{errors.groups}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/communities')}
              className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Create Community
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateCommunity;