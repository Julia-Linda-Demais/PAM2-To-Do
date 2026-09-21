import { styles } from '../style/style';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Item } from '../App';
import axios from 'axios';
import {BASE_URL} from '../App'

function TodoPendente() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const buscarTarefas = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tarefas`);
        setLista(response.data.filter(t => t.status !== 'Concluído'));
      } catch (error) {
        console.error("Erro ao buscar tarefas pendentes:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      buscarTarefas();
    }, []);
  
    const alternarStatus = async (item) => {
      const novoStatus = item.status === 'Concluído' ? 'Pendente' : 'Concluído';
      try {
        await axios.put(`${BASE_URL}/tarefas/${item.id}`, {
          descr_tarefa: item.descr_tarefa,
          dataConclusao: item.dataConclusao,
          tempoExecucao: item.tempoExecucao,
          status: novoStatus,
          relevancia: item.relevancia
        });
        buscarTarefas();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o status');
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
      <View style={styles.containerLista}>
        <Text style={styles.tituloTodos}>Tarefas Pendentes</Text>
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Item {...item} onPress={() => alternarStatus(item)} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        />
      </View>
    );
  }

export {TodoPendente}