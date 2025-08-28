// screens/PublishMealScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { addMeal } from '../services/mealService';

const QUARTIERS = ['Centre-ville', 'Quartier Nord', 'Quartier Sud', 'Banlieue'];

function PublishMealScreenBase({ navigation, route }) {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const initialQuartier = route?.params?.initialQuartier;
  const [quartier, setQuartier] = useState(
    QUARTIERS.includes(initialQuartier) ? initialQuartier : QUARTIERS[0]
  );
  const [portions, setPortions] = useState('1');
  const [limiteHeureH, setLimiteHeureH] = useState('4');

  const onSubmit = async () => {
    if (!titre.trim() || !description.trim()) {
      Alert.alert('Champs requis', 'Titre et description sont obligatoires.');
      return;
    }
    const portionsNum = Math.max(1, parseInt(portions || '1', 10));
    const hours = Math.max(1, parseInt(limiteHeureH || '1', 10));
    const limiteHeure = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

    try {
      await addMeal({ titre, description, quartier, portions: portionsNum, limiteHeure });
      Alert.alert('Succès', 'Repas publié !');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', "Impossible d'ajouter le repas");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput style={styles.input} value={titre} onChangeText={setTitre} placeholder="Titre du repas" />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
        placeholder="Décris le repas"
      />

      <Text style={styles.label}>Quartier</Text>
      <View style={styles.row}>
        {QUARTIERS.map(q => (
          <TouchableOpacity key={q} style={[styles.pill, quartier === q && styles.pillActive]} onPress={() => setQuartier(q)}>
            <Text style={[styles.pillText, quartier === q && styles.pillTextActive]}>{q}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Portions</Text>
      <TextInput
        style={styles.input}
        value={portions}
        onChangeText={setPortions}
        keyboardType="number-pad"
        placeholder="Nombre de portions"
      />

      <Text style={styles.label}>Limite (heures à partir de maintenant)</Text>
      <TextInput
        style={styles.input}
        value={limiteHeureH}
        onChangeText={setLimiteHeureH}
        keyboardType="number-pad"
        placeholder="Heures"
      />

      <TouchableOpacity style={styles.submit} onPress={onSubmit}>
        <Text style={styles.submitText}>Publier</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const PublishMealScreen = React.memo(PublishMealScreenBase);
export default PublishMealScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { fontWeight: '600', marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  row: { flexDirection: 'row', flexWrap: 'wrap' },
  pill: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f8f9fa',
  },
  pillActive: { backgroundColor: '#FF6B6B', borderColor: '#FF6B6B' },
  pillText: { color: '#495057' },
  pillTextActive: { color: 'white', fontWeight: 'bold' },
  submit: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitText: { color: 'white', fontWeight: 'bold' },
});