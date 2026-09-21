import { styles } from '../style/style';
import { useState, useEffect  } from 'react';
import { 
  Text, 
  View,  
  ActivityIndicator,
} from 'react-native';

function TodoHoje() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const obtenerDataAtual = () => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0'); 
    const ano = String(hoje.getFullYear()).slice(-2); 
    return `${dia}/${mes}/${ano}`;
  };

  const dataDeHoje = obtenerDataAtual();

  const buscarTarefas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tarefas`);
      const filtradas = response.data.filter(t => t.dataConclusao === dataDeHoje);
      setLista(filtradas);
    } catch (error) {
      console.error("Erro ao buscar tarefas de hoje:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, [dataDeHoje]);

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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f1da77" />
      </View>
    );
  }

  return (
    <View style={styles.containerLista}>
      <Text style={styles.tituloTodos}>Tarefas de Hoje ({dataDeHoje})</Text>
      {lista.length > 0 ? (
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Item {...item} onPress={() => marcarComoConcluida(item)} />
          )}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'gray' }}>Nenhuma tarefa para hoje!</Text>
        </View>
      )}
    </View>
  );
}

export {TodoHoje}