import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, View } from '@/components/Themed';
import { COLORS } from '@/constants/Colors';


export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.illustrationContainer}>
          <MaterialIcons name="error-outline" size={80} color={COLORS.primary} />
          <View style={styles.errorCodeContainer}>
            <Text style={styles.errorCode}>404</Text>
          </View>
        </View>
        
        <Text style={styles.title}>Página não encontrada</Text>
        <Text style={styles.subtitle}>Oops! A página que você está procurando não existe ou foi removida.</Text>
        
        <Link href="/(auth)/login" style={styles.link}>
          <Text style={styles.linkText}>Voltar para a página inicial</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" style={styles.arrowIcon} />
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: COLORS.background,
  },
  illustrationContainer: {
    position: 'relative',
    marginBottom: 30,
  },
  errorCodeContainer: {
    position: 'absolute',
    bottom: -10,
    right: -20,
    backgroundColor: 'rgba(46, 120, 183, 0.1)',
    borderRadius: 50,
    padding: 10,
  },
  errorCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: 300,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  arrowIcon: {
    marginLeft: 10,
  },
});