import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
} from 'react-native';
import axios from 'axios';
import { styles } from '../style/style';


import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
function ApresentarTarefas(){
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${BASE_URL}/tarefas`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () =>{
    try{
      const response = await axios.get(API_URL);
      setTarefas(response.data)
      console.log(tarefas);
    }catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }finally {
      setLoading(false); 
    }
  };

  const renderItem = ({ item }) => (
    <View style ={styles.cardApresentarTarefas}>
      <Text style={styles.campo}>ID: {item.id}</Text>
      <Text style={styles.campo}>Descrição: {item.descr_tarefa}</Text>
      <Text style={styles.campo}>Concluir: {item.dataConclusao}</Text>
      <Text style={styles.campo}>Tempo de Execução:{item.tempoExecucao}</Text>
      <Text style={styles.campo}>Status: {item.status}</Text>
      <Text style={styles.campo}>Relevância: {item.relevancia}</Text>
    </View>
  );
  if (loading){
    return(
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f1da77" />
      </View>
    )
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.tituloApresentar}>Lista de Tarefas</Text>
      
      <FlatList
        data={tarefas}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}
export {ApresentarTarefas}