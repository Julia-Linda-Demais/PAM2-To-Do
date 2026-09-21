import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  Alert, 
  FlatList, 
  ActivityIndicator, 
} from 'react-native';
import axios from 'axios';
import { styles } from '../style/style';
import {BASE_URL} from '../App'
import { Item } from '../App';


function TodoRelevantes() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
  
    const buscarTarefas = async () => {
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
      buscarTarefas();
    }, []);
  
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
        buscarTarefas();
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível atualizar o status');
      }
    };
  
    const importantes = lista.filter(t => t.relevancia === 'Importante');
    const medias = lista.filter(t => t.relevancia === 'Importância Média');
    const poucas = lista.filter(t => t.relevancia === 'Pouca Importância');
    const outras = lista.filter(t => !['Importante', 'Importância Média', 'Pouca Importância'].includes(t.relevancia));
  
    const dadosOrdenados = [...importantes, ...medias, ...poucas, ...outras];
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f1da77" />
        </View>
      );
    }
  
    return (
      <View style={styles.containerLista}>
        <Text style={styles.tituloTodos}>Prioridade</Text>
        <FlatList
          data={dadosOrdenados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Item {...item} onPress={() => marcarComoConcluida(item)} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        />
      </View>
    );
  }

export {TodoRelevantes}