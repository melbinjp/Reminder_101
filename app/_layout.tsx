// app/_layout.tsx
import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack initialRouteName="login">
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: 'Home' }} />
      <Stack.Screen name="addMember" options={{ title: 'Add Family Member' }} />
      <Stack.Screen name="member/[memberId]" options={{ title: 'Member Details' }} />
    </Stack>
  );
}
