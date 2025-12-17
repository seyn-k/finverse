import Constants from 'expo-constants';
import { Platform } from 'react-native';

const resolvedHost = (
    (Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost || '')
        .toString()
        .split(':')[0]
);

const isLocalHost = resolvedHost === 'localhost' || resolvedHost === '127.0.0.1';

// Once you deploy the backend, replace this with your actual Render URL
const PROD_URL = "https://your-backend-url.onrender.com";

export const API_URL = __DEV__
    ? (Platform.OS === 'android'
        ? (!isLocalHost && resolvedHost ? `http://${resolvedHost}:4000` : 'http://10.0.2.2:4000')
        : (resolvedHost ? `http://${resolvedHost}:4000` : 'http://localhost:4000'))
    : PROD_URL;
