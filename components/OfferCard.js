import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OfferCard = ({ offer, onPress }) => {
  const getStatusBadge = (featured) => {
    if (featured) {
      return (
        <View style={styles.featuredBadge}>
          <Icon name="star" size={12} color="#fbbf24" />
          <Text style={styles.featuredText}>Recommandé</Text>
        </View>
      );
    }
    return null;
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Non spécifié';
    return `${salary.toLocaleString()} FCFA/mois`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Il y a 1 jour';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.ceil(diffDays / 7)} semaine${Math.ceil(diffDays / 7) > 1 ? 's' : ''}`;
    return `Il y a ${Math.ceil(diffDays / 30)} mois`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {getStatusBadge(offer.featured)}
          <Text style={styles.title} numberOfLines={2}>
            {offer.title}
          </Text>
          <View style={styles.companyInfo}>
            <Icon name="business" size={16} color="#6b7280" />
            <Text style={styles.companyName}>{offer.company?.name}</Text>
          </View>
        </View>
        <View style={styles.domainBadge}>
          <Text style={styles.domainText}>{offer.domain}</Text>
        </View>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {offer.description}
      </Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="location-on" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{offer.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="schedule" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{offer.duration_months} mois</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Icon name="access-time" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{formatDate(offer.created_at)}</Text>
          </View>
          <View style={styles.detailItem}>
            <Icon name="people" size={16} color="#6b7280" />
            <Text style={styles.detailText}>{offer.applications_count || 0} candidats</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.salary}>{formatSalary(offer.salary)}</Text>
        <View style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Voir détails</Text>
          <Icon name="arrow-forward" size={16} color="white" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
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
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredText: {
    fontSize: 12,
    color: '#d97706',
    fontWeight: '600',
    marginLeft: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 22,
  },
  companyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  domainBadge: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  domainText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  salary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
});

export default OfferCard;