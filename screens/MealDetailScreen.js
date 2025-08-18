// screens/MealDetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { reserveMeal } from '../services/mealService';

export default function MealDetailScreen({ route, navigation }) {
  const meal = route?.params?.meal;

  if (!meal) {
    return (
      <View style={styles.container}> 
        <Text>Repas introuvable.</Text>
      </View>
    );
  }

  const handleReserve = async () => {
    try {
      await reserveMeal(meal.id);
      Alert.alert('Succès', 'Repas réservé !');
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erreur', 'Action impossible');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{meal.titre}</Text>
      <Text style={styles.meta}>📍 {meal.quartier}</Text>
      <Text style={styles.meta}>👥 {meal.portions} portion(s)</Text>
      <Text style={styles.desc}>{meal.description}</Text>

      <TouchableOpacity
        style={[styles.reserveBtn, meal.reserved && styles.reserved]}
        onPress={handleReserve}
        disabled={meal.reserved}
      >
        <Text style={styles.reserveText}>{meal.reserved ? '✅ Réservé' : 'Réserver'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  meta: { color: '#666', marginBottom: 6 },
  desc: { marginTop: 12, lineHeight: 20 },
  reserveBtn: {
    marginTop: 24,
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  reserved: { backgroundColor: '#95A5A6' },
  reserveText: { color: 'white', fontWeight: 'bold' },
});