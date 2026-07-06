# ShelfMates

A React Native app for sharing bookshelves with friends — track what you read, lend books, and discover recommendations from your mates.

## Stack

- **Expo** (React Native)
- **NativeWind** (Tailwind CSS for React Native)
- **Redux Toolkit** + **React Redux**
- **React Native Paper** (Material Design UI)

## Getting started

```bash
cd ShelfMates
npm install
npm start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go.

## Project structure

```
src/
  providers/     App-level providers (Redux, Paper, Safe Area)
  screens/       Screen components
  store/         Redux store, slices, typed hooks
  theme/         React Native Paper theme
```

## First screen

`src/screens/HomeScreen.tsx` — welcome screen with display name input, Redux state, NativeWind styling, and Paper components.

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm start`    | Start Expo dev server    |
| `npm run ios`  | Open on iOS              |
| `npm run android` | Open on Android       |
| `npm run web`  | Open in browser          |
