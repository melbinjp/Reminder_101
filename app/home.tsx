// app/home.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../constants/firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

interface FamilyMember {
  memberId: string;
  name: string;
  relation?: string;
  drivingLicense?: {
    dlNumber?: string;
    expiry?: string;
    categories?: { TW?: string; LMV?: string; Heavy?: string; Badge?: string };
  };
  vehicles?: Array<{
    vehicle_id: string;
    vehicle_number: string;
    insurance?: string;
    pollution?: string;
    regRenewal?: string;
    permit?: string;
  }>;
}

interface FamilyData {
  familyMembers: FamilyMember[];
}

export default function HomeScreen() {
  const [data, setData] = useState<FamilyData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setData(docSnap.data() as FamilyData);
        }
      } else {
        router.push({pathname: '/login'});
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!data || !data.familyMembers || data.familyMembers.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No family members found. Please add a member.</Text>
        <Button title="Add Family Member" onPress={() => router.push({pathname: '/addMember'})} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Family Members</Text>
      <FlatList
        data={data.familyMembers}
        keyExtractor={(item) => item.memberId}
        renderItem={({ item }) => (
          <View style={styles.memberItem}>
            <Text style={styles.memberName}>{item.name} {item.relation ? `(${item.relation})` : ''}</Text>
            <Button title="View Details" onPress={() => router.push({ pathname: '/member/[memberId]', params: { memberId: item.memberId } })}/>
          </View>
        )}
      />
      <Button title="Add Family Member" onPress={() => router.push({pathname: '/addMember'})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, marginBottom: 20, fontWeight: 'bold' },
  loading: { flex: 1, textAlign: 'center', marginTop: 50 },
  memberItem: { padding: 15, marginVertical: 8, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  memberName: { fontSize: 18, marginBottom: 10 },
});
