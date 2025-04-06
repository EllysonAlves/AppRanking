import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList } from 'react-native';
import TutorialCard from '../../components/TutorialCard';
import { documentos as documentosMock } from '../../services/documentos';

const tutorials: React.FC = () => {
  const [search, setSearch] = useState('');
  const [documentosFiltrados, setDocumentosFiltrados] = useState(documentosMock);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filtrados = documentosMock.filter((doc) =>
      doc.titulo.toLowerCase().includes(text.toLowerCase())
    );
    setDocumentosFiltrados(filtrados);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tutoriais e Documentos</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar documento..."
        value={search}
        onChangeText={handleSearch}
      />

      <FlatList
        data={documentosFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TutorialCard data={item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default tutorials;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f3f3',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
