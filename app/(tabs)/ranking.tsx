import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getDailyRanking, getColaboradores, getSetores } from '../../services/api';
import { 
  MaterialIcons, 
  FontAwesome5, 
  FontAwesome, 
  Entypo 
} from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '@/constants/Colors';
import { MotiView, AnimatePresence } from 'moti';

interface MediaSetor {
  id_setor: number;
  nome_setor?: string;
  total_registros: number;
  media_diaria: string;
  soma_pontuacao: string;
}

interface RankingItem {
  id: number;
  colaborador_id: number;
  data: string;
  media_total: string;
  media_sucesso?: string;
  media_estoque?: string;
  media_n2?: string;
  media_rh?: string;
  media_n3?: string;
  nome_colaborador?: string;
  posicao?: number;
  media_setor?: MediaSetor[];
}

const setorIcons: Record<string, JSX.Element> = {
  'Sucesso ao cliente': <FontAwesome5 name="headset" size={14} color={COLORS.primary} />,
  'Suporte Nivel 2': <MaterialIcons name="support-agent" size={14} color={COLORS.primary} />,
  'Suporte Nível 3': <MaterialIcons name="engineering" size={14} color={COLORS.primary} />,
  'Estoque': <FontAwesome name="archive" size={14} color={COLORS.primary} />,
  'Recursos Humanos': <Entypo name="users" size={14} color={COLORS.primary} />,
};

const formatSetorNameAndGetIcon = (setorName: string | undefined) => {
  if (!setorName) return { name: 'Setor Desconhecido', icon: <FontAwesome5 name="building" size={14} color={COLORS.primary} /> };
  
  const formattedName = setorName.replace('Avaliadores suporte Nível 2', 'Suporte Nivel 2');
  
  return {
    name: formattedName,
    icon: setorIcons[formattedName] || <FontAwesome5 name="building" size={14} color={COLORS.primary} />
  };
};

const DailyRankingScreen = () => {
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [colaboradoresMap, setColaboradoresMap] = useState<Record<number, string>>({});
  const [setoresMap, setSetoresMap] = useState<Record<number, string>>({});
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        if (!user?.access_token) throw new Error('Usuário não autenticado');

        console.log('Iniciando busca de colaboradores e setores...');
        const [colaboradores, setores] = await Promise.all([
          getColaboradores(user.access_token),
          getSetores(user.access_token)
        ]);

        console.log('Colaboradores encontrados:', colaboradores.length);
        console.log('Setores encontrados:', setores.length);

        const filtrados = colaboradores.filter((colab: any) => colab.setor_colaborador === 22);
        console.log('Colaboradores filtrados (setor 22):', filtrados.length);

        const colaboradoresMap = filtrados.reduce((acc, curr) => {
          acc[curr.id_colaborador] = curr.nome_colaborador;
          return acc;
        }, {} as Record<number, string>);

        const setoresMap = setores.reduce((acc, curr) => {
          acc[curr.id_setor] = curr.nome_setor;
          return acc;
        }, {} as Record<number, string>);

        setColaboradoresMap(colaboradoresMap);
        setSetoresMap(setoresMap);
        await fetchRanking(selectedDate, filtrados, colaboradoresMap, setoresMap);
      } catch (err: any) {
        console.error('Erro ao carregar dados:', err);
        setError(err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      console.log('Nova data selecionada:', formatDate(selectedDate));
      setSelectedDate(selectedDate);
      handleSearch(selectedDate);
    }
  };

  const showDatepicker = () => {
    console.log('Abrindo date picker...');
    setShowDatePicker(true);
  };

  const fetchRanking = async (
    date: Date,
    colaboradores: { id_colaborador: number; nome_colaborador: string }[],
    colaboradoresMap: Record<number, string>,
    setoresMap: Record<number, string>
  ) => {
    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      const dateString = date.toISOString().split('T')[0];
      
      console.log('\n--- INICIANDO BUSCA DE RANKING ---');
      console.log('Data pesquisada:', dateString);
      console.log('Total de colaboradores:', colaboradores.length);

      const allRanking: RankingItem[] = [];

      for (const colaborador of colaboradores) {
        const colaboradorId = colaborador.id_colaborador;
        if (!colaboradorId) continue;

        try {
          console.log(`\nBuscando dados para colaborador ${colaboradorId}...`);
          const data = await getDailyRanking(dateString, colaboradorId, user.access_token);
          
          console.log(`Dados retornados para ${colaborador.nome_colaborador}:`, {
            media_total: data.media_total,
            setores: data.media_setor?.length || 0
          });

          const mediaSetorComNomes = data.media_setor?.map(setor => ({
            ...setor,
            nome_setor: setoresMap[setor.id_setor] || `Setor ${setor.id_setor}`
          })) || [];

          const rankingItem: RankingItem = {
            id: colaboradorId,
            colaborador_id: colaboradorId,
            nome_colaborador: colaboradoresMap[colaboradorId] || 'Desconhecido',
            data: dateString,
            media_total: data.media_total || '0.00',
            media_sucesso: data.media_sucesso || '0.00',
            media_estoque: data.media_estoque || '0.00',
            media_n2: data.media_n2 || '0.00',
            media_rh: data.media_rh || '0.00',
            media_n3: data.media_n3 || '0.00',
            media_setor: mediaSetorComNomes
          };

          allRanking.push(rankingItem);
        } catch (error) {
          console.error(`Erro ao buscar ranking do colaborador ${colaboradorId}:`, error);
        }
      }

      const sorted = allRanking
        .sort((a, b) => parseFloat(b.media_total) - parseFloat(a.media_total))
        .map((item, index) => ({ ...item, posicao: index + 1 }));

      console.log('\n--- RANKING FINAL ---');
      console.log('Total de itens:', sorted.length);
      console.log('Primeiros 3 colocados:', sorted.slice(0, 3).map(i => ({
        nome: i.nome_colaborador,
        media: i.media_total
      })));
      
      setRanking(sorted);
    } catch (err: any) {
      console.error('Erro ao carregar ranking:', err);
      setError(err.message || 'Erro ao carregar ranking');
      setRanking([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (date: Date) => {
    console.log('\n=== NOVA PESQUISA ===');
    console.log('Data:', formatDate(date));
    console.log('Total de colaboradores:', Object.keys(colaboradoresMap).length);
    
    fetchRanking(
      date, 
      Object.entries(colaboradoresMap).map(([id_colaborador, nome_colaborador]) => ({
        id_colaborador: Number(id_colaborador),
        nome_colaborador
      })), 
      colaboradoresMap,
      setoresMap
    );
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
      <Text style={styles.title}>Ranking Diário</Text>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.dateButton} 
          onPress={showDatepicker}
          activeOpacity={0.7}
        >
          <Text style={styles.dateButtonText}>
            {formatDate(selectedDate)}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
            maximumDate={new Date()}
          />
        )}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          <AnimatePresence>
            {ranking.map((item, index) => {
              const medalColor =
                item.posicao === 1
                  ? '#FFD700'
                  : item.posicao === 2
                  ? '#C0C0C0'
                  : item.posicao === 3
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
                  key={item.colaborador_id}
                  style={styles.rankingItem}
                >
                  <View style={[styles.positionContainer, { backgroundColor: medalColor }]}>
                    <Text style={styles.positionText}>{item.posicao}º</Text>
                  </View>

                  <View style={styles.itemContent}>
                    <Text style={styles.colaboratorName}>{item.nome_colaborador}</Text>

                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={16} color="#FFD700" />
                      <Text style={styles.ratingText}>Média Geral: {item.media_total}</Text>
                    </View>

                    {item.media_setor?.map((setor, idx) => {
                      const { name: setorName, icon } = formatSetorNameAndGetIcon(setor.nome_setor);
                      return (
                        <View key={idx} style={styles.sectorItem}>
                          {icon}
                          <Text style={styles.sectorText}>
                            {setorName}: {setor.media_diaria}
                          </Text>
                        </View>
                      );
                    })}

                    <Text style={styles.dateText}>{item.data}</Text>
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
  dateText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 8
  },
  sectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2
  },
  sectorText: {
    fontSize: 13,
    color: '#4B5563',
    marginLeft: 4
  }
});

export default DailyRankingScreen;