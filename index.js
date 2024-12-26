import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
// import { NativeModules } from 'react-native';
import App from './App';

// Disable remote debugging in production
// if (!__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(false);
// }

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
