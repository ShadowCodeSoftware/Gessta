import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../../context/AuthContext';

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    phone: '',
    // Champs spécifiques étudiant
    level: 'L3',
    field_of_study: '',
    // Champs spécifiques entreprise
    company_name: '',
    sector: '',
    size: 'small',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register } = useAuth();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return false;
    }

    if (formData.password.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (formData.role === 'student' && !formData.field_of_study) {
      Alert.alert('Erreur', 'Veuillez spécifier votre domaine d\'études');
      return false;
    }

    if (formData.role === 'company' && (!formData.company_name || !formData.sector)) {
      Alert.alert('Erreur', 'Veuillez remplir les informations de l\'entreprise');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(formData);
      navigation.replace('Main');
    } catch (error) {
      Alert.alert('Erreur', error.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const renderStudentFields = () => (
    <>
      <View style={styles.inputContainer}>
        <Icon name="school" size={20} color="#666" style={styles.inputIcon} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.level}
            onValueChange={(value) => handleInputChange('level', value)}
            style={styles.picker}
          >
            <Picker.Item label="Licence 1" value="L1" />
            <Picker.Item label="Licence 2" value="L2" />
            <Picker.Item label="Licence 3" value="L3" />
            <Picker.Item label="Master 1" value="M1" />
            <Picker.Item label="Master 2" value="M2" />
          </Picker>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Icon name="book" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Domaine d'études *"
          value={formData.field_of_study}
          onChangeText={(value) => handleInputChange('field_of_study', value)}
        />
      </View>
    </>
  );

  const renderCompanyFields = () => (
    <>
      <View style={styles.inputContainer}>
        <Icon name="business" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Nom de l'entreprise *"
          value={formData.company_name}
          onChangeText={(value) => handleInputChange('company_name', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="category" size={20} color="#666" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Secteur d'activité *"
          value={formData.sector}
          onChangeText={(value) => handleInputChange('sector', value)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="people" size={20} color="#666" style={styles.inputIcon} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.size}
            onValueChange={(value) => handleInputChange('size', value)}
            style={styles.picker}
          >
            <Picker.Item label="Startup (1-10)" value="startup" />
            <Picker.Item label="Petite (11-50)" value="small" />
            <Picker.Item label="Moyenne (51-250)" value="medium" />
            <Picker.Item label="Grande (250+)" value="large" />
          </Picker>
        </View>
      </View>
    </>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#16a34a" />
          </TouchableOpacity>
          <View style={styles.logoContainer}>
            <Icon name="school" size={60} color="#16a34a" />
          </View>
          <Text style={styles.title}>Inscription</Text>
          <Text style={styles.subtitle}>Créez votre compte</Text>
        </View>

        <View style={styles.form}>
          {/* Type d'utilisateur */}
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
                style={styles.picker}
              >
                <Picker.Item label="👨‍🎓 Étudiant" value="student" />
                <Picker.Item label="🏢 Entreprise" value="company" />
              </Picker>
            </View>
          </View>

          {/* Champs communs */}
          <View style={styles.inputContainer}>
            <Icon name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nom complet *"
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon name="phone" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={formData.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Champs spécifiques selon le rôle */}
          {formData.role === 'student' && renderStudentFields()}
          {formData.role === 'company' && renderCompanyFields()}

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe *"
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? 'visibility' : 'visibility-off'}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirmer le mot de passe *"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange('confirmPassword', value)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? 'Inscription...' : 'S\'inscrire'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte ? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    padding: 8,
  },
  logoContainer: {
    width: 100,
    height: 100,
    backgroundColor: '#f0fdf4',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  picker: {
    height: 50,
  },
  eyeIcon: {
    padding: 5,
  },
  registerButton: {
    backgroundColor: '#16a34a',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledButton: {
    backgroundColor: '#a3a3a3',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#16a34a',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;