import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useEffect } from 'react';

export default function TabsLayout() {
  const { user } = useAuth();
  const router = useRouter();

  console.log('🔍 TabsLayout - user:', user);

  useEffect(() => {
    console.log('🔄 Effect TabsLayout - verificando autenticação');
    if (!user) {
      console.log('🔓 Usuário não autenticado - redirecionando para login');
      router.replace('/(auth)');
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen 
        name="home" 
        options={{ headerShown: false }}
        listeners={{
          focus: () => console.log('🏠 Tela home em foco'),
        }}
      />
      <Stack.Screen name="ranking" options={{ headerShown: true }} />
      <Stack.Screen name="monthly-ranking" options={{ headerShown: false }} />
    </Stack>
  );
}