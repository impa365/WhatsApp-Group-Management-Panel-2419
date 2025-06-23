import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGroups } from '../context/GroupContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUsers, FiMessageSquare, FiPlus, FiTrendingUp, FiActivity } = FiIcons;

const Dashboard = () => {
  const { groups, communities } = useGroups();

  const stats = [
    {
      title: 'Total Groups',
      value: groups.length,
      icon: FiUsers,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Participants',
      value: groups.reduce((sum, group) => sum + group.participants, 0),
      icon: FiActivity,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Communities',
      value: communities.length,
      icon: FiMessageSquare,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Active Groups',
      value: groups.filter(g => g.participants > 5).length,
      icon: FiTrendingUp,
      color: 'bg-orange-500',
      change: '+15%'
    }
  ];

  const recentGroups = groups.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex space-x-3">
          <Link
            to="/groups/create"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Create Group</span>
          </Link>
          <Link
            to="/communities/create"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <SafeIcon icon={FiPlus} className="w-4 h-4" />
            <span>Create Community</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <SafeIcon icon={stat.icon} className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Groups */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Groups</h2>
            <Link
              to="/groups"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {recentGroups.length > 0 ? (
            <div className="space-y-4">
              {recentGroups.map((group) => (
                <div key={group.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <SafeIcon icon={FiUsers} className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">{group.participants} participants</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      group.privacy === 'private' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {group.privacy}
                    </span>
                    <p className="text-sm text-gray-500 mt-1">{group.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <SafeIcon icon={FiUsers} className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No groups created yet</p>
              <Link
                to="/groups/create"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Create your first group
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;