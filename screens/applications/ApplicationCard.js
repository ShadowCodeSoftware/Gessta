import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ApplicationCard = ({ application, onPress, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'withdrawn':
        return '#6b7280';
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
      case 'withdrawn':
        return 'Retirée';
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
      case 'withdrawn':
        return 'remove-circle';
      default:
        return 'help';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Options',
      'Que souhaitez-vous faire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Voir détails', onPress: onPress },
        { text: 'Modifier', onPress: onEdit },
        { text: 'Supprimer', style: 'destructive', onPress: onDelete },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.position} numberOfLines={1}>
            {application.position || application.offer?.title}
          </Text>
          <View style={styles.companyInfo}>
            <Icon name="business" size={16} color="#6b7280" />
            <Text style={styles.company} numberOfLines={1}>
              {application.company || application.offer?.company?.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleMoreOptions} style={styles.moreButton}>
          <Icon name="more-vert" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.statusContainer}>
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

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Icon name="event" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Postulé le {formatDate(application.applied_at || application.date)}
            </Text>
          </View>
          
          {application.reviewed_at && (
            <View style={styles.detailItem}>
              <Icon name="visibility" size={16} color="#6b7280" />
              <Text style={styles.detailText}>
                Examiné le {formatDate(application.reviewed_at)}
              </Text>
            </View>
          )}

          {application.offer?.location && (
            <View style={styles.detailItem}>
              <Icon name="location-on" size={16} color="#6b7280" />
              <Text style={styles.detailText}>{application.offer.location}</Text>
            </View>
          )}
        </View>

        {application.cover_letter && (
          <Text style={styles.coverLetterPreview} numberOfLines={2}>
            {application.cover_letter}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={onPress}>
            <Icon name="visibility" size={18} color="#3b82f6" />
            <Text style={[styles.actionText, { color: '#3b82f6' }]}>Voir</Text>
          </TouchableOpacity>
          
          {application.status === 'pending' && (
            <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
              <Icon name="edit" size={18} color="#f59e0b" />
              <Text style={[styles.actionText, { color: '#f59e0b' }]}>Modifier</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <Icon name="delete" size={18} color="#ef4444" />
            <Text style={[styles.actionText, { color: '#ef4444' }]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  company: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  moreButton: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statusContainer: {
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  details: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  coverLetterPreview: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#f9fafb',
    padding: 8,
    borderRadius: 6,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    padding: 16,
    paddingTop: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});

export default ApplicationCard;