import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';
import StatsCard from '../../components/StatsCard';
import QuickActionCard from '../../components/QuickActionCard';
import RecentApplicationCard from '../../components/RecentApplicationCard';

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    applications: 5,
    activeInternships: 1,
    reports: 2,
    notifications: 3,
  });

  const [recentApplications, setRecentApplications] = useState([
    {
      id: 1,
      company: 'TechCorp Cameroun',
      position: 'Développeur Web',
      status: 'pending',
      date: '2024-01-15',
    },
    {
      id: 2,
      company: 'Digital Solutions',
      position: 'Analyste Data',
      status: 'accepted',
      date: '2024-01-10',
    },
    {
      id: 3,
      company: 'Innovation Hub',
      position: 'Designer UX',
      status: 'rejected',
      date: '2024-01-05',
    },
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler le rechargement des données
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const quickActions = [
    {
      title: 'Rechercher stages',
      icon: 'search',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Offers'),
    },
    {
      title: 'Journal de bord',
      icon: 'book',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('Journal'),
    },
    {
      title: 'Mes candidatures',
      icon: 'assignment',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Applications'),
    },
    {
      title: 'Mon profil',
      icon: 'person',
      color: '#10b981',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoContainer}>
            <Icon name="school" size={24} color="white" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Tableau de bord</Text>
            <Text style={styles.headerSubtitle}>Université d'Ebolowa</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications" size={24} color="#666" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton}>
            <Icon name="account-circle" size={32} color="#16a34a" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Message */}
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>
          Bonjour, {user?.name || 'Étudiant'} 👋
        </Text>
        <Text style={styles.welcomeSubtext}>
          Voici un aperçu de vos activités de stage
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <StatsCard
            title="Candidatures"
            value={stats.applications}
            icon="assignment"
            color="#3b82f6"
          />
          <StatsCard
            title="Stages actifs"
            value={stats.activeInternships}
            icon="work"
            color="#16a34a"
          />
        </View>
        <View style={styles.statsRow}>
          <StatsCard
            title="Rapports"
            value={stats.reports}
            icon="description"
            color="#8b5cf6"
          />
          <StatsCard
            title="Notifications"
            value={stats.notifications}
            icon="notifications"
            color="#f59e0b"
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Actions rapides</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </View>
      </View>

      {/* Recent Applications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Candidatures récentes</Text>
        <Text style={styles.sectionSubtitle}>
          Suivi de vos dernières candidatures
        </Text>
        <View style={styles.applicationsContainer}>
          {recentApplications.map((application) => (
            <RecentApplicationCard
              key={application.id}
              application={application}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#16a34a',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  avatarButton: {
    // Styles pour l'avatar
  },
  welcomeContainer: {
    padding: 20,
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  statsContainer: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  applicationsContainer: {
    // Styles pour le conteneur des candidatures
  },
});

export default DashboardScreen;