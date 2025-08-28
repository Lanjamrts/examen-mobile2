import React, {
  useState,
  useEffect
} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import MealCard from '../components/MealCard';
import FilterComponent from '../components/FilterComponent';
import {
  getMeals,
  reserveMeal
} from '../services/mealService';

export default function HomeScreen({
  navigation
}) {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMeals();
    });
    loadMeals();
    return unsubscribe;
  }, [navigation]);

  const loadMeals = async () => {
    const mealsData = await getMeals();
    setMeals(mealsData);
    setFilteredMeals(mealsData);
  };

  const handleFilter = (filterType) => {
    setFilter(filterType);
    if (filterType === 'all') {
      setFilteredMeals(meals);
    } else {
      const filtered = meals.filter(meal => meal.quartier === filterType);
      setFilteredMeals(filtered);
    }
  };

  const handleReserveMeal = async (mealId) => {
    try {
      await reserveMeal(mealId);
      Alert.alert('Succès', 'Repas réservé avec succès !');
      loadMeals();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de réserver ce repas');
    }
  };

  return (
    <View style={styles.container}>
      <FilterComponent onFilter={handleFilter} currentFilter={filter} />

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            onPress={() => navigation.navigate('MealDetail', { meal: item })}
            onReserve={() => handleReserveMeal(item.id)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Publish')}
      >
        <Text style={styles.floatingButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
});