// app/(tabs)/ranking-mensal.tsx
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getRankingMensal } from '../../services/api';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '@/constants/Colors';
import { MotiView, AnimatePresence } from 'moti';

interface SetorData {
  id_setor: number;
  setor: string;
  total_registros: number;
  media_mensal: string;
  soma_pontuacao: string;
}

interface RankingMensalItem {
  erro: any;
  tecnico: string;
  colocacao: number;
  total_registros: number;
  media_mensal: string;
  media_setor: SetorData[];
}

const MonthlyRanking = () => {
  const [ranking, setRanking] = useState<RankingMensalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonthValue, setSelectedMonthValue] = useState(selectedMonth.getMonth() + 1);
  const [selectedYearValue, setSelectedYearValue] = useState(selectedMonth.getFullYear());
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!user?.access_token) {
          throw new Error('Usuário não autenticado');
        }

        await fetchRanking(selectedMonth);
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar dados');
        console.error('Erro detalhado:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatMonth = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}`;
  };

  const fetchRanking = async (date: Date) => {
    try {
      setLoading(true);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      const monthString = `${year}-${month}`;
      
      console.log('Buscando ranking para:', monthString);
      const rankingData = await getRankingMensal(user?.access_token || '', monthString);
      
      if (!Array.isArray(rankingData)) {
        throw new Error('Dados do ranking não estão no formato esperado');
      }

      setRanking(rankingData);

      
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar ranking');
      console.error('Erro detalhado:', err);
      setRanking([]);
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking Mensal</Text>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={() => setModalVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.dateButtonText}>
            {formatMonth(selectedMonth)}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Selecione mês e ano</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedMonthValue}
                  style={{ flex: 1 }}
                  onValueChange={(itemValue) => setSelectedMonthValue(itemValue)}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <Picker.Item key={month} label={month.toString().padStart(2, '0')} value={month} />
                  ))}
                </Picker>

                <Picker
                  selectedValue={selectedYearValue}
                  style={{ flex: 1 }}
                  onValueChange={(itemValue) => setSelectedYearValue(itemValue)}
                >
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <Picker.Item key={year} label={year.toString()} value={year} />
                  ))}
                </Picker>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    const newDate = new Date(selectedYearValue, selectedMonthValue - 1, 1);
                    console.log("Data selecionada: ",newDate);
                    setSelectedMonth(newDate);
                    fetchRanking(newDate);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.confirmText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <AnimatePresence>
            {ranking.filter(item => !item.erro).map((item, index) => {
              const medalColor =
                item.colocacao === 1
                  ? '#FFD700'
                  : item.colocacao === 2
                  ? '#C0C0C0'
                  : item.colocacao === 3
                  ? '#CD7F32'
                  : COLORS.primary;

              return (
                <MotiView
                  from={{ opacity: 0, translateY: 20, scale: 0.95 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{
                    type: 'timing',
                    duration: 500,
                    delay: index * 100
                  }}
                  key={`${item.tecnico}-${item.colocacao}`}
                  style={styles.rankingItem}
                >
                  <View style={[styles.positionContainer, { backgroundColor: medalColor }]}>
                    <Text style={styles.positionText}>{item.colocacao}º</Text>
                  </View>

                  <View style={styles.itemContent}>
                    <Text style={styles.colaboratorName}>{item.tecnico}</Text>

                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>
                        Média Mensal: {item.media_mensal}
                      </Text>
                    </View>

                    <Text style={styles.registrosText}>
                      Total de registros: {item.total_registros}
                    </Text>

                    <View style={styles.sectorsContainer}>
                      <Text style={styles.sectorsTitle}>Médias por Setor:</Text>
                      {item.media_setor.map((setor) => (
                        <View key={setor.id_setor} style={styles.sectorItem}>
                          <Text style={styles.sectorName}>{setor.setor}:</Text>
                          <Text style={styles.sectorValue}>{setor.media_mensal}</Text>
                          <Text style={styles.sectorRegistros}>
                            ({setor.total_registros} registros)
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </MotiView>
              );
            })}
          </AnimatePresence>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateButton: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    minWidth: 150
  },
  dateButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    textAlign: 'center'
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16
  },
  scrollView: {
    flex: 1
  },
  rankingItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3
  },
  positionContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  positionText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18
  },
  itemContent: {
    marginLeft: 16,
    flex: 1
  },
  colaboratorName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#1f2937'
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 4
  },
  registrosText: {
    fontSize: 12,
    color: '#4b5563',
    marginTop: 4
  },
  sectorsContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8
  },
  sectorsTitle: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#1f2937',
    marginBottom: 4
  },
  sectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  sectorName: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
    width: '40%'
  },
  sectorValue: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: 'bold',
    width: '20%'
  },
  sectorRegistros: {
    fontSize: 10,
    color: '#6b7280',
    fontStyle: 'italic',
    width: '40%'
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  modalButton: {
    flex: 1,
    alignItems: 'center'
  },
  cancelText: {
    color: '#ef4444',
    fontWeight: 'bold'
  },
  confirmText: {
    color: COLORS.primary,
    fontWeight: 'bold'
  }
});

export default MonthlyRanking;
