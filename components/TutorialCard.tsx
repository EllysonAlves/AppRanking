import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Documento } from '../services/documentos';

type Props = {
  data: Documento;
};

const TutorialCard: React.FC<Props> = ({ data }) => {
  const getIconName = () => {
    switch (data.tipo) {
      case 'pdf': return 'picture-as-pdf';
      case 'word': return 'description';
      case 'imagem': return 'image';
      default: return 'insert-drive-file';
    }
  };

  const handleVisualizar = () => {
    Linking.openURL(data.url);
  };

  return (
    <View style={styles.card}>
      <MaterialIcons name={getIconName()} size={40} color="#444" style={styles.icon} />

      <View style={styles.info}>
        <Text style={styles.title}>{data.titulo}</Text>
        <Text style={styles.description}>{data.descricao}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleVisualizar}>
            <Text style={styles.button}>Visualizar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleVisualizar}>
            <Text style={styles.button}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TutorialCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 4,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    color: '#555',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 10,
  },
  button: {
    color: '#007bff',
    fontWeight: 'bold',
    marginRight: 16,
  },
});
