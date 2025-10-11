import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  Alert,
  Dimensions 
} from 'react-native';
import { Camera } from 'expo-camera';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

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

const KYCVerification = ({ onKYCComplete, isDarkMode, onToggleDarkMode }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('idle'); // 'idle', 'detecting', 'success'
  const [detectionCount, setDetectionCount] = useState(0);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  // Request camera permission on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Simulate face detection
  useEffect(() => {
    if (isCameraOn && verificationStatus === 'detecting') {
      const interval = setInterval(() => {
        // Simulate random face detection
        const randomDetection = Math.random() > 0.3; // 70% chance of detection
        
        if (randomDetection) {
          setFaceDetected(true);
          setDetectionCount(prev => prev + 1);
          
          // After 3 successful detections, mark as verified
          if (detectionCount >= 2) {
            setVerificationStatus('success');
            clearInterval(interval);
          }
        } else {
          setFaceDetected(false);
          setDetectionCount(0);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isCameraOn, verificationStatus, detectionCount]);

  const handleStartCamera = () => {
    if (hasPermission === null) {
      Alert.alert('Camera Permission', 'Requesting camera permission...');
      return;
    }
    
    if (hasPermission === false) {
      Alert.alert(
        'Camera Permission Denied',
        'Camera access is required for face verification. Please enable camera permission in your device settings.',
        [
          { text: 'OK', onPress: () => {} }
        ]
      );
      return;
    }

    setIsCameraOn(true);
    setVerificationStatus('detecting');
    setFaceDetected(false);
    setDetectionCount(0);
  };

  const handleStopCamera = () => {
    setIsCameraOn(false);
    setVerificationStatus('idle');
    setFaceDetected(false);
    setDetectionCount(0);
  };

  const handleComplete = () => {
    if (verificationStatus === 'success') {
      Alert.alert('Success', 'KYC verification completed successfully!', [
        { text: 'Continue', onPress: () => onKYCComplete() }
      ]);
    } else {
      Alert.alert('Error', 'Please complete face verification first');
    }
  };

  const getStatusText = () => {
    switch (verificationStatus) {
      case 'idle':
        return 'Ready to start verification';
      case 'detecting':
        return faceDetected ? 'Face detected! Hold still...' : 'Looking for your face...';
      case 'success':
        return 'Verification successful!';
      default:
        return 'Ready to start verification';
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'idle':
        return '#666';
      case 'detecting':
        return faceDetected ? '#4CAF50' : '#FF9800';
      case 'success':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <DarkModeToggle isDarkMode={isDarkMode} onToggle={onToggleDarkMode} />
      
      <View style={styles.header}>
        <Image 
          source={require('./assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={[styles.title, isDarkMode && styles.titleDark]}>
          KYC Verification
        </Text>
        <Text style={[styles.subtitle, isDarkMode && styles.subtitleDark]}>
          Complete your identity verification with a selfie
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.cameraContainer}>
          {isCameraOn && hasPermission ? (
            <View style={[styles.cameraView, isDarkMode && styles.cameraViewDark]}>
              <Camera
                style={styles.camera}
                type={Camera.Constants.Type.front}
                ref={cameraRef}
              >
                {/* Face detection circle overlay */}
                <View style={styles.faceDetectionArea}>
                  <View style={[
                    styles.detectionCircle,
                    faceDetected && styles.detectionCircleActive,
                    verificationStatus === 'success' && styles.detectionCircleSuccess
                  ]}>
                    <View style={[
                      styles.innerCircle,
                      faceDetected && styles.innerCircleActive,
                      verificationStatus === 'success' && styles.innerCircleSuccess
                    ]} />
                  </View>
                </View>
                
                {/* Status overlay */}
                <View style={styles.statusOverlay}>
                  <Text style={[styles.statusOverlayText, isDarkMode && styles.statusOverlayTextDark]}>
                    {faceDetected ? '✅ Face Detected' : '👤 Looking for face...'}
                  </Text>
                </View>
              </Camera>
            </View>
          ) : (
            <View style={[styles.cameraPlaceholder, isDarkMode && styles.cameraPlaceholderDark]}>
              <Text style={[styles.placeholderIcon, isDarkMode && styles.placeholderIconDark]}>
                📷
              </Text>
              <Text style={[styles.placeholderText, isDarkMode && styles.placeholderTextDark]}>
                {hasPermission === false ? 'Camera Permission Required' : 'Camera Ready'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statusContainer}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor() },
            isDarkMode && styles.statusTextDark
          ]}>
            {getStatusText()}
          </Text>
          
          {verificationStatus === 'detecting' && (
            <Text style={[styles.progressText, isDarkMode && styles.progressTextDark]}>
              Detection Progress: {detectionCount}/3
            </Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {!isCameraOn ? (
            <TouchableOpacity 
              style={styles.startButton} 
              onPress={handleStartCamera}
            >
              <Text style={styles.startButtonText}>
                Start Selfie Verification
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.stopButton} 
              onPress={handleStopCamera}
            >
              <Text style={styles.stopButtonText}>
                Stop Camera
              </Text>
            </TouchableOpacity>
          )}

          {verificationStatus === 'success' && (
            <TouchableOpacity 
              style={styles.completeButton} 
              onPress={handleComplete}
            >
              <Text style={styles.completeButtonText}>
                Complete Verification
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={[styles.infoBox, isDarkMode && styles.infoBoxDark]}>
          <Text style={[styles.infoText, isDarkMode && styles.infoTextDark]}>
            📸 Please ensure good lighting and look directly at the camera. Keep your face centered within the circle for best results.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  cameraContainer: {
    height: 300,
    marginBottom: 20,
  },
  cameraView: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  cameraViewDark: {
    backgroundColor: '#2a2a2a',
  },
  camera: {
    flex: 1,
  },
  cameraPlaceholder: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  cameraPlaceholderDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
  },
  cameraText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cameraTextDark: {
    color: '#fff',
  },
  cameraSubtext: {
    fontSize: 14,
    color: '#666',
  },
  cameraSubtextDark: {
    color: '#ccc',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  placeholderIconDark: {
    opacity: 0.7,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
  },
  placeholderTextDark: {
    color: '#ccc',
  },
  faceDetectionArea: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -75 }],
  },
  statusOverlay: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  statusOverlayText: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  statusOverlayTextDark: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  detectionCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  detectionCircleActive: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  detectionCircleSuccess: {
    borderColor: '#4CAF50',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
  },
  innerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  innerCircleActive: {
    backgroundColor: '#4CAF50',
  },
  innerCircleSuccess: {
    backgroundColor: '#4CAF50',
  },
  statusContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusTextDark: {
    color: '#fff',
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  progressTextDark: {
    color: '#ccc',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  stopButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  stopButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completeButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    borderRadius: 12,
  },
  completeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
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
  // Dark Mode Styles
  containerDark: {
    backgroundColor: '#1a1a1a',
  },
  titleDark: {
    color: '#fff',
  },
  subtitleDark: {
    color: '#ccc',
  },
  infoBoxDark: {
    backgroundColor: '#1a2332',
    borderLeftColor: '#2196F3',
  },
  infoTextDark: {
    color: '#ccc',
  },
});

export default KYCVerification;
