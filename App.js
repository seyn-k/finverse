import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, Animated, TouchableOpacity, Dimensions, ScrollView, TextInput, BackHandler, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import LoginPage from './Login';
import QuickStartGuide from './Guide';
import PanCardDetails from './PanCardDetails';
import AadharCardDetails from './AadharCardDetails';
import BankVerification from './BankVerification';
import KYCVerification from './KYCVerification';
import { styles } from './styles';

// Loading Screen Component
const LoadingScreen = ({ onLoadingComplete, isDarkMode }) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Hide loading screen after 3 seconds
    const timer = setTimeout(() => {
      onLoadingComplete();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.loadingContainer, isDarkMode && styles.loadingContainerDark]}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Image 
          source={require('./assets/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
      <StatusBar style={isDarkMode ? "light" : "light"} />
    </View>
  );
};


// Profile Screen Component
const EditProfileScreen = ({ isDarkMode, onBack, onSave, initialName, initialEmail }) => {
  const textColor = isDarkMode ? '#fff' : '#0b1220';
  const mutedColor = isDarkMode ? '#aeb4c1' : '#6b7280';
  const surface = isDarkMode ? '#111827' : '#ffffff';
  const [name, setName] = useState(initialName || '');
  const [email, setEmail] = useState(initialEmail || '');
  return (
    <View style={[styles.profileContainer, isDarkMode && styles.profileContainerDark]}>
      <View style={[styles.profileHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={styles.profileHeaderRow}>
          <TouchableOpacity onPress={onBack}><Text style={[styles.backButton, { color: '#3b82f6' }]}>←</Text></TouchableOpacity>
          <Text style={[styles.profileHeaderTitle, { color: textColor }]}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>
      </View>
      <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
          <View style={{ flex: 1 }}>
            <Text style={[styles.menuItemText, { color: mutedColor, marginBottom: 6 }]}>Display name</Text>
            <TextInput value={name} onChangeText={setName} placeholder="Enter name" placeholderTextColor={mutedColor} style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0 }]} />
          </View>
        </View>
        <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
          <View style={{ flex: 1 }}>
            <Text style={[styles.menuItemText, { color: mutedColor, marginBottom: 6 }]}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="Enter email" placeholderTextColor={mutedColor} style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0 }]} />
          </View>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={() => onSave && onSave({ name: name.trim(), email: email.trim().toLowerCase() })}>
          <Text style={styles.logoutButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const ProfileScreen = ({ isDarkMode, onBack, onLogout, displayName, onSaveDisplayName, onEditPress, onToggleDarkMode, currentLanguage, onChangeLanguage }) => {
  const [currentScreen, setCurrentScreen] = useState('account'); // account, settings, privacy, notifications, linked-banks, support
  const [notificationSettings, setNotificationSettings] = useState({
    transactionAlerts: false,
    marketingUpdates: false,
    securityAlerts: false,
    pushNotifications: false,
    emailNotifications: false,
  });
  const textColor = isDarkMode ? '#fff' : '#0b1220';
  const mutedColor = isDarkMode ? '#aeb4c1' : '#6b7280';
  const surface = isDarkMode ? '#111827' : '#ffffff';
  const cardBg = isDarkMode ? '#1f2937' : '#f4f6f9';
  const [languageDraft, setLanguageDraft] = useState(currentLanguage || 'en');
  const [accessibility, setAccessibility] = useState({ largerText: false, reduceMotion: false, highContrast: false });
  const [privacy, setPrivacy] = useState({ oldPassword: '', newPassword: '', confirmPassword: '', twoFactor: false, biometric: false, question1: '', answer1: '', recoveryEmail: '' });
  const [savedFlag, setSavedFlag] = useState('');

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (currentScreen === 'account') {
        onBack(); // Close profile screen
        return true; // Prevent default behavior
      } else {
        setCurrentScreen('account'); // Go back to account screen
        return true; // Prevent default behavior
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [currentScreen, onBack]);

  const toggleNotification = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const [nameDraft, setNameDraft] = useState(displayName || '');

  useEffect(() => {
    setNameDraft(displayName || '');
  }, [displayName]);

  const handleSave = () => {
    const trimmed = (nameDraft || '').trim();
    if (!trimmed) return;
    onSaveDisplayName && onSaveDisplayName(trimmed);
  };

  const renderAccountScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image source={require('./assets/icon.png')} style={styles.profileImage} />
        </View>
        <Text style={[styles.profileName, { color: textColor }]}>{displayName || 'User'}</Text>
        <TouchableOpacity style={styles.editProfileBtn} onPress={onEditPress}>
          <Text style={styles.editProfileText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Invite Friends */}
      <TouchableOpacity style={[styles.actionItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
        <View style={styles.actionLeft}>
          <Text style={styles.actionIcon}>+</Text>
          <Text style={[styles.actionText, { color: textColor }]}>Invite friends</Text>
        </View>
        <Text style={[styles.actionArrow, { color: mutedColor }]}>›</Text>
      </TouchableOpacity>

      {/* Account & Settings Section */}
      <View style={styles.sectionTitle}>
        <Text style={[styles.sectionTitleText, { color: textColor }]}>Account & Settings</Text>
      </View>

      {[
        { icon: '⚙️', title: 'Settings' },
        { icon: '🔗', title: 'Linked Banks' },
        { icon: '❓', title: 'Support' },
        { icon: '🛡️', title: 'Privacy & Security' },
        { icon: '🔔', title: 'Notifications' },
      ].map((item, index) => (
        <TouchableOpacity 
          key={item.title}
          style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}
          onPress={() => {
            if (item.title === 'Settings') setCurrentScreen('settings');
            else if (item.title === 'Linked Banks') setCurrentScreen('linked-banks');
            else if (item.title === 'Support') setCurrentScreen('support');
            else if (item.title === 'Privacy & Security') setCurrentScreen('privacy');
            else if (item.title === 'Notifications') setCurrentScreen('notifications');
          }}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemIcon}>{item.icon}</Text>
            <Text style={[styles.menuItemText, { color: textColor }]}>{item.title}</Text>
          </View>
          <Text style={[styles.menuItemArrow, { color: mutedColor }]}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Log out button */}
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderLanguageScreen = () => {
    const languages = [
      { code: 'en', label: 'English' },
      { code: 'hi', label: 'हिंदी' },
      { code: 'ta', label: 'தமிழ்' },
      { code: 'te', label: 'తెలుగు' },
    ];
    return (
      <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
        {languages.map((lng) => (
          <TouchableOpacity
            key={lng.code}
            style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed', justifyContent: 'space-between' }]}
            onPress={() => setLanguageDraft(lng.code)}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuItemIcon}>🌐</Text>
              <Text style={[styles.menuItemText, { color: textColor }]}>{lng.label}</Text>
            </View>
            <Text style={[styles.menuItemArrow, { color: languageDraft === lng.code ? '#3b82f6' : mutedColor }]}>{languageDraft === lng.code ? '●' : '○'}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => {
            onChangeLanguage && onChangeLanguage(languageDraft);
            setCurrentScreen('settings');
          }}
        >
          <Text style={styles.logoutButtonText}>Save</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const renderSettingsScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      {[
        { icon: '☀️', title: 'Display', action: () => setCurrentScreen('display') },
        { icon: '🌐', title: 'Language', action: () => setCurrentScreen('language') },
        { icon: '👤', title: 'Accessibility', action: () => setCurrentScreen('accessibility') },
        { icon: '🔔', title: 'Notifications', action: () => setCurrentScreen('notifications') },
      ].map((item) => (
        <TouchableOpacity 
          key={item.title}
          style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}
          onPress={item.action}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemIcon}>{item.icon}</Text>
            <Text style={[styles.menuItemText, { color: textColor }]}>{item.title}</Text>
          </View>
          <Text style={[styles.menuItemArrow, { color: mutedColor }]}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDisplayScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={styles.menuItemLeft}>
          <Text style={styles.menuItemIcon}>🌙</Text>
          <Text style={[styles.menuItemText, { color: textColor }]}>Dark Mode</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleSwitch, isDarkMode && styles.toggleSwitchOn]} 
          onPress={onToggleDarkMode}
        >
          <View style={[styles.toggleKnob, isDarkMode && styles.toggleKnobOn]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderAccessibilityScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      {[{ key: 'largerText', icon: '🔤', title: 'Larger Text' }, { key: 'reduceMotion', icon: '🎞️', title: 'Reduce Motion' }, { key: 'highContrast', icon: '🎯', title: 'High Contrast' }].map((item) => (
        <View key={item.key} style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemIcon}>{item.icon}</Text>
            <Text style={[styles.menuItemText, { color: textColor }]}>{item.title}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.toggleSwitch, accessibility[item.key] && styles.toggleSwitchOn]} 
            onPress={() => setAccessibility((p) => ({ ...p, [item.key]: !p[item.key] }))}
          >
            <View style={[styles.toggleKnob, accessibility[item.key] && styles.toggleKnobOn]} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setSavedFlag('access');
          setTimeout(() => setSavedFlag(''), 1200);
        }}
      >
        <Text style={styles.logoutButtonText}>{savedFlag === 'access' ? 'Saved' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPrivacyScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      {[
        { icon: '🔒', title: 'Change Password', action: () => setCurrentScreen('privacy-change-password') },
        { icon: '🛡️', title: 'Two-Factor Authentication', action: () => setCurrentScreen('privacy-two-factor') },
        { icon: '👆', title: 'Biometric Login', action: () => setCurrentScreen('privacy-biometric') },
        { icon: '❓', title: 'Security Questions', action: () => setCurrentScreen('privacy-security-questions') },
        { icon: '🔑', title: 'Account Recovery', action: () => setCurrentScreen('privacy-account-recovery') },
        { icon: '📄', title: 'Privacy Policy', action: () => setCurrentScreen('privacy-policy') },
        { icon: '📄', title: 'Terms of Service', action: () => setCurrentScreen('privacy-terms') },
      ].map((item) => (
        <TouchableOpacity 
          key={item.title}
          style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}
          onPress={item.action}
        >
          <View style={styles.menuItemLeft}>
            <Text style={styles.menuItemIcon}>{item.icon}</Text>
            <Text style={[styles.menuItemText, { color: textColor }]}>{item.title}</Text>
          </View>
          <Text style={[styles.menuItemArrow, { color: mutedColor }]}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPrivacyChangePassword = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemText, { color: textColor }]}>Change Password</Text>
          <TextInput value={privacy.oldPassword} onChangeText={(t) => setPrivacy((p) => ({ ...p, oldPassword: t }))} placeholder="Current password" placeholderTextColor={mutedColor} secureTextEntry style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
          <TextInput value={privacy.newPassword} onChangeText={(t) => setPrivacy((p) => ({ ...p, newPassword: t }))} placeholder="New password" placeholderTextColor={mutedColor} secureTextEntry style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
          <TextInput value={privacy.confirmPassword} onChangeText={(t) => setPrivacy((p) => ({ ...p, confirmPassword: t }))} placeholder="Confirm new password" placeholderTextColor={mutedColor} secureTextEntry style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          const ok = privacy.newPassword && privacy.newPassword.length >= 6 && privacy.newPassword === privacy.confirmPassword;
          if (ok) {
            setPrivacy((p) => ({ ...p, oldPassword: '', newPassword: '', confirmPassword: '' }));
            setSavedFlag('pwd');
            setTimeout(() => setSavedFlag(''), 1200);
          }
        }}
      >
        <Text style={styles.logoutButtonText}>{savedFlag === 'pwd' ? 'Saved' : 'Save Password'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPrivacyTwoFactor = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={styles.menuItemLeft}>
          <Text style={styles.menuItemIcon}>🛡️</Text>
          <Text style={[styles.menuItemText, { color: textColor }]}>Two-Factor Authentication</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleSwitch, privacy.twoFactor && styles.toggleSwitchOn]} 
          onPress={() => setPrivacy((p) => ({ ...p, twoFactor: !p.twoFactor }))}
        >
          <View style={[styles.toggleKnob, privacy.twoFactor && styles.toggleKnobOn]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPrivacyBiometric = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={styles.menuItemLeft}>
          <Text style={styles.menuItemIcon}>👆</Text>
          <Text style={[styles.menuItemText, { color: textColor }]}>Biometric Login</Text>
        </View>
        <TouchableOpacity 
          style={[styles.toggleSwitch, privacy.biometric && styles.toggleSwitchOn]} 
          onPress={() => setPrivacy((p) => ({ ...p, biometric: !p.biometric }))}
        >
          <View style={[styles.toggleKnob, privacy.biometric && styles.toggleKnobOn]} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderPrivacySecurityQuestions = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemText, { color: textColor }]}>Security Question</Text>
          <TextInput value={privacy.question1} onChangeText={(t) => setPrivacy((p) => ({ ...p, question1: t }))} placeholder="Question" placeholderTextColor={mutedColor} style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
          <TextInput value={privacy.answer1} onChangeText={(t) => setPrivacy((p) => ({ ...p, answer1: t }))} placeholder="Answer" placeholderTextColor={mutedColor} style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setSavedFlag('sq');
          setTimeout(() => setSavedFlag(''), 1200);
        }}
      >
        <Text style={styles.logoutButtonText}>{savedFlag === 'sq' ? 'Saved' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPrivacyAccountRecovery = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemText, { color: textColor }]}>Account Recovery</Text>
          <TextInput value={privacy.recoveryEmail} onChangeText={(t) => setPrivacy((p) => ({ ...p, recoveryEmail: t }))} placeholder="Recovery email" placeholderTextColor={mutedColor} keyboardType="email-address" autoCapitalize="none" style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]} />
        </View>
      </View>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          setSavedFlag('ar');
          setTimeout(() => setSavedFlag(''), 1200);
        }}
      >
        <Text style={styles.logoutButtonText}>{savedFlag === 'ar' ? 'Saved' : 'Save'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderPrivacyPolicy = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemText, { color: textColor }]}>Privacy Policy</Text>
          <Text style={{ color: mutedColor, marginTop: 6 }}>Our privacy practices and how we handle your data.</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderPrivacyTerms = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuItemText, { color: textColor }]}>Terms of Service</Text>
          <Text style={{ color: mutedColor, marginTop: 6 }}>Terms and conditions of using the app.</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderNotificationsScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.notificationSection}>
        <Text style={[styles.notificationSectionTitle, { color: textColor }]}>Notification Types</Text>
        
        {[
          { icon: '🔔', title: 'Transaction Alerts', description: 'Receive real-time updates on your account activity.', key: 'transactionAlerts' },
          { icon: '📢', title: 'Marketing Updates', description: 'Stay informed about new features, promotions, and offers.', key: 'marketingUpdates' },
          { icon: '🛡️', title: 'Security Alerts', description: 'Get immediate notifications about potential security issues.', key: 'securityAlerts' },
        ].map((item, index) => (
          <View key={item.title} style={[styles.notificationItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
            <View style={styles.notificationItemLeft}>
              <Text style={styles.notificationItemIcon}>{item.icon}</Text>
              <View style={styles.notificationItemText}>
                <Text style={[styles.notificationItemTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.notificationItemDescription, { color: mutedColor }]}>{item.description}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.toggleSwitch, notificationSettings[item.key] && styles.toggleSwitchOn]} 
              onPress={() => toggleNotification(item.key)}
            >
              <View style={[styles.toggleKnob, notificationSettings[item.key] && styles.toggleKnobOn]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.notificationSection}>
        <Text style={[styles.notificationSectionTitle, { color: textColor }]}>Delivery Methods</Text>
        
        {[
          { icon: '📱', title: 'Push Notifications', description: 'Receive alerts directly on your device.', key: 'pushNotifications' },
          { icon: '📧', title: 'Email Notifications', description: 'Get notifications delivered to your email inbox.', key: 'emailNotifications' },
        ].map((item, index) => (
          <View key={item.title} style={[styles.notificationItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
            <View style={styles.notificationItemLeft}>
              <Text style={styles.notificationItemIcon}>{item.icon}</Text>
              <View style={styles.notificationItemText}>
                <Text style={[styles.notificationItemTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.notificationItemDescription, { color: mutedColor }]}>{item.description}</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={[styles.toggleSwitch, notificationSettings[item.key] && styles.toggleSwitchOn]} 
              onPress={() => toggleNotification(item.key)}
            >
              <View style={[styles.toggleKnob, notificationSettings[item.key] && styles.toggleKnobOn]} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderLinkedBanksScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.bankAccountCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
        <View style={styles.bankAccountLeft}>
          <Text style={styles.bankIcon}>🏦</Text>
          <View style={styles.bankAccountInfo}>
            <Text style={[styles.bankName, { color: textColor }]}>Bank of Baroda</Text>
            <Text style={[styles.bankAccountNumber, { color: mutedColor }]}>1097...1234</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.addAccountButton}>
        <Text style={styles.addAccountButtonText}>Add account</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderSupportScreen = () => (
    <ScrollView style={styles.profileContent} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.supportSection}>
        <Text style={[styles.supportSectionTitle, { color: textColor }]}>Help Center</Text>
        <TouchableOpacity style={[styles.supportItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
          <View style={styles.supportItemLeft}>
            <Text style={styles.supportItemIcon}>❓</Text>
            <View style={styles.supportItemText}>
              <Text style={[styles.supportItemTitle, { color: textColor }]}>Browse FAQs</Text>
              <Text style={[styles.supportItemDescription, { color: mutedColor }]}>Find answers to common questions</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.supportSection}>
        <Text style={[styles.supportSectionTitle, { color: textColor }]}>Contact Us</Text>
        {[
          { icon: '💬', title: 'Chat with us', description: 'Get help in real-time' },
          { icon: '📧', title: 'Email support', description: 'Email us for assistance' },
          { icon: '📞', title: 'Phone support', description: 'Call us for immediate help' },
        ].map((item, index) => (
          <TouchableOpacity key={item.title} style={[styles.supportItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
            <View style={styles.supportItemLeft}>
              <Text style={styles.supportItemIcon}>{item.icon}</Text>
              <View style={styles.supportItemText}>
                <Text style={[styles.supportItemTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.supportItemDescription, { color: mutedColor }]}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.supportSection}>
        <Text style={[styles.supportSectionTitle, { color: textColor }]}>Other</Text>
        {[
          { icon: '🎯', title: 'Report an issue', description: 'Report a problem or bug' },
          { icon: '📄', title: 'Submit a request', description: 'Submit a support request' },
        ].map((item, index) => (
          <TouchableOpacity key={item.title} style={[styles.supportItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
            <View style={styles.supportItemLeft}>
              <Text style={styles.supportItemIcon}>{item.icon}</Text>
              <View style={styles.supportItemText}>
                <Text style={[styles.supportItemTitle, { color: textColor }]}>{item.title}</Text>
                <Text style={[styles.supportItemDescription, { color: mutedColor }]}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'account': return 'Account';
      case 'settings': return 'Settings';
      case 'display': return 'Display';
      case 'language': return 'Language';
      case 'accessibility': return 'Accessibility';
      case 'privacy': return 'Privacy & Security';
      case 'privacy-change-password': return 'Change Password';
      case 'privacy-two-factor': return 'Two-Factor Authentication';
      case 'privacy-biometric': return 'Biometric Login';
      case 'privacy-security-questions': return 'Security Questions';
      case 'privacy-account-recovery': return 'Account Recovery';
      case 'privacy-policy': return 'Privacy Policy';
      case 'privacy-terms': return 'Terms of Service';
      case 'notifications': return 'Notification';
      case 'linked-banks': return 'Linked Banks';
      case 'support': return 'Support';
      default: return 'Account';
    }
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'account': return renderAccountScreen();
      case 'settings': return renderSettingsScreen();
      case 'display': return renderDisplayScreen();
      case 'language': return renderLanguageScreen();
      case 'accessibility': return renderAccessibilityScreen();
      case 'privacy': return renderPrivacyScreen();
      case 'privacy-change-password': return renderPrivacyChangePassword();
      case 'privacy-two-factor': return renderPrivacyTwoFactor();
      case 'privacy-biometric': return renderPrivacyBiometric();
      case 'privacy-security-questions': return renderPrivacySecurityQuestions();
      case 'privacy-account-recovery': return renderPrivacyAccountRecovery();
      case 'privacy-policy': return renderPrivacyPolicy();
      case 'privacy-terms': return renderPrivacyTerms();
      case 'notifications': return renderNotificationsScreen();
      case 'linked-banks': return renderLinkedBanksScreen();
      case 'support': return renderSupportScreen();
      default: return renderAccountScreen();
    }
  };

  return (
    <View style={[styles.profileContainer, isDarkMode && styles.profileContainerDark]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      {/* Header */}
      <View style={[styles.profileHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
        <View style={styles.profileHeaderRow}>
          <TouchableOpacity onPress={currentScreen === 'account' ? onBack : () => setCurrentScreen('account')}>
            <Text style={[styles.backButton, { color: '#3b82f6' }]}>
              {currentScreen === 'account' ? '←' : '←'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.profileHeaderTitle, { color: textColor }]}>{getScreenTitle()}</Text>
          <TouchableOpacity onPress={onBack}>
            <Text style={[styles.closeButton, { color: textColor }]}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>

      {renderCurrentScreen()}
    </View>
  );
};

// Homepage Component
const HomePage = ({ showGuide, onGuideComplete, isDarkMode, onToggleDarkMode, onLogout, displayName, profileEmail, onEditProfile, onOpenProfile, showEditProfile, onOpenEditProfile, onCloseEditProfile, onSaveProfile, currentLanguage, onChangeLanguage }) => {
  if (showGuide) {
    return <QuickStartGuide onComplete={onGuideComplete} isDarkMode={isDarkMode} />;
  }

  const textColor = isDarkMode ? '#fff' : '#0b1220';
  const mutedColor = isDarkMode ? '#aeb4c1' : '#6b7280';
  const cardBg = isDarkMode ? '#1f2937' : '#f4f6f9';
  const surface = isDarkMode ? '#111827' : '#ffffff';
  const [activeTopTab, setActiveTopTab] = useState(0); // 0 Stocks, 1 Mutual Funds, 2 Gold, 3 ETFs, 4 Coins
  const [activeSegment, setActiveSegment] = useState(0); // 0 Investor, 1 Trader, 2 Finance
  const [bottomActive, setBottomActive] = useState(0); // 0 Home, 1 Portfolio, 2 Payments
  const [showMoneyTransactionPage, setShowMoneyTransactionPage] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPayContactPage, setShowPayContactPage] = useState(false);
  const [contacts] = useState([
    { name: 'Ashish', avatar: '👤', color: '#32CD32' },
    { name: 'Abi', avatar: '👤', color: '#FFD700' },
    { name: 'Aditi', avatar: '👤', color: '#7c4dff' },
    { name: 'Rohan', avatar: '👤', color: '#ef4444' },
    { name: 'Neha', avatar: '👤', color: '#16a34a' },
  ]);
  const [searchContact, setSearchContact] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [payNote, setPayNote] = useState('');
  const [paySuccess, setPaySuccess] = useState(false);

  // Handle Android back button for HomePage
  useEffect(() => {
    const backAction = () => {
      if (showMoneyTransactionPage) {
        setShowMoneyTransactionPage(false);
        return true; // Prevent default behavior
      }
      if (showProfile) {
        setShowProfile(false);
        return true; // Prevent default behavior
      }
      return false; // Allow default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [showMoneyTransactionPage, showProfile, showPayContactPage]);

  useEffect(() => {
    const backAction = () => {
      if (showPayContactPage) {
        setShowPayContactPage(false);
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [showPayContactPage]);

  const welcomeWord = (
    currentLanguage === 'hi' ? 'स्वागत है' :
    currentLanguage === 'ta' ? 'வரவேற்கிறோம்' :
    currentLanguage === 'te' ? 'స్వాగతం' :
    'Welcome'
  );

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />

      {/* Top welcome header - hidden on payments page */}
      {bottomActive !== 2 && (
        <View style={[styles.homeHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
          {bottomActive === 1 && (
            <View style={styles.titleRow}>
              <Text style={[styles.pageTitle, { color: textColor }]}>Portfolio</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.qrBtn}>
                  <Text style={[styles.qrIcon, { color: textColor }]}>⌁</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.avatarWrap} onPress={() => setShowProfile(true)}>
              <Image source={require('./assets/icon.png')} style={styles.avatar} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={[styles.welcomeTiny, { color: mutedColor }]}>{welcomeWord} {displayName || 'User'}</Text>
              <Text style={[styles.userName, { color: textColor }]}>{displayName || 'User'}</Text>
              <Text style={[styles.portfolioTiny, { color: mutedColor }]}>Portfolio Value</Text>
              <Text style={[styles.portfolioValue, { color: textColor }]}>$17,457.00</Text>
            </View>
            {bottomActive !== 1 && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={styles.qrBtn}>
                  <Text style={[styles.qrIcon, { color: textColor }]}>⌁</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                  <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Segmented buttons */}
          <View style={styles.segmentRow}>
            { (bottomActive === 1 ? ['Investment','Trade','Finance'] : ['Invester','Trader','Finance']).map((label, idx) => (
              <TouchableOpacity key={label} onPress={() => setActiveSegment(idx)} style={[styles.segmentBtn, activeSegment === idx && styles.segmentActive]}> 
                <Text style={[activeSegment === idx ? styles.segmentActiveText : styles.segmentText, activeSegment !== idx && { color: textColor } ]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {showPayContactPage && (
        <View style={[styles.moneyTransactionPage, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
          <View style={[styles.moneyTransactionHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
            <TouchableOpacity onPress={() => setShowPayContactPage(false)}>
              <Text style={[styles.backButton, { color: '#3b82f6' }]}>← Back</Text>
            </TouchableOpacity>
            <Text style={[styles.moneyTransactionPageTitle, { color: textColor }]}>Pay Contact</Text>
            <View style={{ width: 50 }} />
          </View>

          <ScrollView style={styles.moneyTransactionContent} contentContainerStyle={{ paddingBottom: 100 }}>
            <View style={[styles.searchWrap, { backgroundColor: cardBg, marginTop: 12 }]}> 
              <Text style={styles.searchIcon}>🔎</Text>
              <TextInput 
                value={searchContact}
                onChangeText={setSearchContact}
                placeholder="Search contacts"
                placeholderTextColor={mutedColor}
                style={[styles.searchInput, { color: textColor }]}
              />
            </View>

            <View style={{ marginTop: 10 }}>
              {(contacts || [])
                .filter(c => !searchContact || c.name.toLowerCase().includes(searchContact.toLowerCase()))
                .map((c) => (
                  <TouchableOpacity
                    key={c.name}
                    style={[styles.transactionRow, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}
                    onPress={() => setSelectedContact(c)}
                  >
                    <View style={[styles.transactionAvatar, { backgroundColor: c.color }]}>
                      <Text style={styles.transactionAvatarText}>{c.avatar}</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionName, { color: textColor }]}>{c.name}</Text>
                      <Text style={[styles.transactionTime, { color: mutedColor }]}>{selectedContact?.name === c.name ? 'Selected' : 'Tap to select'}</Text>
                    </View>
                    <Text style={[styles.transactionAmount, { color: selectedContact?.name === c.name ? '#3b82f6' : mutedColor }]}>{selectedContact?.name === c.name ? '✓' : ''}</Text>
                  </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed', marginTop: 10 }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuItemText, { color: textColor }]}>Amount</Text>
                <TextInput
                  value={payAmount}
                  onChangeText={setPayAmount}
                  placeholder="$0.00"
                  placeholderTextColor={mutedColor}
                  keyboardType="numeric"
                  style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]}
                />
              </View>
            </View>
            <View style={[styles.menuItem, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}> 
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuItemText, { color: textColor }]}>Note (optional)</Text>
                <TextInput
                  value={payNote}
                  onChangeText={setPayNote}
                  placeholder="What is this for?"
                  placeholderTextColor={mutedColor}
                  style={[styles.searchInput, { color: textColor, backgroundColor: 'transparent', paddingHorizontal: 0, marginTop: 6 }]}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.logoutButton, { opacity: selectedContact && payAmount ? 1 : 0.6 }]}
              disabled={!selectedContact || !payAmount}
              onPress={() => {
                setPaySuccess(true);
                setTimeout(() => {
                  setPaySuccess(false);
                  setShowPayContactPage(false);
                  setSelectedContact(null);
                  setPayAmount('');
                  setPayNote('');
                }, 1200);
              }}
            >
              <Text style={styles.logoutButtonText}>{paySuccess ? 'Sent' : 'Send'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Payment page header - only visible on payments page */}
      {bottomActive === 2 && (
        <View style={[styles.paymentHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
          <View style={styles.paymentHeaderRow}>
            <View style={styles.paymentHeaderLeft}>
              <View style={styles.paymentProfilePic}>
                <Image source={require('./assets/icon.png')} style={styles.paymentProfileImage} />
              </View>
              <Text style={[styles.paymentTitle, { color: textColor }]}>Payment</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity style={styles.qrBtn}>
                <Text style={[styles.qrIcon, { color: textColor }]}>⌁</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Top tabs - hidden on payments page */}
        {bottomActive !== 2 && (
          <View style={styles.topTabsRow}>
            {['Stocks','Mutual Funds','Gold','ETFs','Coins'].map((t, idx) => (
              <TouchableOpacity key={t} onPress={() => setActiveTopTab(idx)} style={[styles.topTab, activeTopTab === idx && styles.topTabActive]}>
                <Text style={[styles.topTabText, activeTopTab === idx ? styles.topTabTextActive : { color: mutedColor }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Search - hidden on payments page */}
        {bottomActive !== 2 && (
          <View style={[styles.searchWrap, { backgroundColor: cardBg }]}>
            <Text style={styles.searchIcon}>🔎</Text>
            <TextInput 
              placeholder={activeTopTab === 1 ? 'Search Funds' : activeTopTab === 2 ? 'Search Gold' : activeTopTab === 3 ? 'Search ETFs' : activeTopTab === 4 ? 'Search Coins' : 'Search stocks'} 
              placeholderTextColor={mutedColor} 
              style={[styles.searchInput, { color: textColor }]} 
            />
          </View>
        )}

        {/* Sub tabs - hidden on payments page */}
        {bottomActive !== 2 && (
          <View style={styles.subTabsRow}>
            {['Explore','Holdings','Watchlist'].map((t, idx) => (
              <TouchableOpacity key={t} style={styles.subTab}>
                <Text style={[styles.subTabText, idx === 0 ? styles.subTabTextActive : { color: mutedColor }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Content switches by bottom tab and top tab */}
        {bottomActive === 1 && (
          <>
            {/* Portfolio header summary cards */}
            <View style={styles.summaryRow}>
              <View style={[styles.summaryCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                <Text style={[styles.summaryValue, { color: textColor }]}>$10,457.00</Text>
                <Text style={[styles.summaryLabel, { color: mutedColor }]}>{activeSegment === 1 ? 'Available Margin' : 'Total invested'}</Text>
              </View>
              <View style={[styles.summaryCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                <Text style={[styles.summaryGain, { color: '#16a34a' }]}>{activeSegment === 1 ? '+$42.55' : '+$567.89'}</Text>
                <Text style={[styles.summaryLabel, { color: mutedColor }]}>{activeSegment === 1 ? "Today's P&L" : "Today's return"}</Text>
              </View>
            </View>

            {/* Middle card varies by segment */}
            <View style={[styles.panelCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
              <View style={styles.panelHeaderRow}>
                <Text style={[styles.panelTitle, { color: textColor }]}>{activeSegment === 1 ? 'Your Positions' : 'Your Portfolio'}</Text>
                <View style={styles.miniTabRow}>
                  {(activeSegment === 1
                    ? ['F&O','Commodities','Gold']
                    : ['Stocks','Mutual funds','Gold']
                  ).map((t, i) => (
                    <View key={t} style={[styles.miniTab, i === 0 && styles.miniTabActive]}>
                      <Text style={[styles.miniTabText, i === 0 ? styles.miniTabTextActive : { color: mutedColor }]}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.panelBodyRow}>
                <Text style={[styles.portfolioBig, { color: textColor }]}>{activeSegment === 1 ? '$ 2880' : '$ 1,500'}</Text>
                <Text style={styles.greenPct}>+4.2%</Text>
              </View>
              <TouchableOpacity>
                <Text style={[styles.viewAll, { color: '#3b82f6', marginTop: 6 }]}>{activeSegment === 1 ? 'View all positions →' : 'View investments →'}</Text>
              </TouchableOpacity>
            </View>

            {/* Lower cards */}
            {activeSegment === 0 && (
              <View style={[styles.panelCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                <Text style={[styles.panelTitle, { color: textColor }]}>Insurance Summary</Text>
                <Text style={[styles.insSummary, { color: textColor }]}><Text style={{ fontWeight: '700' }}>2 Policies Linked</Text>   <Text style={{ color: '#16a34a' }}>● Active</Text>    <Text style={{ color: '#ef4444' }}>● 1 Expiring soon</Text></Text>
                <TouchableOpacity style={{ marginTop: 6 }}>
                  <Text style={[styles.viewAll, { color: '#3b82f6' }]}>Manage plans →</Text>
                </TouchableOpacity>
              </View>
            )}

            {activeSegment === 1 && (
              <View style={[styles.panelCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                <Text style={[styles.panelTitle, { color: textColor }]}>Recent Trades</Text>
                {[
                  { name: 'EUR/USD', date: 'Apr 30', pnl: '+450' },
                  { name: 'Gold', date: 'Apr 29', pnl: '-1250' },
                ].map((t) => (
                  <View key={t.name} style={styles.tradeRow}>
                    <Text style={[styles.tradeName, { color: textColor }]}>{t.name}</Text>
                    <Text style={[styles.tradeDate, { color: mutedColor }]}>{t.date}</Text>
                    <Text style={[styles.tradePnl, { color: t.pnl.startsWith('-') ? '#ef4444' : '#16a34a' }]}>{t.pnl}</Text>
                  </View>
                ))}
                <TouchableOpacity style={{ marginTop: 4 }}>
                  <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.panelCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
              <Text style={[styles.panelTitle, { color: textColor }]}>Recent Activity</Text>
              {[
                { name: 'Stocks', date: 'Apr 26', amount: '-1200' },
                { name: 'Stocks', date: 'Apr 25', amount: '+8250' },
              ].map((a) => (
                <View key={`${a.name}-${a.date}`} style={styles.activityRow}>
                  <Text style={[styles.activityName, { color: textColor }]}>{a.name}</Text>
                  <Text style={[styles.activityDate, { color: mutedColor }]}>{a.date}</Text>
                  <Text style={[styles.activityAmount, { color: a.amount.startsWith('-') ? '#ef4444' : '#16a34a' }]}>{a.amount}</Text>
                </View>
              ))}
              <TouchableOpacity style={{ marginTop: 4 }}>
                <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {activeSegment !== 2 && activeTopTab !== 1 && activeTopTab !== 2 && activeTopTab !== 3 && activeTopTab !== 4 && bottomActive !== 2 && (
          <>
            {/* Market Indices */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Market Indices</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardList}>
              {[
                { name: 'NIFTY 50', value: '17,500' },
                { name: 'Sensex', value: '59,000' },
              ].map((i) => (
                <View key={i.name} style={[styles.indexCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                  <View style={[styles.iconSquare, { backgroundColor: cardBg }]} />
                  <View style={styles.indexTextWrap}>
                    <Text style={[styles.indexName, { color: textColor }]}>{i.name}</Text>
                    <Text style={[styles.indexSub, { color: '#3b82f6' }]}>Current Value</Text>
                  </View>
                  <Text style={[styles.indexValue, { color: textColor }]}>{i.value}</Text>
                </View>
              ))}
            </View>

            {/* Current Holdings */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Current Holdings</Text>
              <TouchableOpacity>
                <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.cardList}>
              {[
                { name: 'TechCorp Inc.', shares: '10 Shares', price: '$1,234.56' },
                { name: 'Global Energy Ltd.', shares: '5 Shares', price: '$678.90' },
                { name: 'Health Solutions Co.', shares: '20 Shares', price: '$3,456.78' },
              ].map((h) => (
                <View key={h.name} style={[styles.holdingCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                  <View style={[styles.holdingIcon, { backgroundColor: cardBg }]} />
                  <View style={styles.holdingTextWrap}>
                    <Text style={[styles.holdingName, { color: textColor }]}>{h.name}</Text>
                    <Text style={[styles.holdingSub, { color: mutedColor }]}>{h.shares}</Text>
                  </View>
                  <Text style={[styles.holdingValue, { color: textColor }]}>{h.price}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {activeSegment !== 2 && activeTopTab === 1 && bottomActive !== 2 && (
          <>
            {/* Market Indices for Mutual Funds */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Market Indices</Text>
            </View>
            <View style={styles.cardList}>
              {[
                { name: 'NIFTY 50', value: '17,500' },
                { name: 'Sensex', value: '59,000' },
              ].map((i) => (
                <View key={i.name} style={[styles.indexCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                  <View style={[styles.iconSquare, { backgroundColor: cardBg }]} />
                  <View style={styles.indexTextWrap}>
                    <Text style={[styles.indexName, { color: textColor }]}>{i.name}</Text>
                    <Text style={[styles.indexSub, { color: '#3b82f6' }]}>Current Value</Text>
                  </View>
                  <Text style={[styles.indexValue, { color: textColor }]}>{i.value}</Text>
                </View>
              ))}
            </View>

            {/* All Mutual Funds with filters */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>All Mutual Funds</Text>
            </View>
            <View style={styles.filterRow}>
              {['Fund Type','Performance','Risk Level'].map((c, idx) => (
                <View key={c} style={[styles.chip, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                  <Text style={[styles.chipText, { color: textColor }]}>{c}</Text>
                  <Text style={[styles.chipArrow, { color: mutedColor }]}>▾</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.metaTiny, { color: mutedColor }]}>1300 funds</Text>

            {[
              { name: 'Growth Opportunities', manager: 'Fidelity', ret: '33.66%' },
              { name: 'Balanced Growth Fund', manager: 'Vanguard', ret: '22.45%' },
              { name: 'Income Plus Fund', manager: 'BlackRock', ret: '22.55%' },
            ].map((f) => (
              <View key={f.name} style={[styles.fundRow, { borderColor: isDarkMode ? '#222' : '#eef0f4', backgroundColor: surface }]}>
                <View style={[styles.fundIcon, { backgroundColor: cardBg }]} />
                <View style={styles.fundTextWrap}>
                  <Text style={[styles.fundName, { color: textColor }]}>{f.name}</Text>
                  <Text style={[styles.fundManager, { color: mutedColor }]}>Managed by {f.manager}</Text>
                </View>
                <Text style={[styles.fundReturn, { color: textColor }]}>{f.ret}</Text>
              </View>
            ))}
            <View style={{ alignItems: 'center', marginTop: 4 }}>
              <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
            </View>
          </>
        )}

        {activeSegment !== 2 && activeTopTab === 2 && bottomActive !== 2 && (
          <>
            {/* Gold Funds */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>GOLD Funds</Text>
                <Text style={[styles.metaTiny, { color: mutedColor }]}>13 funds</Text>
              </View>
              <Text style={[styles.filterIcon, { color: mutedColor }]}>⚙︎</Text>
            </View>

            {[
              { name: 'ICICI Prudential Regular', manager: 'ICICI', ret: '33.66%' },
              { name: 'HDFC GOLD ETF Fund', manager: 'HDFC', ret: '22.55%' },
              { name: 'SBI GOLD', manager: 'SBI', ret: '22.55%' },
            ].map((f) => (
              <View key={f.name} style={[styles.fundRow, { borderColor: isDarkMode ? '#222' : '#eef0f4', backgroundColor: surface }]}>
                <View style={[styles.fundIcon, { backgroundColor: cardBg }]} />
                <View style={styles.fundTextWrap}>
                  <Text style={[styles.fundName, { color: textColor }]}>{f.name}</Text>
                  <Text style={[styles.fundManager, { color: mutedColor }]}>{f.manager}</Text>
                </View>
                <Text style={[styles.fundReturn, { color: textColor }]}>{f.ret}</Text>
              </View>
            ))}
            <View style={{ alignItems: 'center', marginTop: 4, marginBottom: 10 }}>
              <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
            </View>

            {/* Gold ETFs */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>GOLD ETFs</Text>
                <Text style={[styles.metaTiny, { color: mutedColor }]}>9 ETFs</Text>
              </View>
              <Text style={[styles.filterIcon, { color: mutedColor }]}>⚙︎</Text>
            </View>

            {[
              { name: 'NIP IND ETF GOLD', manager: 'NIP', ret: '33.66%' },
              { name: 'HDFC GOOD ETF', manager: 'HDFC', ret: '22.55%' },
              { name: 'SBI ETF GOLD', manager: 'SBI', ret: '22.55%' },
            ].map((f) => (
              <View key={f.name} style={[styles.fundRow, { borderColor: isDarkMode ? '#222' : '#eef0f4', backgroundColor: surface }]}>
                <View style={[styles.fundIcon, { backgroundColor: cardBg }]} />
                <View style={styles.fundTextWrap}>
                  <Text style={[styles.fundName, { color: textColor }]}>{f.name}</Text>
                  <Text style={[styles.fundManager, { color: mutedColor }]}>{f.manager}</Text>
                </View>
                <Text style={[styles.fundReturn, { color: textColor }]}>{f.ret}</Text>
              </View>
            ))}
            <View style={{ alignItems: 'center', marginTop: 4 }}>
              <Text style={[styles.viewAll, { color: '#3b82f6' }]}>View All →</Text>
            </View>
          </>
        )}

        {activeSegment !== 2 && activeTopTab === 3 && bottomActive !== 2 && (
          <>
            {/* ETFs Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>Market Indices</Text>
            </View>
            <View style={styles.cardList}>
              {[
                { name: 'NIFTY 50 ETF', value: '17,500' },
                { name: 'Sensex ETF', value: '59,000' },
              ].map((i) => (
                <View key={i.name} style={[styles.indexCard, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                  <View style={[styles.iconSquare, { backgroundColor: cardBg }]} />
                  <View style={styles.indexTextWrap}>
                    <Text style={[styles.indexName, { color: textColor }]}>{i.name}</Text>
                    <Text style={[styles.indexSub, { color: '#3b82f6' }]}>Current Value</Text>
                  </View>
                  <Text style={[styles.indexValue, { color: textColor }]}>{i.value}</Text>
                </View>
              ))}
            </View>

            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>All ETFs</Text>
            </View>
            <View style={styles.filterRow}>
              {['All','NSE indices','Govt'].map((c) => (
                <View key={c} style={[styles.chip, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                  <Text style={[styles.chipText, { color: textColor }]}>{c}</Text>
                </View>
              ))}
            </View>
            <Text style={[styles.metaTiny, { color: mutedColor }]}>1,200+ ETFs</Text>

            {[
              { name: 'Nippon India ETF Gold', manager: 'ETF', ret: '33.66%' },
              { name: 'CPSE ETF', manager: 'ETF', ret: '22.45%' },
              { name: 'SBI ETF sensex', manager: 'ETF', ret: '22.55%' },
            ].map((f) => (
              <View key={f.name} style={[styles.fundRow, { borderColor: isDarkMode ? '#222' : '#eef0f4', backgroundColor: surface }]}>
                <View style={[styles.fundIcon, { backgroundColor: cardBg }]} />
                <View style={styles.fundTextWrap}>
                  <Text style={[styles.fundName, { color: textColor }]}>{f.name}</Text>
                  <Text style={[styles.fundManager, { color: mutedColor }]}>{f.manager}</Text>
                </View>
                <Text style={[styles.fundReturn, { color: textColor }]}>{f.ret}</Text>
              </View>
            ))}
          </>
        )}

        {activeSegment !== 2 && activeTopTab === 4 && bottomActive !== 2 && (
          <>
            {/* Coins Section */}
            <View style={styles.sectionHeaderRow}>
              <Text style={[styles.sectionTitle, { color: textColor }]}>All Coins</Text>
            </View>
            <View style={styles.filterRow}>
              {['Market Cap','Price','24H Change'].map((c) => (
                <View key={c} style={[styles.chip, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
                  <Text style={[styles.chipText, { color: textColor }]}>{c}</Text>
                  {c === '24H Change' && <Text style={[styles.chipArrow, { color: mutedColor }]}>▾</Text>}
                </View>
              ))}
            </View>
            <Text style={[styles.metaTiny, { color: mutedColor }]}>1,230+ coins</Text>

            {[
              { name: 'BNB', ticker: 'BNB', ret: '33.66%' },
              { name: 'Bitcoin', ticker: 'BTC', ret: '22.45%' },
              { name: 'Ethereum', ticker: 'ETH', ret: '22.55%' },
              { name: 'Solana', ticker: 'SOL', ret: '22.55%' },
              { name: 'Pepe', ticker: 'PEPE', ret: '22.55%' },
              { name: 'Dogecoin', ticker: 'DOGE', ret: '22.55%' },
            ].map((c) => (
              <View key={c.name} style={[styles.fundRow, { borderColor: isDarkMode ? '#222' : '#eef0f4', backgroundColor: surface }]}>
                <View style={[styles.fundIcon, { backgroundColor: cardBg }]} />
                <View style={styles.fundTextWrap}>
                  <Text style={[styles.fundName, { color: textColor }]}>{c.name}</Text>
                  <Text style={[styles.fundManager, { color: mutedColor }]}>{c.ticker}</Text>
                </View>
                <Text style={[styles.fundReturn, { color: textColor }]}>{c.ret}</Text>
              </View>
            ))}
          </>
        )}

        {bottomActive === 2 && (
          <>
            {/* Payment Page Interface */}
            {/* Main Balance Card */}
            <View style={[styles.balanceCard, { backgroundColor: '#4F46E5' }]}>
              <View style={styles.balanceCardContent}>
                <View style={styles.balanceProfileSection}>
                  <View style={styles.balanceProfilePic}>
                    <Image source={require('./assets/icon.png')} style={styles.balanceProfileImage} />
                  </View>
                  <View style={styles.balanceTextSection}>
                    <Text style={styles.balanceUserName}>{displayName || 'User'}</Text>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <Text style={styles.balanceAmount}>$17,457.00</Text>
                  </View>
                </View>
                <View style={styles.balanceButtonsRow}>
                  <TouchableOpacity style={styles.addAmountBtn}>
                    <Text style={styles.addAmountIcon}>+</Text>
                    <Text style={styles.addAmountText}>Add Amount</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.addAccountBtn}>
                    <Text style={styles.addAccountIcon}>+</Text>
                    <Text style={styles.addAccountText}>Add New Account</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Money Transaction Section */}
            <View style={styles.moneyTransactionSection}>
              <Text style={[styles.moneyTransactionTitle, { color: textColor }]}>Money Transaction</Text>
              <View style={styles.transactionOptionsRow}>
                <TouchableOpacity style={styles.transactionOption}>
                  <View style={[styles.transactionIcon, { backgroundColor: cardBg }]}>
                    <Text style={styles.transactionIconText}>📱</Text>
                  </View>
                  <Text style={[styles.transactionLabel, { color: textColor }]}>Scan any QR code</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.transactionOption} onPress={() => setShowPayContactPage(true)}>
                  <View style={[styles.transactionIcon, { backgroundColor: cardBg }]}>
                    <Text style={styles.transactionIconText}>👤</Text>
                  </View>
                  <Text style={[styles.transactionLabel, { color: textColor }]}>Pay contact</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.transactionOption}>
                  <View style={[styles.transactionIcon, { backgroundColor: cardBg }]}>
                    <Text style={styles.transactionIconText}>🏦</Text>
                  </View>
                  <Text style={[styles.transactionLabel, { color: textColor }]}>Bank transfer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.transactionOption}>
                  <View style={[styles.transactionIcon, { backgroundColor: cardBg }]}>
                    <Text style={styles.transactionIconText}>📞</Text>
                  </View>
                  <Text style={[styles.transactionLabel, { color: textColor }]}>Pay phone number</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.viewAllLink} onPress={() => setShowMoneyTransactionPage(true)}>
                <Text style={[styles.viewAllText, { color: '#3b82f6' }]}>View All</Text>
                <Text style={[styles.viewAllArrow, { color: '#3b82f6' }]}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Transactions Section */}
            <View style={styles.transactionsSection}>
              <Text style={[styles.transactionsTitle, { color: textColor }]}>Transactions</Text>
              <View style={styles.transactionsList}>
                {[
                  { name: 'ADI', time: '12:30 PM', amount: '-$56.78', avatar: '👤', avatarColor: '#FF69B4' },
                  { name: 'Ashish', time: '10:15 AM', amount: '-$4.50', avatar: '👤', avatarColor: '#32CD32' },
                  { name: 'Abi', time: 'Yesterday', amount: '-$35.20', avatar: '👤', avatarColor: '#FFD700' },
                ].map((transaction, index) => (
                  <View key={index} style={[styles.transactionRow, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                    <View style={[styles.transactionAvatar, { backgroundColor: transaction.avatarColor }]}>
                      <Text style={styles.transactionAvatarText}>{transaction.avatar}</Text>
                    </View>
                    <View style={styles.transactionDetails}>
                      <Text style={[styles.transactionName, { color: textColor }]}>{transaction.name}</Text>
                      <Text style={[styles.transactionTime, { color: mutedColor }]}>{transaction.time}</Text>
                    </View>
                    <Text style={[styles.transactionAmount, { color: '#ef4444' }]}>{transaction.amount}</Text>
                  </View>
                ))}
              </View>
              <TouchableOpacity style={styles.viewAllLink}>
                <Text style={[styles.viewAllText, { color: '#3b82f6' }]}>View All</Text>
                <Text style={[styles.viewAllArrow, { color: '#3b82f6' }]}>→</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Money Transaction Page */}
        {showMoneyTransactionPage && (
        <View style={[styles.moneyTransactionPage, { backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff' }]}>
            {/* Header */}
            <View style={[styles.moneyTransactionHeader, { backgroundColor: surface, borderBottomColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
              <TouchableOpacity onPress={() => setShowMoneyTransactionPage(false)}>
                <Text style={[styles.backButton, { color: '#3b82f6' }]}>← Back</Text>
              </TouchableOpacity>
              <Text style={[styles.moneyTransactionPageTitle, { color: textColor }]}>Money Transaction</Text>
              <View style={{ width: 50 }} />
            </View>

            <ScrollView style={styles.moneyTransactionContent} contentContainerStyle={{ paddingBottom: 100 }}>
              {/* Welcome */}
              <View style={styles.welcomeSection}>
                <Text style={[styles.welcomeTitle, { color: textColor }]}>Welcome, {displayName || 'User'}</Text>
              </View>

              {/* Balance Card */}
              <View style={[styles.balanceCardNew, { backgroundColor: '#4F46E5' }]}>
                <View style={styles.balanceCardTop}>
                  <Text style={styles.balanceLabel}>Balance</Text>
                  <Text style={styles.visaLabel}>VISA</Text>
                </View>
                <Text style={styles.cardNumber}>4321 •••• •••• 5678</Text>
                <View style={styles.balanceCardBottom}>
                  <Text style={styles.cardHolder}>{displayName || 'User'}</Text>
                  <Text style={styles.expiry}>09/29</Text>
                </View>
              </View>

              {/* Add Account Button */}
              <TouchableOpacity style={styles.addAccountButton}>
                <Text style={styles.addAccountIcon}>+</Text>
                <Text style={styles.addAccountText}>Add New Account</Text>
              </TouchableOpacity>

              {/* Portfolio Card */}
              <View style={[styles.portfolioCardNew, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                <Text style={[styles.portfolioTitleNew, { color: textColor }]}>Your Portfolio</Text>
                <View style={styles.portfolioValueSection}>
                  <Text style={[styles.portfolioValueNew, { color: textColor }]}>$1,500</Text>
                  <Text style={styles.portfolioGain}>+4.2%</Text>
                  <Text style={styles.chartEmoji}>📈</Text>
                </View>
                <View style={styles.portfolioTabs}>
                  <View style={[styles.portfolioTab, styles.portfolioTabActive]}>
                    <Text style={styles.portfolioTabTextActive}>Stocks</Text>
                  </View>
                  <View style={styles.portfolioTab}>
                    <Text style={[styles.portfolioTabText, { color: mutedColor }]}>Mutual funds</Text>
                  </View>
                  <View style={styles.portfolioTab}>
                    <Text style={[styles.portfolioTabText, { color: mutedColor }]}>SIP</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewInvestments}>
                  <Text style={[styles.viewInvestmentsText, { color: mutedColor }]}>View Investments</Text>
                  <Text style={[styles.viewInvestmentsArrow, { color: mutedColor }]}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Insurance Card */}
              <View style={[styles.insuranceCardNew, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                <View style={styles.insuranceHeaderNew}>
                  <Text style={[styles.insuranceTitleNew, { color: textColor }]}>Insurance Summary</Text>
                  <View style={styles.insuranceIconNew}>
                    <Text style={styles.insuranceIconText}>🏥</Text>
                  </View>
                </View>
                <Text style={[styles.insurancePolicies, { color: textColor }]}>2 Policies Linked</Text>
                <View style={styles.insuranceStatus}>
                  <View style={styles.activeStatus}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeText}>Active</Text>
                  </View>
                  <View style={styles.expiringStatus}>
                    <Text style={styles.expiringIcon}>⚠️</Text>
                    <Text style={styles.expiringText}>1 Expiring soon</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.managePlans}>
                  <Text style={[styles.managePlansText, { color: mutedColor }]}>Manage plans</Text>
                  <Text style={[styles.managePlansArrow, { color: mutedColor }]}>→</Text>
                </TouchableOpacity>
              </View>

              {/* Recent Activity Card */}
              <View style={[styles.recentActivityCardNew, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#eef0f4' }]}>
                <Text style={[styles.recentActivityTitleNew, { color: textColor }]}>Recent Activity</Text>
                <View style={styles.activityListNew}>
                  <View style={styles.activityItemNew}>
                    <View style={styles.activityInfoNew}>
                      <Text style={[styles.activityNameNew, { color: textColor }]}>Stocks</Text>
                      <Text style={[styles.activityDateNew, { color: mutedColor }]}>Apr 26</Text>
                    </View>
                    <Text style={styles.activityAmountRed}>-1200</Text>
                  </View>
                  <View style={styles.activityItemNew}>
                    <View style={styles.activityInfoNew}>
                      <Text style={[styles.activityNameNew, { color: textColor }]}>Stocks</Text>
                      <Text style={[styles.activityDateNew, { color: mutedColor }]}>Apr 25</Text>
                    </View>
                    <Text style={styles.activityAmountGreen}>+8250</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.viewAllActivity}>
                  <Text style={[styles.viewAllActivityText, { color: mutedColor }]}>View All</Text>
                  <Text style={[styles.viewAllActivityArrow, { color: mutedColor }]}>→</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* Bottom Nav for Money Transaction Page */}
            <View style={[styles.bottomBar, { backgroundColor: surface, borderTopColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
              {['Home','Portfolio','Transactions','Payments','Profile'].map((label, idx) => (
                <TouchableOpacity key={label} style={styles.bottomItem} onPress={() => setBottomActive(idx)}>
                  <Text style={[styles.bottomIcon, { color: bottomActive === idx ? '#3b82f6' : '#9ca3af' }]}>
                    {idx === 0 ? '🏠' : idx === 1 ? '📊' : idx === 2 ? '↔️' : idx === 3 ? '🤲' : '👤'}
                  </Text>
                  <Text style={[styles.bottomText, { color: bottomActive === idx ? '#3b82f6' : '#9ca3af' }]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeSegment === 2 && bottomActive !== 2 && (
          <>
            {/* Finance: Buy Loan list */}
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={[styles.sectionTitle, { color: textColor }]}>Buy Loan</Text>
                <Text style={[styles.metaTiny, { color: mutedColor }]}>6 options</Text>
              </View>
            </View>

            <View style={[styles.loanPanel, { backgroundColor: surface, borderColor: isDarkMode ? '#222' : '#e6e8ed' }] }>
              {[
                { icon: '🏠', name: 'Home Loan', details: 'Interest: 7.5% - 9.5% | Tenure: 5-30 years | Max Amount: $500,000' },
                { icon: '🎓', name: 'Education Loan', details: 'Interest: 8% - 10% | Tenure: 5-15 years | Max Amount: $200,000' },
                { icon: '🚗', name: 'Car Loan', details: 'Interest: 7% - 12% | Tenure: 2-7 years | Max Amount: $100,000' },
                { icon: '🏍️', name: 'Bike Loan', details: 'Interest: 8% - 12% | Tenure: 2-7 years | Max Amount: $100,000' },
                { icon: '💼', name: 'Business Loan', details: 'Interest: 9% - 14% | Tenure: 3-10 years | Max Amount: $1,000,000' },
                { icon: '👤', name: 'Personal Loan', details: 'Interest: 10% - 15% | Tenure: 1-5 years | Max Amount: $50,000' },
              ].map((l, idx, arr) => (
                <View key={l.name} style={[styles.loanRow, idx < arr.length - 1 && { borderBottomColor: isDarkMode ? '#1f2937' : '#eef0f4', borderBottomWidth: 1 }]}>
                  <View style={[styles.loanIconWrap, { backgroundColor: cardBg }]}>
                    <Text style={styles.loanIcon}>{l.icon}</Text>
                  </View>
                  <View style={styles.loanTextWrap}>
                    <Text style={[styles.loanTitle, { color: textColor }]}>{l.name}</Text>
                    <Text style={[styles.loanDetail, { color: mutedColor }]}>{l.details}</Text>
                  </View>
                  <Text style={[styles.chevron, { color: mutedColor }]}>›</Text>
                </View>
              ))}
            </View>

            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <TouchableOpacity style={styles.viewAllPill}>
                <Text style={styles.viewAllPillText}>View All</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Chat FAB */}
      <TouchableOpacity style={[styles.fab, { backgroundColor: '#7c4dff' }]}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>

      {/* Bottom Nav (static) */}
      <View style={[styles.bottomBar, { backgroundColor: surface, borderTopColor: isDarkMode ? '#222' : '#e6e8ed' }]}>
        {['Home','Portfolio','Payments'].map((label, idx) => (
          <TouchableOpacity key={label} style={styles.bottomItem} onPress={() => setBottomActive(idx)}>
            <Text style={[styles.bottomIcon, { color: bottomActive === idx ? '#3b82f6' : mutedColor }]}>
              {idx === 0 ? '🏠' : idx === 1 ? '💼' : '↔️'}
            </Text>
            <Text style={[styles.bottomText, { color: bottomActive === idx ? '#3b82f6' : mutedColor }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile Screen Overlay */}
      {showProfile && !showEditProfile && (
        <ProfileScreen 
          isDarkMode={isDarkMode} 
          onBack={() => setShowProfile(false)} 
          onLogout={onLogout}
          displayName={displayName}
          onSaveDisplayName={(name) => {
            onEditProfile && onEditProfile(name);
          }}
          onEditPress={onOpenEditProfile}
          onToggleDarkMode={onToggleDarkMode}
          currentLanguage={currentLanguage}
          onChangeLanguage={onChangeLanguage}
        />
      )}
      {showProfile && showEditProfile && (
        <EditProfileScreen
          isDarkMode={isDarkMode}
          onBack={onCloseEditProfile}
          onSave={onSaveProfile}
          initialName={displayName}
          initialEmail={profileEmail}
        />
      )}
    </View>
  );
};

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showGuide, setShowGuide] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showPanCard, setShowPanCard] = useState(false);
  const [showAadharCard, setShowAadharCard] = useState(false);
  const [showBankVerification, setShowBankVerification] = useState(false);
  const [showKYCVerification, setShowKYCVerification] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [authToken, setAuthToken] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const saveDisplayName = async (name) => {
    try {
      if (!authToken) return;
      const res = await fetch(`${BASE_URL}/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ displayName: name }),
      });
      const data = await res.json();
      if (res.ok && data?.displayName) setDisplayName(data.displayName);
    } catch (_) {}
  };

  const resolvedHost = (
    (Constants?.expoConfig?.hostUri || Constants?.manifest?.debuggerHost || '')
      .toString()
      .split(':')[0]
  );
  const isLocalHost = resolvedHost === 'localhost' || resolvedHost === '127.0.0.1';
  const BASE_URL = Platform.OS === 'android'
    ? (!isLocalHost && resolvedHost ? `http://${resolvedHost}:4000` : 'http://10.0.2.2:4000')
    : (resolvedHost ? `http://${resolvedHost}:4000` : 'http://localhost:4000');

  const advanceStep = async (toStep) => {
    if (!authToken) return;
    try {
      await fetch(`${BASE_URL}/verification/advance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ to: toStep }),
      });
    } catch (_) {
      // ignore for now; UX remains optimistic
    }
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleGuideComplete = () => {
    setShowGuide(false);
    setShowLogin(true);
  };

  const handleLoginSuccess = (authData) => {
    // authData: { token, user: { id, email, verificationStep } }
    const step = authData?.user?.verificationStep || 'pan';
    const token = authData?.token || null;
    setAuthToken(token);
    setShowLogin(false);
    // fetch profile to get PAN name for display
    if (token) {
      fetch(`${BASE_URL}/verification/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((me) => {
          if (me?.pan?.name) setDisplayName(me.pan.name);
          if (me?.email) setProfileEmail(me.email);
        })
        .catch(() => {});
    }
    if (step === 'pan') {
      setShowPanCard(true);
    } else if (step === 'aadhar') {
      setShowAadharCard(true);
    } else if (step === 'bank') {
      setShowBankVerification(true);
    } else if (step === 'kyc') {
      setShowKYCVerification(true);
    } else {
      setIsLoggedIn(true);
    }
  };

  const handleSignupSuccess = (authData) => {
    const token = authData?.token || null;
    setAuthToken(token);
    setShowLogin(false);
    setShowPanCard(true);
  };

  const handlePanComplete = () => {
    advanceStep('aadhar');
    setShowPanCard(false);
    setShowAadharCard(true);
  };

  const handleAadharComplete = () => {
    advanceStep('bank');
    setShowAadharCard(false);
    setShowBankVerification(true);
  };

  const handleBankComplete = () => {
    advanceStep('kyc');
    setShowBankVerification(false);
    setShowKYCVerification(true);
  };

  const handleKYCComplete = () => {
    advanceStep('done');
    setShowKYCVerification(false);
    setIsLoggedIn(true);
    // Refresh profile to capture latest PAN name
    if (authToken) {
      fetch(`${BASE_URL}/verification/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((r) => r.json())
        .then((me) => {
          if (me?.pan?.name) setDisplayName(me.pan.name);
          if (me?.email) setProfileEmail(me.email);
        })
        .catch(() => {});
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleChangeLanguage = (code) => {
    setCurrentLanguage(code || 'en');
  };

  const handleLogout = () => {
    // Reset to login screen
    setIsLoggedIn(false);
    setShowGuide(false);
    setShowLogin(true);
    setShowPanCard(false);
    setShowAadharCard(false);
    setShowBankVerification(false);
    setShowKYCVerification(false);
    setAuthToken(null);
    setDisplayName('');
    setProfileEmail('');
    setShowEditProfile(false);
  };

  // Ensure display name is loaded when entering home if missing
  useEffect(() => {
    if (isLoggedIn && authToken && !displayName) {
      fetch(`${BASE_URL}/verification/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((r) => r.json())
        .then((me) => {
          if (me?.pan?.name) setDisplayName(me.pan.name);
          if (me?.email) setProfileEmail(me.email);
        })
        .catch(() => {});
    }
  }, [isLoggedIn, authToken, displayName]);

  const saveProfile = async ({ name, email }) => {
    try {
      if (!authToken) return;
      const res = await fetch(`${BASE_URL}/profile/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ displayName: name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        if (data?.displayName) setDisplayName(data.displayName);
        if (data?.email) setProfileEmail(data.email);
        setShowEditProfile(false);
      }
    } catch (_) {}
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} isDarkMode={isDarkMode} />
      ) : showGuide ? (
        <QuickStartGuide onComplete={handleGuideComplete} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
      ) : showLogin ? (
        <LoginPage 
          onLoginSuccess={handleLoginSuccess} 
          onSignupSuccess={handleSignupSuccess} 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode} 
        />
      ) : showPanCard ? (
        <PanCardDetails onPanComplete={handlePanComplete} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} baseUrl={BASE_URL} authToken={authToken} setDisplayName={setDisplayName} />
      ) : showAadharCard ? (
        <AadharCardDetails onAadharComplete={handleAadharComplete} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} baseUrl={BASE_URL} authToken={authToken} />
      ) : showBankVerification ? (
        <BankVerification onBankComplete={handleBankComplete} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} baseUrl={BASE_URL} authToken={authToken} />
      ) : showKYCVerification ? (
        <KYCVerification onKYCComplete={handleKYCComplete} isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} baseUrl={BASE_URL} authToken={authToken} />
      ) : (
        <HomePage 
          showGuide={showGuide} 
          onGuideComplete={handleGuideComplete} 
          isDarkMode={isDarkMode} 
          onToggleDarkMode={toggleDarkMode} 
          onLogout={handleLogout}
          displayName={displayName}
          profileEmail={profileEmail}
          onEditProfile={saveDisplayName}
          showEditProfile={showEditProfile}
          onOpenEditProfile={() => setShowEditProfile(true)}
          onCloseEditProfile={() => setShowEditProfile(false)}
          onSaveProfile={saveProfile}
          currentLanguage={currentLanguage}
          onChangeLanguage={handleChangeLanguage}
        />
      )}
    </>
  );
}
