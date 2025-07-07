import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ApplicationFilters = ({ currentFilter, onFilterChange, getFilterCount }) => {
  const filters = [
    { key: 'all', label: 'Toutes', color: '#6b7280' },
    { key: 'pending', label: 'En attente', color: '#f59e0b' },
    { key: 'accepted', label: 'Acceptées', color: '#10b981' },
    { key: 'rejected', label: 'Refusées', color: '#ef4444' },
    { key: 'withdrawn', label: 'Retirées', color: '#6b7280' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrer par statut</Text>
      <View style={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              currentFilter === filter.key && styles.filterButtonActive,
              currentFilter === filter.key && { borderColor: filter.color },
            ]}
            onPress={() => onFilterChange(filter.key)}
          >
            <Text style={[
              styles.filterButtonText,
              currentFilter === filter.key && styles.filterButtonTextActive,
              currentFilter === filter.key && { color: filter.color },
            ]}>
              {filter.label} ({getFilterCount(filter.key)})
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  filtersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: 'white',
    borderWidth: 2,
  },
  filterButtonText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    fontWeight: '600',
  },
});

export default ApplicationFilters;