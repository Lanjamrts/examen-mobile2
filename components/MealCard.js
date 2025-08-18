// components/MealCard.js
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

export default function MealCard({ meal, onPress, onReserve }) {
  const timeLeft = () => {
    const now = new Date();
    const limitTime = new Date(meal.limiteHeure);
    const diff = limitTime - now;

    if (diff <= 0) return "Expiré";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m restantes`;
  };

  const handleReserve = () => {
    if (meal.reserved) {
      Alert.alert('Info', 'Ce repas est déjà réservé');
      return;
    }

    Alert.alert(
      'Réserver ce repas',
      `Voulez-vous réserver "${meal.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Réserver', onPress: onReserve }
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{meal.titre}</Text>
          <Text style={styles.quartier}>📍 {meal.quartier}</Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {meal.description}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.portions}>
            👥 {meal.portions} portion{meal.portions > 1 ? 's' : ''}
          </Text>
          <Text style={[
            styles.timeLeft,
            { color: timeLeft() === "Expiré" ? '#FF6B6B' : '#4ECDC4' }
          ]}>
            ⏰ {timeLeft()}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.reserveButton,
            meal.reserved && styles.reservedButton
          ]}
          onPress={handleReserve}
          disabled={meal.reserved}
        >
          <Text style={[
            styles.reserveText,
            meal.reserved && styles.reservedText
          ]}>
            {meal.reserved ? '✅ Réservé' : '🍽️ Réserver'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  quartier: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  portions: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  timeLeft: {
    fontSize: 14,
    fontWeight: '500',
  },
  reserveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  reservedButton: {
    backgroundColor: '#95A5A6',
  },
  reserveText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  reservedText: {
    color: 'white',
  },
});