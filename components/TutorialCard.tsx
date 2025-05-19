import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface Tutorial {
  id: number;
  title: string;
  descricao: string;
  url_view: string;
  url_download: string;
  criado_por: string;
  data_criacao: string;
  name_icon: string;
}

type Props = {
  data: Tutorial;
};

const TutorialCard: React.FC<Props> = ({ data }) => {
  const getIcon = () => {
    switch (data.name_icon) {
      case 'picture_as_pdf': return 'picture-as-pdf';
      case 'description': return 'description';
      case 'image': return 'image';
      default: return 'insert-drive-file';
    }
  };

  const handleVisualizar = () => {
    Linking.openURL(data.url_view).catch(err => 
      console.error('Erro ao abrir URL:', err)
    );
  };

  const handleDownload = () => {
    Linking.openURL(data.url_download).catch(err => 
      console.error('Erro ao iniciar download:', err)
    );
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  return (
    <View style={styles.card}>
      <MaterialIcons 
        name={getIcon()} 
        size={40} 
        color="#E74C3C" 
        style={styles.icon} 
      />

      <View style={styles.info}>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.description}>{data.descricao}</Text>
        
        <View style={styles.metaContainer}>
          <Text style={styles.metaText}>Criado por: {data.criado_por}</Text>
          <Text style={styles.metaText}>Data: {formatDate(data.data_criacao)}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.buttonContainer}
            onPress={handleVisualizar}
          >
            <MaterialIcons name="visibility" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Visualizar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.buttonContainer, styles.downloadButton]}
            onPress={handleDownload}
          >
            <MaterialIcons name="file-download" size={18} color="#FFF" />
            <Text style={styles.buttonText}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 10,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 6,
  },
  description: {
    color: '#7F8C8D',
    fontSize: 14,
    marginBottom: 10,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaText: {
    fontSize: 12,
    color: '#95A5A6',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3498DB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 6,
  },
  downloadButton: {
    backgroundColor: '#2ECC71',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default TutorialCard;