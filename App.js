import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// Use require() to avoid interop issues and stale caches
const HomeScreenModule = require('./screens/HomeScreen');
const PublishMealScreenModule = require('./screens/PublishMealScreen');
const MealDetailScreenModule = require('./screens/MealDetailScreen');
const MapScreenModule = require('./screens/MapScreen');

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function isValidComponent(Cmp) {
  return (
    typeof Cmp === 'function' ||
    (typeof Cmp === 'object' && Cmp !== null && ('$$typeof' in Cmp || 'render' in Cmp))
  );
}

function Fallback({ name }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ fontSize: 16, textAlign: 'center' }}>
        L'écran "{name}" n'est pas un composant React valide.\n\n
        Vérifie son export par défaut: {`export default function ${name}() { ... }`}
      </Text>
    </View>
  );
}

const HomeCmp = HomeScreenModule?.default ?? HomeScreenModule;
const PublishCmp = PublishMealScreenModule?.default ?? PublishMealScreenModule;
const MealDetailCmp = MealDetailScreenModule?.default ?? MealDetailScreenModule;
const MapCmp = MapScreenModule?.default ?? MapScreenModule;

// Debug logs (will show once in console)
try {
  console.log('[App] HomeScreenModule keys:', Object.keys(HomeScreenModule || {}));
  console.log('[App] typeof HomeCmp:', typeof HomeCmp);
} catch {}

const SafeHome = isValidComponent(HomeCmp) ? HomeCmp : () => <Fallback name="HomeScreen" />;
const SafePublish = isValidComponent(PublishCmp) ? PublishCmp : () => <Fallback name="PublishMealScreen" />;
const SafeMealDetail = isValidComponent(MealDetailCmp) ? MealDetailCmp : () => <Fallback name="MealDetailScreen" />;
const SafeMap = isValidComponent(MapCmp) ? MapCmp : () => <Fallback name="MapScreen" />;

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#FF6B6B' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarActiveTintColor: '#FF6B6B',
      }}
    >
      <Tab.Screen
        name="Home"
        component={SafeHome}
        options={{ title: '🍽️ Repas' }}
      />
      <Tab.Screen
        name="Map"
        component={SafeMap}
        options={{ title: '🗺️ Carte' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#FF6B6B' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Root" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen name="Publish" component={SafePublish} options={{ title: 'Publier un repas' }} />
        <Stack.Screen name="MealDetail" component={SafeMealDetail} options={{ title: 'Détail du repas' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
