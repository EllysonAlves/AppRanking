import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import TutorialCard from '../../components/TutorialCard';
import { getTutoriais } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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

const Tutorials: React.FC = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [tutoriais, setTutoriais] = useState<Tutorial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTutoriais = async () => {
      try {
        setLoading(true);
        setError('');
        
        if (!user?.access_token) {
          throw new Error('Usuário não autenticado');
        }

        const response = await getTutoriais(user.access_token);
        setTutoriais(response || []);
      } catch (err) {
        console.error('Erro ao buscar tutoriais:', err);
        setError('Erro ao carregar tutoriais');
      } finally {
        setLoading(false);
      }
    };

    fetchTutoriais();
  }, [user?.access_token]);

  const handleSearch = (text: string) => {
    setSearch(text);
  };

  const documentosFiltrados = tutoriais.filter((doc) =>
    doc.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tutoriais e Documentos</Text>

      <TextInput
        style={styles.input}
        placeholder="Buscar documento..."
        value={search}
        onChangeText={handleSearch}
      />

      {documentosFiltrados.length === 0 ? (
        <Text style={styles.emptyText}>
          {search ? 'Nenhum tutorial encontrado' : 'Nenhum tutorial disponível'}
        </Text>
      ) : (
        <FlatList
          data={documentosFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <TutorialCard data={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f3f3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
});

export default Tutorials;