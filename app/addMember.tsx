// app/addMember.tsx
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { auth, db } from '../constants/firebaseConfig';
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from "firebase/firestore";

export default function AddMemberScreen() {
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [dlExpiry, setDlExpiry] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleAddMember = async () => {
    const user = auth.currentUser;
    if (!user) {
      router.push({pathname: '/login'});
      return;
    }
    try {
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      const newMember = {
        memberId: Date.now().toString(),
        name,
        relation: relation || "Other",
        drivingLicense: {
          dlNumber: dlNumber || null,
          expiry: dlExpiry || null,
          categories: { TW: null, LMV: null, Heavy: null, Badge: null }
        },
        vehicles: []  // Start with no vehicles; these can be added later
      };

      if (docSnap.exists()) {
        await updateDoc(userDocRef, {
          familyMembers: arrayUnion(newMember)
        });
      } else {
        await setDoc(userDocRef, { familyMembers: [newMember] });
      }
      router.push({pathname: '/home'});
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add Family Member</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Relation (e.g., Self, Spouse, Child)"
        value={relation}
        onChangeText={setRelation}
      />
      <TextInput
        style={styles.input}
        placeholder="Driving License Number"
        value={dlNumber}
        onChangeText={setDlNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Driving License Expiry (YYYY-MM-DD)"
        value={dlExpiry}
        onChangeText={setDlExpiry}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Submit Member" onPress={handleAddMember} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10 },
  error: { color: 'red', marginBottom: 10 },
});
