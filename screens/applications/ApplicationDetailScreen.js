import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  updateApplicationStatus,
  deleteApplication,
  selectApplications 
} from '../../store/slices/applicationsSlice';

const ApplicationDetailScreen = ({ route, navigation }) => {
  const { applicationId } = route.params;
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const app = applications.find(a => a.id === applicationId);
    setApplication(app);
  }, [applicationId, applications]);

  useEffect(() => {
    navigation.setOptions({
      title: 'Détails de la candidature',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleMoreOptions}
        >
          <Icon name="more-vert" size={24} color="#16a34a" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const handleMoreOptions = () => {
    Alert.alert(
      'Options',
      'Que souhaitez-vous faire ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Modifier', 
          onPress: () => navigation.navigate('EditApplication', { application })
        },
        { 
          text: 'Retirer candidature', 
          onPress: () => handleWithdrawApplication()
        },
        { 
          text: 'Supprimer', 
          style: 'destructive', 
          onPress: () => handleDeleteApplication()
        },
      ]
    );
  };

  const handleWithdrawApplication = () => {
    Alert.alert(
      'Retirer la candidature',
      'Êtes-vous sûr de vouloir retirer cette candidature ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            dispatch(updateApplicationStatus({ 
              id: application.id, 
              status: 'withdrawn' 
            }));
          },
        },
      ]
    );
  };

  const handleDeleteApplication = () => {
    Alert.alert(
      'Supprimer la candidature',
      'Cette action est irréversible. Êtes-vous sûr ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            dispatch(deleteApplication(application.id));
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleOpenCV = () => {
    if (application.cv_path) {
      Linking.openURL(application.cv_path);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'accepted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'withdrawn': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'rejected': return 'Refusée';
      case 'withdrawn': return 'Retirée';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!application) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* En-tête avec statut */}
      <View style={styles.header}>
        <Text style={styles.position}>{application.position}</Text>
        <Text style={styles.company}>{application.company}</Text>
        <View style={[
          styles.statusBadge, 
          { backgroundColor: `${getStatusColor(application.status)}20` }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(application.status) }]}>
            {getStatusText(application.status)}
          </Text>
        </View>
      </View>

      {/* Informations de candidature */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations de candidature</Text>
        
        <View style={styles.infoItem}>
          <Icon name="event" size={20} color="#6b7280" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Date de candidature</Text>
            <Text style={styles.infoValue}>
              {formatDate(application.applied_at || application.date)}
            </Text>
          </View>
        </View>

        {application.reviewed_at && (
          <View style={styles.infoItem}>
            <Icon name="visibility" size={20} color="#6b7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date d'examen</Text>
              <Text style={styles.infoValue}>
                {formatDate(application.reviewed_at)}
              </Text>
            </View>
          </View>
        )}

        {application.cv_path && (
          <TouchableOpacity style={styles.infoItem} onPress={handleOpenCV}>
            <Icon name="description" size={20} color="#3b82f6" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>CV joint</Text>
              <Text style={[styles.infoValue, { color: '#3b82f6' }]}>
                Ouvrir le CV
              </Text>
            </View>
            <Icon name="open-in-new" size={16} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      {/* Lettre de motivation */}
      {application.cover_letter && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lettre de motivation</Text>
          <View style={styles.coverLetterContainer}>
            <Text style={styles.coverLetterText}>
              {application.cover_letter}
            </Text>
          </View>
        </View>
      )}

      {/* Notes de l'employeur */}
      {application.notes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes de l'employeur</Text>
          <View style={styles.notesContainer}>
            <Text style={styles.notesText}>
              {application.notes}
            </Text>
          </View>
        </View>
      )}

      {/* Actions */}
      <View style={styles.actionsSection}>
        {application.status === 'pending' && (
          <>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => navigation.navigate('EditApplication', { application })}
            >
              <Icon name="edit" size={20} color="white" />
              <Text style={styles.actionButtonText}>Modifier la candidature</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={handleWithdrawApplication}
            >
              <Icon name="remove-circle" size={20} color="white" />
              <Text style={styles.actionButtonText}>Retirer la candidature</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={handleDeleteApplication}
        >
          <Icon name="delete" size={20} color="white" />
          <Text style={styles.actionButtonText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  position: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 12,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  coverLetterContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  coverLetterText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
  },
  notesContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  notesText: {
    fontSize: 14,
    color: '#92400e',
    lineHeight: 22,
  },
  actionsSection: {
    padding: 20,
    paddingBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  withdrawButton: {
    backgroundColor: '#f59e0b',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ApplicationDetailScreen;