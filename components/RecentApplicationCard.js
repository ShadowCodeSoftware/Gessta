import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RecentApplicationCard = ({ application }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'accepted':
        return 'Acceptée';
      case 'rejected':
        return 'Refusée';
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'accepted':
        return 'check-circle';
      case 'rejected':
        return 'cancel';
      default:
        return 'help';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.position} numberOfLines={1}>
            {application.position}
          </Text>
          <Text style={styles.company} numberOfLines={1}>
            {application.company}
          </Text>
          <Text style={styles.date}>{application.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(application.status)}20` }]}>
          <Icon 
            name={getStatusIcon(application.status)} 
            size={16} 
            color={getStatusColor(application.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
            {getStatusText(application.status)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  position: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  company: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default RecentApplicationCard;