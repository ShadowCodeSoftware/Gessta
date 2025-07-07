import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import DashboardScreen from './screens/dashboard/DashboardScreen';
import OffersScreen from './screens/offers/OffersScreen';
import OfferDetailScreen from './screens/offers/OfferDetailScreen';
import ApplicationsScreen from './screens/applications/ApplicationsScreen';
import ApplicationDetailScreen from './screens/applications/ApplicationDetailScreen';
import EditApplicationScreen from './screens/applications/EditApplicationScreen';
import JournalScreen from './screens/journal/JournalScreen';
import ProfileScreen from './screens/profile/ProfileScreen';

// Icons
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = 'dashboard';
              break;
            case 'Offers':
              iconName = 'work';
              break;
            case 'Applications':
              iconName = 'assignment';
              break;
            case 'Journal':
              iconName = 'book';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help';
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Offers" 
        component={OffersScreen}
        options={{ tabBarLabel: 'Offres' }}
      />
      <Tab.Screen 
        name="Applications" 
        component={ApplicationsScreen}
        options={{ tabBarLabel: 'Candidatures' }}
      />
      <Tab.Screen 
        name="Journal" 
        component={JournalScreen}
        options={{ tabBarLabel: 'Journal' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profil' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NotificationProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="Main" component={TabNavigator} />
              <Stack.Screen 
                name="OfferDetail" 
                component={OfferDetailScreen}
                options={{ 
                  headerShown: true, 
                  title: 'Détails de l\'offre',
                  headerStyle: { backgroundColor: '#16a34a' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen 
                name="ApplicationDetail" 
                component={ApplicationDetailScreen}
                options={{ 
                  headerShown: true,
                  headerStyle: { backgroundColor: '#16a34a' },
                  headerTintColor: 'white',
                }}
              />
              <Stack.Screen 
                name="EditApplication" 
                component={EditApplicationScreen}
                options={{ 
                  headerShown: true,
                  headerStyle: { backgroundColor: '#16a34a' },
                  headerTintColor: 'white',
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </NotificationProvider>
      </AuthProvider>
    </Provider>
  );
}