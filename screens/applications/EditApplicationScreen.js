import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as DocumentPicker from 'expo-document-picker';
import { useDispatch } from 'react-redux';
import { updateApplication } from '../../store/slices/applicationsSlice';

const EditApplicationScreen = ({ route, navigation }) => {
  const { application } = route.params;
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    cover_letter: application.cover_letter || '',
    cv_path: application.cv_path || '',
  });
  const [loading, setLoading] = useState(false);
  const [cvFile, setCvFile] = useState(null);

  useEffect(() => {
    navigation.setOptions({
      title: 'Modifier la candidature',
      headerRight: () => (
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={[
            styles.headerButtonText,
            loading && styles.headerButtonTextDisabled
          ]}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, loading, formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePickCV = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        const file = result.assets[0];
        setCvFile(file);
        setFormData(prev => ({ ...prev, cv_path: file.uri }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sélectionner le fichier');
    }
  };

  const handleSave = async () => {
    if (!formData.cover_letter.trim()) {
      Alert.alert('Erreur', 'La lettre de motivation est obligatoire');
      return;
    }

    setLoading(true);
    try {
      // Simuler l'upload du CV si un nouveau fichier a été sélectionné
      let cvPath = formData.cv_path;
      if (cvFile) {
        // Ici, vous uploaderiez le fichier vers votre serveur
        // cvPath = await uploadFile(cvFile);
        cvPath = formData.cv_path; // Pour la simulation
      }

      const updatedData = {
        ...formData,
        cv_path: cvPath,
      };

      await dispatch(updateApplication({ 
        id: application.id, 
        applicationData: updatedData 
      }));

      Alert.alert(
        'Succès',
        'Candidature mise à jour avec succès',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour la candidature');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Annuler les modifications',
      'Êtes-vous sûr de vouloir annuler ? Les modifications non sauvegardées seront perdues.',
      [
        { text: 'Continuer l\'édition', style: 'cancel' },
        { text: 'Annuler', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollContainer}>
        {/* Informations de l'offre */}
        <View style={styles.offerInfo}>
          <Text style={styles.offerTitle}>{application.position}</Text>
          <Text style={styles.offerCompany}>{application.company}</Text>
        </View>

        {/* Formulaire */}
        <View style={styles.form}>
          {/* CV */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CV *</Text>
            <TouchableOpacity style={styles.filePickerButton} onPress={handlePickCV}>
              <Icon name="description" size={24} color="#16a34a" />
              <View style={styles.filePickerContent}>
                <Text style={styles.filePickerTitle}>
                  {cvFile ? cvFile.name : 'CV actuel'}
                </Text>
                <Text style={styles.filePickerSubtitle}>
                  {cvFile ? 'Nouveau fichier sélectionné' : 'Appuyez pour changer'}
                </Text>
              </View>
              <Icon name="upload" size={20} color="#6b7280" />
            </TouchableOpacity>
            <Text style={styles.helpText}>
              Format PDF uniquement. Taille maximale : 5 MB
            </Text>
          </View>

          {/* Lettre de motivation */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lettre de motivation *</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Expliquez pourquoi vous êtes le candidat idéal pour ce stage..."
              value={formData.cover_letter}
              onChangeText={(value) => handleInputChange('cover_letter', value)}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              maxLength={2000}
            />
            <Text style={styles.characterCount}>
              {formData.cover_letter.length}/2000 caractères
            </Text>
          </View>

          {/* Conseils */}
          <View style={styles.tipsSection}>
            <View style={styles.tipsHeader}>
              <Icon name="lightbulb" size={20} color="#f59e0b" />
              <Text style={styles.tipsTitle}>Conseils pour une bonne candidature</Text>
            </View>
            <View style={styles.tipsList}>
              <Text style={styles.tipItem}>• Personnalisez votre lettre pour chaque offre</Text>
              <Text style={styles.tipItem}>• Mettez en avant vos compétences pertinentes</Text>
              <Text style={styles.tipItem}>• Montrez votre motivation et votre intérêt</Text>
              <Text style={styles.tipItem}>• Relisez-vous avant d'envoyer</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Boutons d'action */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={handleCancel}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.saveButton, loading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContainer: {
    flex: 1,
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerButtonText: {
    color: '#16a34a',
    fontSize: 16,
    fontWeight: '600',
  },
  headerButtonTextDisabled: {
    color: '#9ca3af',
  },
  offerInfo: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  offerCompany: {
    fontSize: 14,
    color: '#6b7280',
  },
  form: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  filePickerContent: {
    flex: 1,
    marginLeft: 12,
  },
  filePickerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  filePickerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  helpText: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'right',
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginLeft: 8,
  },
  tipsList: {
    marginLeft: 28,
  },
  tipItem: {
    fontSize: 12,
    color: '#92400e',
    marginBottom: 4,
    lineHeight: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditApplicationScreen;