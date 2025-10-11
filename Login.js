import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  Alert 
} from 'react-native';

// Dark Mode Toggle Component
const DarkModeToggle = ({ isDarkMode, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[styles.darkModeButton, isDarkMode && styles.darkModeButtonDark]} 
      onPress={onToggle}
    >
      <Text style={[styles.darkModeIcon, isDarkMode && styles.darkModeIconDark]}>
        {isDarkMode ? '☀️' : '🌙'}
      </Text>
    </TouchableOpacity>
  );
};

const LoginPage = ({ onLoginSuccess, onSignupSuccess, isDarkMode, onToggleDarkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Simulate login - in real app, you'd validate with backend
    Alert.alert('Success', 'Login successful!', [
      { text: 'OK', onPress: () => onLoginSuccess() }
    ]);
  };

  const handleSignUp = () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    // Simulate signup - in real app, you'd create account with backend
    Alert.alert('Success', 'Account created successfully!', [
      { text: 'OK', onPress: () => onSignupSuccess() }
    ]);
  };

  return (
    <View style={[styles.loginContainer, isDarkMode && styles.loginContainerDark]}>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      <View style={styles.loginHeader}>
        <Image 
          source={require('./assets/icon.png')} 
          style={styles.loginLogo}
          resizeMode="contain"
        />
        <Text style={[styles.loginTitle, isDarkMode && styles.loginTitleDark]}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </Text>
        <Text style={[styles.loginSubtitle, isDarkMode && styles.loginSubtitleDark]}>
          {isSignUp ? 'Sign up to get started with FinVerse' : 'Sign in to continue to your dashboard'}
        </Text>
      </View>

      <View style={styles.loginForm}>
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkMode && styles.inputLabelDark]}>Email</Text>
          <TextInput
            style={[styles.textInput, isDarkMode && styles.textInputDark]}
            placeholder="Enter your email"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, isDarkMode && styles.inputLabelDark]}>Password</Text>
          <TextInput
            style={[styles.textInput, isDarkMode && styles.textInputDark]}
            placeholder="Enter your password"
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {isSignUp && (
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, isDarkMode && styles.inputLabelDark]}>Confirm Password</Text>
            <TextInput
              style={[styles.textInput, isDarkMode && styles.textInputDark]}
              placeholder="Confirm your password"
              placeholderTextColor={isDarkMode ? '#666' : '#999'}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
        )}

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={isSignUp ? handleSignUp : handleLogin}
        >
          <Text style={styles.loginButtonText}>
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setIsSignUp(!isSignUp)}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  loginHeader: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  loginLogo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  loginForm: {
    flex: 1,
    paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  switchButton: {
    paddingVertical: 12,
  },
  switchButtonText: {
    color: '#2196F3',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  // Dark Mode Styles
  loginContainerDark: {
    backgroundColor: '#1a1a1a',
  },
  loginTitleDark: {
    color: '#fff',
  },
  loginSubtitleDark: {
    color: '#ccc',
  },
  inputLabelDark: {
    color: '#fff',
  },
  textInputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  // Dark Mode Toggle Styles
  darkModeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  darkModeButtonDark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  darkModeIcon: {
    fontSize: 24,
  },
  darkModeIconDark: {
    fontSize: 24,
  },
});

export default LoginPage;
