// app/(tabs)/home.tsx
import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Text, 
  StyleSheet,
  Platform 
} from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // Importe do pacote correto
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'expo-router';
import { COLORS } from '../../constants/Colors'


type ChecklistKey = '1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9'|'10'|'11'|'12'|'13'|'14'|'15';

interface ChecklistItem {
  title: string;
  items: string[];
}

const HomeScreen = () => {
  const { signOut, user } = useAuth();
  const [selectedChecklist, setSelectedChecklist] = useState<ChecklistKey | undefined>();
  
  // (Mantendo a mesma definição de checklists que você já tem)
  const checklists: Record<ChecklistKey, ChecklistItem> = {
    '1': {
        title: 'Checklist para Oscilação',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Configurações do equipamento Canal e Largura',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '2': {
        title: 'Checklist para Lentidão',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Configurações do equipamento Canal e Largura',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '3': {
        title: 'Checklist para Potência Alta',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '4': {
        title: 'Checklist para Sem Acesso',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '5': {
        title: 'Checklist para Suporte Externo Câmeras',
        items: [
          'Foi organizado no padrão TiConnect?',
          'Foi mandada a foto da câmera funcionando no ConnectCam?'
        ]
      },
      '6': {
        title: 'Checklist para Puxar Cabo Interno',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '7': {
        title: 'Checklist para Troca de Cabo',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '8': {
        title: 'Checklist para Instalação Fibra',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Configurações do equipamento Canal e Largura',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?',
          'Foi inserido o nome (Ticonnect), na rede wifi?',
          'Baixou central do cliente no telefone do cliente?',
          'O técnico colocou a rede 5G como a rede principal?',
          'O técnico mandou a localização/id e porta da CTO?'
        ]
      },
      '9': {
        title: 'Checklist para Instalação de Câmeras',
        items: [
          'Foi mandada a foto da câmera junto com o seu patrimônio?',
          'O contrato da câmera foi assinado?',
          'Foi organizado no padrão TiConnect?',
          'Foi mandada a foto da câmera funcionando no ConnectCam?'
        ]
      },
      '10': {
        title: 'Checklist para Troca de Endereço',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Configurações do equipamento Canal e Largura',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?',
          'Foi inserido o nome (Ticonnect), na rede wifi?',
          'Baixou central do cliente no telefone do cliente?',
          'O técnico colocou a rede 5G como a rede principal?',
          'O técnico mandou a localização/id e porta da CTO?'
        ]
      },
      '11': {
        title: 'Checklist para Troca de Endereço Rádio',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferido o sinal e o CCQ da antena?',
          'A potência do sinal e o CCQ ficou na margem do permitido?',
          'Configurações do equipamento Canal e Largura',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?',
          'Foi inserido o nome (Ticonnect), na rede wifi?',
          'Baixou central do cliente no telefone do cliente?',
          'O técnico colocou a rede 5G como a rede principal?'
        ]
      },
      '12': {
        title: 'Checklist para Troca de Equipamento',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Tirar foto do patrimônio dos equipamentos que foram colocados/retirados',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      },
      '13': {
        title: 'Checklist para Instalação IPTV',
        items: [
          'Foi tirada a foto do link no aplicativo?',
          'Foi tirada a foto do IPTV funcionando?',
          'Foi tirada a foto da organização (TV/TVBOX)?',
          'Foi tirada a foto do cabeamento TVBOX->TV?'
        ]
      },
      '14': {
        title: 'Checklist para Suporte IPTV',
        items: [
          'Foi tirada a foto do link no aplicativo?',
          'Foi tirada a foto do IPTV funcionando?',
          'Foi tirada a foto da organização (TV/TVBOX)?',
          'Foi tirada a foto do cabeamento TVBOX->TV?'
        ]
      },
      '15': {
        title: 'Checklist para Sem Acesso ao Repetidor',
        items: [
          'A ordem de serviço estava com o Status em "Execução"?',
          'Foi aferida a potência do Sinal, na casa do cliente e na CTO? Frequência 1490nm.',
          'A potência do sinal óptico ficou na margem de sinal permitido = ou < que -25db?',
          'Configurações do equipamento Canal e Largura',
          'Os Equipamentos e cabos ficaram organizados na parede, de acordo com o Padrão Ti Connect?',
          'Foi Feito o teste de velocidade?',
          'O teste de velocidade bateu com o plano do cliente?',
          'Foi ativado o Ping e liberado o acesso remoto?'
        ]
      }
  };

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
        
        <Link href="/resources" asChild>
          <TouchableOpacity style={styles.linkCard}>
            <MaterialIcons name="video-library" size={24} color={COLORS.primary} />
            <Text style={styles.linkText}>Vídeos e Materiais</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/tutorials" asChild>
          <TouchableOpacity style={styles.linkCard}>
            <Ionicons name="document-text" size={24} color={COLORS.primary} />
            <Text style={styles.linkText}>Tutoriais e Documentos</Text>
          </TouchableOpacity>
        </Link>

        <Text style={styles.sectionTitle}>Checklists</Text>
        
        <View style={styles.checklistContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedChecklist}
              onValueChange={(itemValue: ChecklistKey) => setSelectedChecklist(itemValue)}
              style={styles.picker}
              dropdownIconColor={COLORS.primary}
            >
              <Picker.Item label="Selecione um checklist" value="" />
              <Picker.Item label="Oscilação" value="1" />
              <Picker.Item label="Lentidão" value="2" />
              <Picker.Item label="Potência Alta" value="3" />
              <Picker.Item label="Sem Acesso" value="4" />
              <Picker.Item label="Suporte Externo Câmeras" value="5" />
              <Picker.Item label="Puxar Cabo Interno" value="6" />
              <Picker.Item label="Troca de Cabo" value="7" />
              <Picker.Item label="Instalação Fibra" value="8" />
              <Picker.Item label="Instalação de Câmeras" value="9" />
              <Picker.Item label="Troca de Endereço" value="10" />
              <Picker.Item label="Troca de Endereço Rádio" value="11" />
              <Picker.Item label="Troca de Equipamento" value="12" />
              <Picker.Item label="Instalação IPTV" value="13" />
              <Picker.Item label="Suporte IPTV" value="14" />
              <Picker.Item label="Sem Acesso ao Repetidor" value="15" />
            </Picker>
          </View>

          {selectedChecklist && checklists[selectedChecklist] && (
            <View style={styles.checklistContent}>
              <Text style={styles.checklistTitle}>
                {checklists[selectedChecklist].title}
              </Text>
              {checklists[selectedChecklist].items.map((item, index) => (
                <Text key={index} style={styles.checklistItem}>
                  • {item}
                </Text>
              ))}
            </View>
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
});

export default HomeScreen;