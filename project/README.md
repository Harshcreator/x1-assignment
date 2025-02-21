# X1Coin App

A mobile-first web application that combines meditation tracking with blockchain rewards using X1TestCoin (X1TC) on the Sepolia testnet.

## 🌟 Features

### 1. Wallet Integration
- MetaMask wallet connection support
- Display X1TC token balance
- Token transfer and burn functionality
- Real-time chain and account monitoring

### 2. Meditation Tracking
- 5-minute meditation sessions
- Movement detection using device accelerometer
- Real-time violation tracking
- Session statistics and history

### 3. Authentication
- Email/password authentication using Firebase
- Secure user profiles
- Persistent session management

### 4. Token Rewards & Penalties
- 20% token burn penalty for movement violations
- Integration with X1TestCoin smart contract
- Real-time balance updates

## 🏗️ Architecture

### Frontend (React Native + Expo)
- `/app` - Main application routes and screens
  - `/(tabs)` - Tab-based navigation
    - `index.tsx` - Dashboard screen
    - `meditation.tsx` - Meditation session screen
    - `profile.tsx` - User profile and authentication
  - `_layout.tsx` - Root layout with providers

### State Management
- `/src/context`
  - `AuthContext.tsx` - Firebase authentication state
  - `WalletContext.tsx` - Web3 wallet integration
  - `X1CoinABI.ts` - Smart contract interface

### Configuration
- `/src/config`
  - `firebase.ts` - Firebase initialization
- Environment variables
  - `.env.local` - Firebase configuration

## 🛠️ Technical Stack

- **Frontend Framework**: React Native + Expo
- **Smart Contract**: Solidity 0.8.28
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Authentication**: Firebase Auth
- **Development Tools**: Hardhat, TypeScript
- **UI Components**: Native components with custom styling

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Configure Environment Variables:
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npx expo start
```

## 💡 Usage

1. Authentication 
- Sign up with your email and password  
- Log in to your account
- Connect your MetaMask wallet

2. Meditation
- Start a new meditation session
- Keep your device still for 5 minutes
- View movement violations in real-time

3. Profile
- View meditation statistics
- Manage wallet connection
- Check token balance

---
