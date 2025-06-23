import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGroups } from '../context/GroupContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiMessageSquare, FiUsers, FiTrash2 } = FiIcons;

const Communities = () => {
  const { communities, groups, deleteCommunity } = useGroups();
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  const handleDeleteCommunity = (communityId) => {
    deleteCommunity(communityId);
    setShowDeleteModal(null);
  };

  const getCommunityGroups = (communityGroupIds) => {
    return groups.filter(group => communityGroupIds.includes(group.id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Communities</h1>
        <Link
          to="/communities/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>Create Community</span>
        </Link>
      </div>

      {communities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((community, index) => {
            const communityGroups = getCommunityGroups(community.groups);
            return (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <SafeIcon icon={FiMessageSquare} className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{community.name}</h3>
                        <p className="text-sm text-gray-500">{community.groups.length} groups</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {community.description || 'No description available'}
                  </p>

                  {/* Groups in Community */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Groups:</h4>
                    {communityGroups.length > 0 ? (
                      <div className="space-y-1">
                        {communityGroups.slice(0, 3).map((group) => (
                          <div key={group.id} className="flex items-center space-x-2 text-sm">
                            <SafeIcon icon={FiUsers} className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-600">{group.name}</span>
                            <span className="text-gray-400">({group.participants})</span>
                          </div>
                        ))}
                        {communityGroups.length > 3 && (
                          <p className="text-xs text-gray-500">+{communityGroups.length - 3} more groups</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No groups added yet</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Created {community.createdAt}</span>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/communities/${community.id}`}
                      className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Manage
                    </Link>
                    <button
                      onClick={() => setShowDeleteModal(community.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <SafeIcon icon={FiMessageSquare} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No communities yet</h3>
          <p className="text-gray-500 mb-6">
            Create your first community to organize your groups
          </p>
          <Link
            to="/communities/create"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Create Community</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Community</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this community? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteCommunity(showDeleteModal)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communities;