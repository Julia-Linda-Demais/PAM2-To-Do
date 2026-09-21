import { useState, useEffect } from 'react';
import { 
  Text, 
  View,  
  FlatList, 
  ActivityIndicator, 
 
} from 'react-native';

import axios from 'axios';
import { styles } from '../style/style';
import {BASE_URL} from '../App'
import { Item } from '../App';



function TodoConcluidos() {
    const [lista, setLista] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const buscarTarefas = async () => {
        try {
          const response = await axios.get(`${BASE_URL}/tarefas`);
          setLista(response.data.filter(t => t.status === 'Concluído'));
        } catch (error) {
          console.error("Erro ao buscar tarefas concluídas:", error);
        } finally {
          setLoading(false);
        }
      };
      buscarTarefas();
    }, []);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#f1da77" />
        </View>
      );
    }
  
    return (
      <View style={styles.containerLista}>
        <Text style={styles.tituloTodos}>Tarefas Concluídas</Text>
        <FlatList
          data={lista}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <Item {...item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        />
      </View>
    );
  }
  export {TodoConcluidos}