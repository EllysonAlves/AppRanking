import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'expo-router';
import { COLORS } from '../../constants/Colors';
import { getAssuntos, ChecklistGetFiltered } from '../../services/api';

interface Assunto {
  id: number;
  name: string;
}

interface ChecklistItem {
  id: number;
  checklist_id: number;
  label: string;
  type: string;
  max_score: number;
}

interface ApiResponse {
  total: number;
  registros: Assunto[];
}

const HomeScreen = () => {
  const { signOut, user } = useAuth();
  const [selectedAssunto, setSelectedAssunto] = useState<number | undefined>(undefined);
  const [assuntos, setAssuntos] = useState<Assunto[]>([]);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [loadingAssuntos, setLoadingAssuntos] = useState(true);
  const [loadingChecklist, setLoadingChecklist] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssuntos = async () => {
      try {
        setLoadingAssuntos(true);
        setError('');

        if (!user?.access_token) {
          throw new Error('Usuário não autenticado');
        }

        const response: ApiResponse = await getAssuntos(user.access_token);
        setAssuntos(response.registros || []);
      } catch (err) {
        console.error('Erro ao buscar assuntos:', err);
        setError('Erro ao carregar assuntos');
      } finally {
        setLoadingAssuntos(false);
      }
    };

    fetchAssuntos();
  }, [user?.access_token]);

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!selectedAssunto) return;

      try {
        setLoadingChecklist(true);
        setError('');

        if (!user?.access_token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await ChecklistGetFiltered(user.access_token, selectedAssunto);
        setChecklistItems(response.checklist || []);
      } catch (err) {
        console.error('Erro ao buscar checklist:', err);
        setError('Erro ao carregar checklist');
      } finally {
        setLoadingChecklist(false);
      }
    };

    fetchChecklist();
  }, [selectedAssunto, user?.access_token]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Olá, {user?.nome || 'Técnico'}</Text>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo principal */}
      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Links Úteis</Text>

        <Link href="/tutorials" asChild>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.linkText}>Tutoriais e Documentos</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.sectionTitle}>Checklists</Text>

        <View style={styles.checklistContainer}>
          {loadingAssuntos ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedAssunto}
                  onValueChange={(itemValue: number) => setSelectedAssunto(itemValue)}
                  style={styles.picker}
                  dropdownIconColor={COLORS.primary}
                >
                  <Picker.Item label="Selecione um assunto" value={null} />
                  {assuntos.map((assunto) => (
                    <Picker.Item
                      key={assunto.id}
                      label={assunto.name}
                      value={assunto.id}
                    />
                  ))}
                </Picker>
              </View>

              {loadingChecklist ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : selectedAssunto && checklistItems.length > 0 ? (
                <View style={styles.checklistContent}>
                  <Text style={styles.checklistTitle}>
                    {assuntos.find(a => a.id === selectedAssunto)?.name}
                  </Text>
                  {checklistItems.map((item) => (
                    <Text key={item.id} style={styles.checklistItem}>
                      • {item.label}
                    </Text>
                  ))}
                </View>
              ) : selectedAssunto ? (
                <Text style={styles.emptyText}>Nenhum item encontrado para este checklist</Text>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Link href="/(tabs)/ranking" asChild>
          <TouchableOpacity style={styles.navButton}>
            <FontAwesome5 name="trophy" size={20} color={COLORS.primary} />
            <Text style={styles.navText}>Diário</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/monthly-ranking" asChild>
          <TouchableOpacity style={styles.navButton}>
            <FontAwesome5 name="medal" size={20} color={COLORS.primary} />
            <Text style={styles.navText}>Mensal</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/service-orders" asChild>
          <TouchableOpacity style={styles.navButton}>
            <MaterialIcons name="list-alt" size={20} color={COLORS.primary} />
            <Text style={styles.navText}>OS</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 60,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 5,
  },
  logoutText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  linkCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  linkText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
    marginLeft: 10,
  },
  checklistContainer: {
    marginBottom: 20,
  },
  pickerContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  checklistContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  checklistTitle: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checklistItem: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 8,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navButton: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: COLORS.primary,
    marginTop: 5,
  },
  errorText: {
    color: COLORS.red,
    textAlign: 'center',
    marginVertical: 10,
  },
  emptyText: {
    color: COLORS.white,
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;