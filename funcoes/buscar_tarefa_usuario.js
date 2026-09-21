import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  Alert, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
   
} from 'react-native';
import {BASE_URL} from '../App'
import axios from 'axios';
import { styles } from '../style/style';


function BuscarTarefasPorUsuario() {
    const [id_usuario, setId_usuario] = useState('');
    const [tarefas, setTarefas] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const BuscarTarefasdoUsuario = async () => {
      if (!id_usuario) {
        Alert.alert('Erro', 'Digite um ID');
        return;
      }
  
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/tarefasUsuario/${id_usuario}`);
        setTarefas(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Tarefas não encontradas ou usuário inexistente');
        setTarefas([]);
      } finally {
        setLoading(false);
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.cardApresentarTarefas}>
        <Text style={styles.campo}>ID: {item.id}</Text>
        <Text style={styles.campo}>Descrição: {item.descr_tarefa}</Text>
        <Text style={styles.campo}>Data: {item.dataConclusao}</Text>
        <Text style={styles.campo}>Tempo: {item.tempoExecucao}</Text>
        <Text style={styles.campo}>Status: {item.status}</Text>
        <Text style={styles.campo}>Relevância: {item.relevancia}</Text>
      </View>
    );
  
    return (
      <ScrollView 
        style={{ flex: 1, backgroundColor: '#121212' }} 
        contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      >
        <Text style={styles.titulo}>Buscar Tarefas por Usuário</Text>
  
        <TextInput
          style={styles.formulario}
          placeholder="Digite o ID do Usuário"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={id_usuario}
          onChangeText={setId_usuario}
        />
  
        <TouchableOpacity style={styles.botaoPadraoCustom} onPress={BuscarTarefasdoUsuario}>
          <Text style={styles.textoBotaoPadrao}>Buscar</Text>
        </TouchableOpacity>
  
        {loading ? (
          <ActivityIndicator size="small" color="#f1da77" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={tarefas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            scrollEnabled={false} // Desativa o scroll próprio para rodar no ScrollView da tela
            contentContainerStyle={{ marginTop: 20 }}
          />
        )}
      </ScrollView>
    );
  }

export {BuscarTarefasPorUsuario}