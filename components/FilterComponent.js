import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';

const quartiers = ['all', 'Centre-ville', 'Quartier Nord', 'Quartier Sud', 'Banlieue'];

export default function FilterComponent({ onFilter, currentFilter }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrer par quartier :</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {quartiers.map((quartier) => (
            <TouchableOpacity
              key={quartier}
              style={[
                styles.filterButton,
                currentFilter === quartier && styles.activeFilter
              ]}
              onPress={() => onFilter(quartier)}
            >
              <Text style={[
                styles.filterText,
                currentFilter === quartier && styles.activeFilterText
              ]}>
                {quartier === 'all' ? '🌍 Tous' : `📍 ${quartier}`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'white',
		paddingVertical: 16,
		paddingHorizontal: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#f0f0f0',
	},
	title: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 12,
		color: '#333',
	},
	filterRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	filterButton: {
		backgroundColor: '#f8f9fa',
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		marginRight: 8,
		borderWidth: 1,
		borderColor: '#e9ecef',
	},
	activeFilter: {
		backgroundColor: '#FF6B6B',
		borderColor: '#FF6B6B',
	},
	filterText: {
		fontSize: 14,
		color: '#495057',
		fontWeight: '500',
	},
	activeFilterText: {
		color: 'white',
		fontWeight: 'bold',
	},
});


