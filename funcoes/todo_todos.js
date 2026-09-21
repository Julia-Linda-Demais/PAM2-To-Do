import { styles } from '../style/style';
import { useState, useEffect} from 'react';
import { 
  Text, 
  View,  
  Alert, 
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL} from '../App'
import { Item } from '../App';


function TodoTodos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();

  const buscarTodasTarefas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tarefas`);
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTodasTarefas();
  }, []);

  useEffect(() => {
    if (route.params?.novaTarefa) {
      buscarTodasTarefas();
    }
  }, [route.params?.novaTarefa]);

  const marcarComoConcluida = async (item) => {
    const novoStatus = item.status === 'Concluído' ? 'Pendente' : 'Concluído';
    try {
      await axios.put(`${BASE_URL}/tarefas/${item.id}`, {
        descr_tarefa: item.descr_tarefa,
        dataConclusao: item.dataConclusao,
        tempoExecucao: item.tempoExecucao,
        status: novoStatus,
        relevancia: item.relevancia
      });
      buscarTodasTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
    }
  };

  const excluirTarefa = (id) => {
  console.log("Tentando excluir tarefa com ID:", id);


  const confirmar = typeof window !== 'undefined' && window.confirm 
    ? window.confirm("Deseja realmente excluir esta tarefa?")
    : true;

  if (confirmar) {
    axios.delete(`${BASE_URL}/tarefas/${id}`)
      .then(() => {
        setLista(prev => prev.filter(t => (t.id || t.id_tarefa) !== id));
        Alert.alert('Sucesso', 'Tarefa excluída!');
      })
      .catch(error => {
        console.error("Erro na requisição DELETE:", error);
        Alert.alert('Erro', 'Não foi possível excluir a tarefa');
      });
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f1da77" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.containerLista}> 
      <Text style={styles.tituloTodos}>Todas Tarefas</Text>
      
        <FlatList
  data={lista}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <Item 
      {...item}
      onPress={() => marcarComoConcluida(item)}
      onExcluir={(id) => excluirTarefa(id)}
    />
  )}
  contentContainerStyle={{ 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  }}
/>
    </SafeAreaView>
  );
}
 
export {TodoTodos}