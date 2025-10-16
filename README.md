# Spotify Clone App

A full-featured React Native/Expo application that replicates Spotify's design and functionality, featuring multiple screens, navigation, offline caching, and comprehensive accessibility support.

## Features

### Core Functionality
- **Multi-Screen Navigation**: Profile, Settings, and Playlists screens with drawer navigation
- **Authentication System**: Complete login/signup flow with form validation
- **Offline Navigation Caching**: AsyncStorage-based state persistence for seamless UX
- **Spotify Design Language**: Dark theme with green accent colors (#1DB954)
- **Responsive Layout**: Optimized for various screen sizes and platforms

### Advanced Features
- **Animated Drawer Navigation**: Custom drawer with smooth slide transitions
- **Navigation State Persistence**: Remembers last visited screen across app restarts
- **Haptic Feedback**: Distinct vibrations for success, error, and button presses
- **Loading States**: Visual feedback during all async operations
- **Cross-Platform Support**: Web, iOS, and Android compatibility

### Accessibility Features
- **Screen Reader Support**: Full VoiceOver/TalkBack compatibility
- **Dynamic Font Scaling**: Respects system accessibility text size settings
- **Keyboard Navigation**: Proper focus management for assistive technologies
- **High Contrast**: Maintains readability across all text size preferences

## Screenshots

![Week 1 Screeshot](image/screenshot.png.jpg)

*The Week 1 Screeshot shows the component showcase. Able to add button, text field, scroll bar/view.*

## Week 2: Accessibility Implementation

![Week 2 Screenshot](image/Week%202%20ScreenShot.png.jpg)

*The above screenshot shows the app's "Add Dynamic Components" section with controls for adding different component types, and the "Dynamic Components" section displaying an added button and image.*

## Week 2 - Multi-Screen Navigation

![Week 2 Multi-Screen Navigation Demo](image/Week%202%20Act%202.mp4)

*This video demonstrates the completed multi-screen navigation system featuring the Profile, Settings, and Playlists screens with smooth drawer navigation, navigation state caching, and cross-platform compatibility.*

## Installation

1. Clone the repository:
```bash
git clone https://github.com/rjkent14/my-expo-app.git
cd my-expo-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

## Usage

1. **App Launch**: The app launches with a Spotify-style login interface featuring:
   - Email/username and password input fields with validation
   - Social login buttons (Facebook and Google)
   - Smooth logo animations and form transitions
   - Haptic feedback on all interactions

2. **Authentication Flow**:
   - **Login**: Enter credentials and tap "LOG IN" (use test@test.com/password for demo)
   - **Social Auth**: Tap Facebook or Google buttons for alternative login
   - **Password Reset**: Use "Forgot your password?" link for recovery
   - **Sign Up**: Navigate to registration screen for new accounts

3. **Main App Navigation** (after login):
   - **Profile Screen**: View and edit user information, see activity stats
   - **Settings Screen**: Configure app preferences, notification settings, logout
   - **Playlists Screen**: Browse music playlists with horizontal scrolling
   - **Navigation Caching**: App remembers your last visited screen

4. **Navigation Features**:
   - **Drawer Menu**: Slide from left edge or tap hamburger to access navigation
   - **Screen Persistence**: Last visited screen is cached and restored on app restart
   - **Smooth Transitions**: Animated screen changes with proper timing
   - **Cross-Platform**: Consistent experience on web, iOS, and Android

5. **Accessibility Features**:
   - **Screen Readers**: Full VoiceOver/TalkBack support across all screens
   - **Font Scaling**: Respects system accessibility settings
   - **Haptic Feedback**: Distinct vibrations for different actions
   - **Keyboard Navigation**: Proper focus management and navigation

## Technical Implementation

### Core Architecture
- **React Navigation**: Stack and drawer navigators with custom animations
- **Component Structure**: Modular screens with shared UI components
- **State Management**: React hooks for local state and navigation state
- **AsyncStorage Integration**: Persistent navigation caching across app restarts

### Navigation System
- **Drawer Navigator**: Custom animated drawer with accessibility support
- **Stack Navigator**: Screen transitions with proper header configurations
- **Navigation Persistence**: AsyncStorage-based state caching and restoration
- **Screen Listeners**: Automatic cache updates on navigation changes

### Animation & Interaction
- **React Native Reanimated**: Advanced animations for drawer and transitions
- **React Native Animated**: Logo animations and form transitions
- **Haptic Feedback**: Expo Haptics integration for tactile responses
- **Gesture Handling**: React Native Gesture Handler for smooth interactions

### Accessibility Integration
- **Screen Reader Labels**: Comprehensive accessibilityLabel and accessibilityHint props
- **Dynamic Font Scaling**: Automatic text size adjustment using Dimensions API
- **Focus Management**: Proper tab navigation and keyboard accessibility
- **Cross-Platform**: Consistent accessibility across web, iOS, and Android

## Technology Stack

- **React Native**: Cross-platform mobile development framework
- **Expo**: Development platform with managed workflow and build tools
- **React Navigation**: Complete navigation solution for React Native apps
- **React Native Reanimated**: Powerful animation library for smooth interactions
- **React Native Gesture Handler**: Declarative API for handling touch gestures
- **AsyncStorage**: Persistent storage for navigation caching
- **Expo Haptics**: Built-in haptic feedback for enhanced user experience
- **React Native Animated**: Performance-optimized animation system
- **Modern JavaScript**: ES6+ syntax with async/await patterns

## Project Structure

```
my-expo-app/
├── App.js                     # Main app component with authentication
├── SignupScreen.js           # Registration screen component
├── index.js                  # App entry point
├── app.json                  # Expo configuration (dark theme)
├── babel.config.js           # Babel transpiler configuration
├── package.json              # Dependencies and scripts
├── assets/                   # Standard Expo assets
│   ├── icon.png
│   ├── favicon.png
│   ├── adaptive-icon.png
│   └── splash-icon.png
├── image/            # App-specific images
│   ├── facebook.png
│   ├── Google.png
│   ├── screenshot.png.jpg
│   ├── Week 2 ScreenShot.png.jpg
│   └── Week 2 Act 2.mp4
├── navigation/               # Navigation components
│   └── MainAppNavigator.js   # Main drawer navigator with animations
├── screens/                  # App screens
│   ├── ProfileScreen.js      # User profile screen
│   ├── SettingsScreen.js     # App settings screen
│   └── PlaylistsScreen.js    # Music playlists screen
├── utils/                    # Utility functions
│   └── navigationCache.js    # AsyncStorage navigation caching
└── README.md                 # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).