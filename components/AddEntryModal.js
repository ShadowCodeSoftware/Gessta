import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddEntryModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  editingEntry, 
  onEditSubmit, 
  onEditClose 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const isEditing = !!editingEntry;

  useEffect(() => {
    if (editingEntry) {
      setTitle(editingEntry.title);
      setContent(editingEntry.content);
      setDate(editingEntry.entry_date);
    } else {
      // Réinitialiser pour une nouvelle entrée
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingEntry, visible]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !date) {
      return;
    }

    setLoading(true);
    try {
      const entryData = {
        title: title.trim(),
        content: content.trim(),
        entry_date: date,
      };

      if (isEditing) {
        await onEditSubmit(editingEntry.id, entryData);
        onEditClose();
      } else {
        await onSubmit(entryData);
      }

      // Réinitialiser le formulaire
      setTitle('');
      setContent('');
      setDate(new Date().toISOString().split('T')[0]);
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (isEditing) {
      onEditClose();
    } else {
      onClose();
    }
  };

  const modalVisible = visible || isEditing;

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Icon name="close" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
          </Text>
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading || !title.trim() || !content.trim()}
            style={[
              styles.saveButton,
              (!title.trim() || !content.trim() || loading) && styles.saveButtonDisabled
            ]}
          >
            <Text style={[
              styles.saveButtonText,
              (!title.trim() || !content.trim() || loading) && styles.saveButtonTextDisabled
            ]}>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Titre *</Text>
            <TextInput
              style={styles.input}
              placeholder="Titre de l'entrée..."
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date *</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={date}
              onChangeText={setDate}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contenu *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Décrivez votre journée, vos apprentissages, vos réflexions..."
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.helpText}>
            <Icon name="info" size={16} color="#6b7280" />
            <Text style={styles.helpTextContent}>
              Documentez vos activités quotidiennes, vos apprentissages et vos réflexions 
              pour enrichir votre expérience de stage.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  saveButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#9ca3af',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  helpText: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  helpTextContent: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    lineHeight: 20,
  },
});

export default AddEntryModal;