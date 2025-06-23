import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext();

export const useGroups = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroups must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Family Group',
      description: 'Our lovely family group',
      participants: 12,
      privacy: 'private',
      admins: ['admin1', 'admin2'],
      createdAt: '2024-01-15',
      avatar: null,
      participantsList: [
        { id: 1, name: 'John Doe', phone: '+1234567890', role: 'admin', joinedAt: '2024-01-15' },
        { id: 2, name: 'Jane Smith', phone: '+1234567891', role: 'participant', joinedAt: '2024-01-16' },
        { id: 3, name: 'Bob Johnson', phone: '+1234567892', role: 'participant', joinedAt: '2024-01-17' },
      ]
    },
    {
      id: 2,
      name: 'Work Team',
      description: 'Project coordination and updates',
      participants: 8,
      privacy: 'public',
      admins: ['admin1'],
      createdAt: '2024-01-10',
      avatar: null,
      participantsList: [
        { id: 4, name: 'Alice Brown', phone: '+1234567893', role: 'admin', joinedAt: '2024-01-10' },
        { id: 5, name: 'Charlie Wilson', phone: '+1234567894', role: 'participant', joinedAt: '2024-01-11' },
      ]
    }
  ]);

  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: 'Tech Community',
      description: 'All things tech related',
      groups: [1, 2],
      createdAt: '2024-01-01',
      avatar: null
    }
  ]);

  const createGroup = (groupData) => {
    const newGroup = {
      id: Date.now(),
      ...groupData,
      participants: 1,
      admins: ['current_user'],
      createdAt: new Date().toISOString().split('T')[0],
      participantsList: [
        { id: Date.now(), name: 'You', phone: '+1234567890', role: 'admin', joinedAt: new Date().toISOString().split('T')[0] }
      ]
    };
    setGroups([...groups, newGroup]);
    return newGroup;
  };

  const deleteGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const updateGroup = (groupId, updates) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, ...updates } : group
    ));
  };

  const addParticipant = (groupId, participant) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        const newParticipant = {
          id: Date.now(),
          ...participant,
          role: 'participant',
          joinedAt: new Date().toISOString().split('T')[0]
        };
        return {
          ...group,
          participants: group.participants + 1,
          participantsList: [...group.participantsList, newParticipant]
        };
      }
      return group;
    }));
  };

  const removeParticipant = (groupId, participantId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          participants: group.participants - 1,
          participantsList: group.participantsList.filter(p => p.id !== participantId)
        };
      }
      return group;
    }));
  };

  const promoteParticipant = (groupId, participantId) => {
    setGroups(groups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          participantsList: group.participantsList.map(p => 
            p.id === participantId ? { ...p, role: 'admin' } : p
          )
        };
      }
      return group;
    }));
  };

  const createCommunity = (communityData) => {
    const newCommunity = {
      id: Date.now(),
      ...communityData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCommunities([...communities, newCommunity]);
    return newCommunity;
  };

  const deleteCommunity = (communityId) => {
    setCommunities(communities.filter(community => community.id !== communityId));
  };

  const updateCommunity = (communityId, updates) => {
    setCommunities(communities.map(community => 
      community.id === communityId ? { ...community, ...updates } : community
    ));
  };

  const value = {
    groups,
    communities,
    createGroup,
    deleteGroup,
    updateGroup,
    addParticipant,
    removeParticipant,
    promoteParticipant,
    createCommunity,
    deleteCommunity,
    updateCommunity
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};