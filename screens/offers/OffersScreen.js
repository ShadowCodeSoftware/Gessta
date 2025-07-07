import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import OfferCard from '../../components/OfferCard';
import { offersService } from '../../services/api';

const OffersScreen = ({ navigation }) => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [offers, searchTerm, selectedDomain, selectedDuration]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await offersService.getOffers();
      setOffers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des offres:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOffers();
    setRefreshing(false);
  };

  const filterOffers = () => {
    let filtered = offers;

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (offer) =>
          offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.company.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par domaine
    if (selectedDomain !== 'all') {
      filtered = filtered.filter((offer) => offer.domain === selectedDomain);
    }

    // Filtre par durée
    if (selectedDuration !== 'all') {
      filtered = filtered.filter((offer) =>
        offer.duration_months.toString().includes(selectedDuration)
      );
    }

    setFilteredOffers(filtered);
  };

  const renderOfferItem = ({ item }) => (
    <OfferCard
      offer={item}
      onPress={() => navigation.navigate('OfferDetail', { offerId: item.id })}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Offres de stage</Text>
        <Text style={styles.headerSubtitle}>
          {filteredOffers.length} offres disponibles
        </Text>
      </View>

      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher par titre ou entreprise..."
          value={searchTerm}
          onChangeText={setSearchTerm}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Icon name="filter-list" size={20} color="#16a34a" />
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Domaine</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDomain}
                  onValueChange={setSelectedDomain}
                  style={styles.picker}
                >
                  <Picker.Item label="Tous les domaines" value="all" />
                  <Picker.Item label="Informatique" value="Informatique" />
                  <Picker.Item label="Marketing" value="Marketing" />
                  <Picker.Item label="Finance" value="Finance" />
                  <Picker.Item label="Design" value="Design" />
                </Picker>
              </View>
            </View>

            <View style={styles.filterItem}>
              <Text style={styles.filterLabel}>Durée</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedDuration}
                  onValueChange={setSelectedDuration}
                  style={styles.picker}
                >
                  <Picker.Item label="Toutes durées" value="all" />
                  <Picker.Item label="3 mois" value="3" />
                  <Picker.Item label="4 mois" value="4" />
                  <Picker.Item label="6 mois" value="6" />
                </Picker>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="work-off" size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>Aucune offre trouvée</Text>
      <Text style={styles.emptyStateText}>
        Essayez de modifier vos critères de recherche
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredOffers}
        renderItem={renderOfferItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
  },
  filterButton: {
    padding: 5,
  },
  filtersContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 10,
    padding: 15,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterItem: {
    flex: 1,
    marginHorizontal: 5,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  picker: {
    height: 40,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
});

export default OffersScreen;