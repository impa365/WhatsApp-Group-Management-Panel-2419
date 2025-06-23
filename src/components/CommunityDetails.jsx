import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGroups } from '../context/GroupContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiEdit3, FiMessageSquare, FiUsers, FiX, FiPlus, FiMinus } = FiIcons;

const CommunityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { communities, groups, updateCommunity } = useGroups();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManageGroupsModal, setShowManageGroupsModal] = useState(false);
  const [editData, setEditData] = useState({});

  const community = communities.find(c => c.id === parseInt(id));

  if (!community) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Community not found</p>
        <button
          onClick={() => navigate('/communities')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          Back to Communities
        </button>
      </div>
    );
  }

  const communityGroups = groups.filter(group => community.groups.includes(group.id));
  const availableGroups = groups.filter(group => !community.groups.includes(group.id));

  const handleEditCommunity = () => {
    updateCommunity(community.id, editData);
    setShowEditModal(false);
  };

  const openEditModal = () => {
    setEditData({
      name: community.name,
      description: community.description || ''
    });
    setShowEditModal(true);
  };

  const handleAddGroup = (groupId) => {
    const updatedGroups = [...community.groups, groupId];
    updateCommunity(community.id, { groups: updatedGroups });
  };

  const handleRemoveGroup = (groupId) => {
    const updatedGroups = community.groups.filter(id => id !== groupId);
    updateCommunity(community.id, { groups: updatedGroups });
  };

  const totalParticipants = communityGroups.reduce((sum, group) => sum + group.participants, 0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => navigate('/communities')}
          className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Community Details</h1>
      </div>

      {/* Community Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
      >
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiMessageSquare} className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{community.name}</h2>
                <p className="text-gray-600 mt-1">{community.description || 'No description'}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-sm text-gray-500">{community.groups.length} groups</span>
                  <span className="text-sm text-gray-500">{totalParticipants} total participants</span>
                  <span className="text-sm text-gray-500">Created {community.createdAt}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowManageGroupsModal(true)}
                className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                Manage Groups
              </button>
              <button
                onClick={openEditModal}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <SafeIcon icon={FiEdit3} className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Groups in Community */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Groups in Community</h3>
        </div>
        <div className="p-6">
          {communityGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {communityGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUsers} className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{group.name}</p>
                      <p className="text-sm text-gray-500">
                        {group.participants} participants • {group.privacy}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => navigate(`/groups/${group.id}`)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemoveGroup(group.id)}
                      className="text-red-600 hover:text-red-700 p-1"
                      title="Remove from community"
                    >
                      <SafeIcon icon={FiMinus} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No groups in this community yet</p>
              <button
                onClick={() => setShowManageGroupsModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Groups
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Community Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Community</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                <input
                  type="text"
                  value={editData.name || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editData.description || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCommunity}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Groups Modal */}
      {showManageGroupsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Groups</h3>
              <button
                onClick={() => setShowManageGroupsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6 overflow-y-auto max-h-[60vh]">
              {/* Current Groups */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Current Groups ({communityGroups.length})</h4>
                {communityGroups.length > 0 ? (
                  <div className="space-y-2">
                    {communityGroups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiUsers} className="w-4 h-4 text-green-600" />
                          <span className="text-gray-900">{group.name}</span>
                          <span className="text-sm text-gray-500">({group.participants})</span>
                        </div>
                        <button
                          onClick={() => handleRemoveGroup(group.id)}
                          className="text-red-600 hover:text-red-700 p-1"
                        >
                          <SafeIcon icon={FiMinus} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No groups in community</p>
                )}
              </div>

              {/* Available Groups */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Available Groups ({availableGroups.length})</h4>
                {availableGroups.length > 0 ? (
                  <div className="space-y-2">
                    {availableGroups.map((group) => (
                      <div key={group.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <SafeIcon icon={FiUsers} className="w-4 h-4 text-gray-600" />
                          <span className="text-gray-900">{group.name}</span>
                          <span className="text-sm text-gray-500">({group.participants})</span>
                        </div>
                        <button
                          onClick={() => handleAddGroup(group.id)}
                          className="text-blue-600 hover:text-blue-700 p-1"
                        >
                          <SafeIcon icon={FiPlus} className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">All groups are already in this community</p>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowManageGroupsModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityDetails;