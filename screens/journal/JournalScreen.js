import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JournalEntryCard from '../../components/JournalEntryCard';
import AddEntryModal from '../../components/AddEntryModal';
import { journalService } from '../../services/api';

const JournalScreen = ({ navigation }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);

  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      setLoading(true);
      const response = await journalService.getEntries();
      setEntries(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des entrées:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadEntries();
    setRefreshing(false);
  };

  const handleAddEntry = async (entryData) => {
    try {
      const response = await journalService.createEntry(entryData);
      setEntries([response.data, ...entries]);
      setShowAddModal(false);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter l\'entrée');
    }
  };

  const handleEditEntry = async (id, entryData) => {
    try {
      const response = await journalService.updateEntry(id, entryData);
      setEntries(entries.map(entry => 
        entry.id === id ? response.data : entry
      ));
      setEditingEntry(null);
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de modifier l\'entrée');
    }
  };

  const handleDeleteEntry = (id) => {
    Alert.alert(
      'Supprimer l\'entrée',
      'Êtes-vous sûr de vouloir supprimer cette entrée ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await journalService.deleteEntry(id);
              setEntries(entries.filter(entry => entry.id !== id));
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer l\'entrée');
            }
          },
        },
      ]
    );
  };

  const renderEntryItem = ({ item }) => (
    <JournalEntryCard
      entry={item}
      onEdit={() => setEditingEntry(item)}
      onDelete={() => handleDeleteEntry(item.id)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>Journal de bord</Text>
        <Text style={styles.headerSubtitle}>
          {entries.length} entrée{entries.length !== 1 ? 's' : ''}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setShowAddModal(true)}
      >
        <Icon name="add" size={20} color="white" />
        <Text style={styles.addButtonText}>Ajouter une entrée</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Icon name="book" size={64} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>Aucune entrée</Text>
      <Text style={styles.emptyStateText}>
        Commencez à documenter votre expérience de stage
      </Text>
      <TouchableOpacity
        style={styles.emptyStateButton}
        onPress={() => setShowAddModal(true)}
      >
        <Icon name="add" size={20} color="white" />
        <Text style={styles.emptyStateButtonText}>Première entrée</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderEntryItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={!loading ? renderEmptyState : null}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      <AddEntryModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddEntry}
        editingEntry={editingEntry}
        onEditSubmit={handleEditEntry}
        onEditClose={() => setEditingEntry(null)}
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
});

export default JournalScreen;