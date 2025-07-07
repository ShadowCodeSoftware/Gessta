import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchApplications, 
  deleteApplication,
  selectApplications, 
  selectApplicationsLoading,
  selectApplicationsStats 
} from '../../store/slices/applicationsSlice';
import ApplicationCard from '../../components/ApplicationCard';
import ApplicationFilters from '../../components/ApplicationFilters';

const ApplicationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const loading = useSelector(selectApplicationsLoading);
  const stats = useSelector(selectApplicationsStats);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(fetchApplications());
    setRefreshing(false);
  };

  const handleDeleteApplication = (applicationId) => {
    Alert.alert(
      'Supprimer la candidature',
      'Êtes-vous sûr de vouloir supprimer cette candidature ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => dispatch(deleteApplication(applicationId)),
        },
      ]
    );
  };

  const handleEditApplication = (application) => {
    navigation.navigate('EditApplication', { application });
  };

  const handleViewApplication = (application) => {
    navigation.navigate('ApplicationDetail', { applicationId: application.id });
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const getFilterCount = (status) => {
    if (status === 'all') return stats.total;
    return stats[status] || 0;
  };

  const renderApplicationItem = ({ item }) => (
    <ApplicationCard
      application={item}
      onPress={() => handleViewApplication(item)}
      onEdit={() => handleEditApplication(item)}
      onDelete={() => handleDeleteApplication(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Mes candidatures</Text>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={24} color="#16a34a" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.headerSubtitle}>
        {filteredApplications.length} candidature{filteredApplications.length !== 1 ? 's' : ''}
      </Text>

      {/* Stats rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats.pending}</Text>
          <Text style={styles.statLabel}>En attente</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#10b981' }]}>{stats.accepted}</Text>
          <Text style={styles.statLabel}>Acceptées</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: '#ef4444' }]}>{stats.rejected}</Text>
          <Text style={styles.statLabel}>Refusées</Text>
        </View>
      </View>
      
      {/* Filtres */}
      {showFilters && (
        <ApplicationFilters
          currentFilter={filter}
          onFilterChange={setFilter}
          getFilterCount={getFilterCount}
        />
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="assignment" size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>
        {filter === 'all' ? 'Aucune candidature' : `Aucune candidature ${getStatusText(filter)}`}
      </Text>
      <Text style={styles.emptyStateText}>
        {filter === 'all' 
          ? 'Commencez par postuler à des offres de stage'
          : 'Aucune candidature dans cette catégorie'
        }
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => navigation.navigate('Offers')}
        >
          <Icon name="search" size={20} color="white" />
          <Text style={styles.emptyStateButtonText}>Rechercher des stages</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'en attente';
      case 'accepted': return 'acceptées';
      case 'rejected': return 'refusées';
      default: return status;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredApplications}
        renderItem={renderApplicationItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton flottant pour nouvelle candidature */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Offers')}
      >
        <Icon name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'en attente';
    case 'accepted': return 'acceptées';
    case 'rejected': return 'refusées';
    default: return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    paddingBottom: 80,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  filterToggle: {
    padding: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});

export default ApplicationsScreen;