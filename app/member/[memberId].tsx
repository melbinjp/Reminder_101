// app/member/[memberId].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { auth, db } from '../../constants/firebaseConfig';
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

export default function MemberDetail() {
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMember() {
      const user = auth.currentUser;
      if (user) {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as { familyMembers: FamilyMember[] };
          const found = data.familyMembers.find(m => m.memberId === memberId);
          if (found) setMember(found);
        }
      } else {
        router.push({pathname: '/login'});
      }
      setLoading(false);
    }
    fetchMember();
  }, [memberId]);

  if (loading) return <Text style={styles.loading}>Loading...</Text>;
  if (!member) return <Text style={styles.loading}>Member not found.</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Details for {member.name}</Text>
      <Text style={styles.subHeader}>Driving License</Text>
      {member.drivingLicense ? (
        <View style={styles.detailBox}>
          <Text>DL No: {member.drivingLicense.dlNumber || 'N/A'}</Text>
          <Text>Expiry: {member.drivingLicense.expiry || 'N/A'}</Text>
          {member.drivingLicense.categories && (
            <>
              <Text>TW: {member.drivingLicense.categories.TW || 'N/A'}</Text>
              <Text>LMV: {member.drivingLicense.categories.LMV || 'N/A'}</Text>
              <Text>Heavy: {member.drivingLicense.categories.Heavy || 'N/A'}</Text>
              <Text>Badge: {member.drivingLicense.categories.Badge || 'N/A'}</Text>
            </>
          )}
        </View>
      ) : (
        <Text>No driving license details available.</Text>
      )}
      
      <Text style={styles.subHeader}>Vehicles</Text>
      {member.vehicles && member.vehicles.length > 0 ? (
        <FlatList
          data={member.vehicles}
          keyExtractor={(item) => item.vehicle_id}
          renderItem={({ item }) => (
            <View style={styles.detailBox}>
              <Text>Vehicle No: {item.vehicle_number}</Text>
              <Text>Insurance: {item.insurance || 'N/A'}</Text>
              <Text>Pollution: {item.pollution || 'N/A'}</Text>
              <Text>Reg. Renewal: {item.regRenewal || 'N/A'}</Text>
              <Text>Permit: {item.permit || 'N/A'}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No vehicles added for this member.</Text>
      )}
      <Button title="Back to Home" onPress={() => router.push({pathname: '/home'})} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 22, marginBottom: 10, fontWeight: 'bold' },
  subHeader: { fontSize: 18, marginTop: 15, marginBottom: 5 },
  detailBox: { padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 10 },
  loading: { flex: 1, textAlign: 'center', marginTop: 50 },
});
