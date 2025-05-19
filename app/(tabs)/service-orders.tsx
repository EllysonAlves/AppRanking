import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';
import { getAvaliacoes } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Avaliacao {
  potencia: any;
  id: string;
  id_cliente: string;
  cliente: string;
  finalizacao: string;
  mensagem: string;
  checklist: string;
  status: string;
  avaliador: string;
}

const ServiceOrders = () => {
  const { user } = useAuth();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user?.access_token && user?.id_ixc) {
      fetchAvaliacoes();
    }
  }, [user, selectedDate]);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const parseChecklist = (checklist: string) => {
    if (!checklist) return [];

    const lines = checklist.split('\n').filter(line => line.trim() !== '');
    const result = [];
    let currentSection = '';

    for (const line of lines) {
      if (!line.includes('Sim (') && !line.includes('Não (')) {
        currentSection = line.trim();
        continue;
      }

      const questionMatch = line.match(/^(.*?)\?/);
      const question = questionMatch ? questionMatch[1] : line;

      const hasYes = line.includes('Sim (X)');
      const hasNo = line.includes('Não (X)');

      if (hasYes || hasNo) {
        result.push({
          section: currentSection,
          question: question.trim(),
          answer: hasYes ? 'Sim' : 'Não'
        });
      }
    }

    return result;
  };

  const formatDateToAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      const parts = dateString.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const fetchAvaliacoes = async () => {
    try {
      setLoading(true);
      setError('');
      setExpandedItems({});

      const dateString = formatDateToAPI(selectedDate);
      const idIxcString = user?.id_ixc?.toString() || '';

      const data = await getAvaliacoes(
        user?.access_token || '',
        idIxcString,
        dateString
      );

      setAvaliacoes(data);
    } catch (err: any) {
      console.error('Erro ao buscar avaliações:', err);
      setError(err.message || 'Erro ao carregar ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  console.log(avaliacoes);



  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const adjustedDate = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      );
      setSelectedDate(adjustedDate);
    }
  };

  const formatDateToDisplay = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getFibraColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return COLORS.gray;
    if (value > -25) return COLORS.green;
    if (value > -26) return COLORS.yellow;
    return COLORS.red;
  };

  const getCCQColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return COLORS.gray;
    if (value > 90) return COLORS.green;
    if (value > 80) return COLORS.yellow;
    return COLORS.red;
  };

  const getSinalColor = (value: number | null | undefined) => {
    if (value === null || value === undefined) return COLORS.gray;
    if (value > -60) return COLORS.green;
    if (value > -70) return COLORS.yellow;
    return COLORS.red;
  };

  // Função para converter hex para rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const renderItem = ({ item }: { item: Avaliacao }) => {
    const isExpanded = expandedItems[item.id];
    const checklistItems = parseChecklist(item.checklist);
    const statusColor = item.status === 'Finalizada' ? '#d1f4f0' : '#FBEFB1';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
            <Text style={styles.dateText}>
              {item.finalizacao ? item.finalizacao : 'Data não informada'}
            </Text>
          </View>
          <Text style={styles.cardTitle}>OS #{item.id}</Text>
        </View>

        <Text style={styles.clientText}>
          Cliente #{item.id_cliente}: {item.cliente}
        </Text>

        <View style={styles.potenciaContainer}>
          {/* Seção FIBRA */}
          {(item.potencia.fibra?.rx !== undefined || item.potencia.fibra?.tx !== undefined) && (
            <View style={styles.potenciaSection}>
              {(item.potencia.fibra?.rx || item.potencia.fibra?.tx) && (
                <Text style={styles.potenciaTitle}>Fibra Óptica</Text>
              )}
              <View style={styles.potenciaRow}>
                {item.potencia.fibra?.rx && (
                  <View style={[
                    styles.valueBox,
                    {
                      borderColor: getFibraColor(item.potencia.fibra.rx),
                      backgroundColor: hexToRgba(getFibraColor(item.potencia.fibra.rx), 0.1)
                    }
                  ]}>

                    <Text style={styles.valueLabel}>RX:</Text>
                    <Text style={styles.valueText}>{item.potencia.fibra.rx}</Text>
                  </View>
                )}
                {item.potencia.fibra?.tx && (
                  <View style={[
                    styles.valueBox,
                    {
                      borderColor: getFibraColor(item.potencia.fibra.tx),
                      backgroundColor: hexToRgba(getFibraColor(item.potencia.fibra.tx), 0.1)
                    }
                  ]}>
                    <Text style={styles.valueLabel}>TX:</Text>
                    <Text style={styles.valueText}>{item.potencia.fibra.tx}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Seção RÁDIO */}
          {(item.potencia.radio?.ccq  || item.potencia.radio?.sinal ) && (
            <View style={styles.potenciaSection}>
              {item.potencia.radio?.cqq || item.potencia.radio?.sinal && (
                <Text style={styles.potenciaTitle}>Rádio</Text>
              )}

              <View style={styles.potenciaRow}>
                {item.potencia.radio?.ccq && (
                  <View style={[
                    styles.valueBox,
                    {
                      borderColor: getCCQColor(item.potencia.radio.ccq),
                      backgroundColor: hexToRgba(getCCQColor(item.potencia.radio.ccq), 0.1)
                    }
                  ]}>

                    <Text style={styles.valueLabel}>CCQ:</Text>
                    <Text style={styles.valueText}>{item.potencia.radio.ccq}</Text>
                  </View>
                )}
                {item.potencia.radio?.sinal && (
                  <View style={[
                    styles.valueBox,
                    {
                      borderColor: getSinalColor(item.potencia.radio.sinal),
                      backgroundColor: hexToRgba(getSinalColor(item.potencia.radio.sinal), 0.1)
                    }
                  ]}>
                    <Text style={styles.valueLabel}>Sinal:</Text>
                    <Text style={styles.valueText}>{item.potencia.radio.sinal}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.detailsButton}
          onPress={() => toggleExpand(item.id)}
        >
          <Text style={styles.detailsButtonText}>
            {isExpanded ? 'Ocultar detalhes' : 'Ver detalhes'}
          </Text>
          <MaterialIcons
            name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
            size={20}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {item.mensagem && (
              <View style={styles.messageContainer}>
                <MaterialIcons name="message" size={14} color="#666" />
                <Text style={styles.messageText}> {item.mensagem}</Text>
              </View>
            )}

            <Text style={styles.technicianText}>
              <MaterialIcons name="person" size={14} color="#666" /> Avaliador: {item.avaliador}
            </Text>

            {checklistItems.length > 0 && (
              <View style={styles.checklistContainer}>
                <Text style={styles.checklistTitle}>Checklist da OS:</Text>
                {checklistItems.map((item, index) => (
                  <View key={index} style={styles.checklistSection}>
                    {item.section && (
                      <Text style={styles.sectionTitle}>{item.section}</Text>
                    )}
                    <View style={[
                      styles.checklistItem,
                      item.answer === 'Não' && styles.checklistItemNegative
                    ]}>
                      <Text style={styles.checklistQuestion}>{item.question}?</Text>
                      <View style={styles.checklistAnswer}>
                        <Text style={[
                          styles.answerText,
                          item.answer === 'Sim' && styles.answerPositive,
                          item.answer === 'Não' && styles.answerNegative
                        ]}>
                          {item.answer}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
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
      <Text style={styles.title}>Minhas Ordens de Serviço</Text>

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}
      >
        <MaterialIcons name="date-range" size={20} color={COLORS.primary} />
        <Text style={styles.dateButtonText}>
          {formatDateToDisplay(selectedDate)}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onChangeDate}
          maximumDate={new Date()}
        />
      )}

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : avaliacoes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="assignment" size={40} color="#ccc" />
          <Text style={styles.emptyText}>Nenhuma OS encontrada nesta data</Text>
        </View>
      ) : (
        <FlatList
          data={avaliacoes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <Text style={styles.resultsText}>
              {avaliacoes.length} {avaliacoes.length === 1 ? 'resultado' : 'resultados'} encontrados
            </Text>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateButtonText: {
    marginLeft: 8,
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultsText: {
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
  },
  clientText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },
  dateText: {
    fontSize: 12,
    color: '#666',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  expandedContent: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  messageText: {
    fontSize: 13,
    color: '#666',
    flex: 1,
  },
  technicianText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  checklistContainer: {
    marginTop: 8,
  },
  checklistTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  checklistSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  checklistItem: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
  },
  checklistItemNegative: {
    backgroundColor: '#ffebee',
    borderColor: '#ef9a9a',
  },
  checklistQuestion: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  checklistAnswer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  answerText: {
    fontSize: 13,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  answerPositive: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  answerNegative: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  potenciaContainer: {
    marginVertical: 8,
  },
  potenciaSection: {
    marginBottom: 12,
  },
  potenciaTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  potenciaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  valueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    minWidth: 80,
  },
  valueLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginRight: 4,
    color: '#333',
  },
  valueText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});

export default ServiceOrders;