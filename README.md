# MealShareApp

Application mobile React Native (Expo) pour partager des repas solidaires et lutter contre le gaspillage alimentaire.

## Fonctionnalités (MVP)
- Publication d’un repas: titre, description, quartier, portions, limite d’heure (relative)
- Liste des repas avec filtre par quartier
- Réservation d’un repas / marquage réservé
- Persistance locale via AsyncStorage (avec repli mémoire si indisponible)

## Pile technique
- Expo SDK 53
- React 19, React Native 0.79
- React Navigation (stack)
- AsyncStorage (@react-native-async-storage/async-storage)

## Prérequis
- Node.js 18 LTS recommandé
- Expo Go installé sur le téléphone (Android/iOS)
- Android SDK/émulateur si vous ciblez Android depuis le PC (facultatif pour Expo Go)

## Installation
```bash
# Depuis le dossier du projet
npm install
```

## Démarrage
Important: n’utilisez plus l’ancienne expo-cli globale. Utilisez le CLI local via npx.
```bash
# Si vous avez encore l’ancienne expo-cli globale (déconseillé) :
npm uninstall -g expo-cli

# Lancer le projet avec cache vidé
npx expo start -c
```
- Android: `npm run android`
- Web: `npm run web`

## Structure du projet
```
MealShareApp/
  App.js
  index.js
  app.json
  components/
    FilterComponent.js
    MealCard.js
  data/
    mockData.js
  screens/
    HomeScreen.js
    MealDetailScreen.js
    PublishMealScreen.js
  services/
    mealService.js
    storageService.js
  utils/
    helpers.js
```

## Flux principal
- Accueil (HomeScreen) affiche la liste + filtre. Bouton flottant « + » pour publier.
- Publier (PublishMealScreen) enregistre via addMeal (AsyncStorage), puis retour à l’accueil.
- Détail (MealDetailScreen) permet de réserver.

## Dépannage courant
- « Open up App.js to start working on your app! »: vider le cache (`npx expo start -c`) et ouvrir ce projet dans Expo Go.
- « invalid value for component prop for screen 'Home' »: chaque écran doit exporter par défaut (`export default function ...`). L’app affiche un écran d’aide si ce n’est pas le cas.
- `ExpoMetroConfig.loadAsync is not a function`: désinstallez l’ancienne `expo-cli` globale et utilisez `npx expo ...`.
- AsyncStorage « Passing null/undefined as value is not supported »: `services/storageService.js` évite d’écrire `undefined` (fallback mémoire). Réinstallez Expo Go si nécessaire et relancez avec `-c`.

## Scripts utiles
```bash
npm run start    # expo start
npm run android  # expo start --android
npm run web      # expo start --web
```

## Évolutions possibles (bonus)
- Compteur global des repas sauvés
- Photos (Expo Image Picker), géolocalisation (Expo Location)
- Backend/API ou Firestore pour la synchro temps réel
