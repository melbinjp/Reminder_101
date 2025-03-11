// app/login.tsx
import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firebaseConfig } from '../constants/firebaseConfig';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const recaptchaVerifier = useRef<any>(null);
  const router = useRouter();

  const sendVerification = async () => {
    if (!phoneNumber) return;
    try {
      // Ensure phone number is in E.164 format.
      const formattedNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+91${phoneNumber}`;
      const phoneProvider = new PhoneAuthProvider(auth as any);
      const id = await phoneProvider.verifyPhoneNumber(formattedNumber, recaptchaVerifier.current);
      setVerificationId(id);
      Alert.alert('Verification code sent');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };
  

  const confirmCode = async () => {
    if (!verificationId || !verificationCode) return;
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      router.push({ pathname: '/home' });
    } catch (error: any) {
      Alert.alert('Invalid code', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={true}
      />
      <Text style={styles.title}>Login with SMS</Text>
      {!verificationId ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Phone Number (with country code)"
            keyboardType="phone-pad"
            onChangeText={setPhoneNumber}
            value={phoneNumber}
          />
          <Button title="Send Verification Code" onPress={sendVerification} />
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter Verification Code"
            keyboardType="number-pad"
            onChangeText={setVerificationCode}
            value={verificationCode}
          />
          <Button title="Confirm Code" onPress={confirmCode} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
});
