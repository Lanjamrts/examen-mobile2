import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Platform, TouchableOpacity } from 'react-native';
// Important: avoid importing react-native-maps on web to prevent bundling/runtime issues
let MapView, Marker, PROVIDER_GOOGLE;
if (Platform.OS !== 'web') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
}
import * as Location from 'expo-location';
import { getMeals } from '../services/mealService';

// Simple mock geocoding for quartiers -> coordinates
const QUARTIER_TO_COORDS = {
  'Centre-ville': { latitude: 48.8566, longitude: 2.3522 },
  'Quartier Nord': { latitude: 48.8867, longitude: 2.3431 },
  'Quartier Sud': { latitude: 48.8266, longitude: 2.3522 },
  'Banlieue': { latitude: 48.9000, longitude: 2.2500 },
};

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg("Permission localisation refusée");
        } else {
          const loc = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
        }
      } catch (e) {
        setErrorMsg('Erreur de localisation');
      } finally {
        try {
          const data = await getMeals();
          setMeals(Array.isArray(data) ? data : []);
        } catch {}
        setLoading(false);
      }
    })();
  }, []);

  const initialRegion = useMemo(() => {
    if (location) return location;
    // Fallback to Paris center if no location
    return {
      latitude: 48.8566,
      longitude: 2.3522,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };
  }, [location]);

  const mealMarkers = useMemo(() => {
    return meals
      .map(m => {
        const coords = QUARTIER_TO_COORDS[m.quartier];
        if (!coords) return null;
        return {
          id: m.id,
          title: m.titre,
          description: m.description,
          coords,
          reserved: m.reserved,
        };
      })
      .filter(Boolean);
  }, [meals]);

  function guessQuartierFromLocation() {
    if (!location) return null;
    let best = null;
    let bestDist = Infinity;
    Object.entries(QUARTIER_TO_COORDS).forEach(([q, coords]) => {
      const dLat = coords.latitude - location.latitude;
      const dLon = coords.longitude - location.longitude;
      const dist = Math.sqrt(dLat * dLat + dLon * dLon);
      if (dist < bestDist) {
        bestDist = dist;
        best = q;
      }
    });
    return best;
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 16, textAlign: 'center', paddingHorizontal: 16 }}>
          La carte n'est pas disponible sur le Web dans cette configuration.
          Ouvre l'application sur Android/iOS pour voir la carte.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={{ marginTop: 8 }}>Chargement de la carte…</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        showsUserLocation={!!location}
        showsMyLocationButton={true}
      >
        {mealMarkers.map(marker => (
          <Marker
            key={marker.id}
            coordinate={marker.coords}
            title={marker.title}
            description={marker.description}
            pinColor={marker.reserved ? '#95A5A6' : '#FF6B6B'}
          />
        ))}
      </MapView>
      {errorMsg ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          const initialQuartier = guessQuartierFromLocation();
          navigation.navigate('Publish', { initialQuartier });
        }}
      >
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorBanner: {
    position: 'absolute',
    top: Platform.select({ ios: 80, android: 20 }),
    left: 16,
    right: 16,
    backgroundColor: '#fff0f0',
    borderColor: '#ffd6d6',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  errorText: { color: '#c0392b', textAlign: 'center' },
  fab: {
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
  },
  fabText: { color: 'white', fontSize: 30, fontWeight: 'bold' },
});


