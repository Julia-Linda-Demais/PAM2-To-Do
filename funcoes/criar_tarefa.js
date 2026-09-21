import { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  Alert,  
  TouchableOpacity, 
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import { styles } from '../style/style';

function CriarTarefa() {
  const navigation = useNavigation();

  const [novaDescricao, setNovaDescricao] = useState('');
  const [novoStatus, setNovoStatus] = useState('');
  const [novoTempo, setNovoTempo] = useState('');
  const [novaData, setNovaData] = useState('');
  const [novaRelevancia, setNovaRelevancia] = useState('');
  const [idUsuario, setIdUsuario] = useState('1'); 

  const salvarTarefa = async () => {
    if (!novaDescricao || !novaData) {
      Alert.alert("Erro", "Preencha a descrição e a data!");
      return;
    }

    try {
      const payload = {
        descr_tarefa: novaDescricao,
        dataConclusao: novaData,
        tempoExecucao: novoTempo || '1 hora',
        status: novoStatus || 'Pendente',
        relevancia: novaRelevancia || 'Normal',
        id_usuario: Number(idUsuario)
      };

      const response = await axios.post(`${BASE_URL}/tarefas`, payload);

      if (response.status === 201) {
        Alert.alert("Sucesso", "Tarefa criada no banco de dados!");
        navigation.navigate('Todos', { novaTarefa: payload });
      }
    } catch (error) {
      Alert.alert("Erro", error.response?.data?.mensagem || "Não foi possível salvar no banco");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Nova Tarefa</Text>

      <TextInput 
        style={styles.formulario} 
        placeholder="Descrição da Tarefa" 
        placeholderTextColor="#888"
        value={novaDescricao}
        onChangeText={setNovaDescricao}
      />
      
      <TextInput 
        style={styles.formulario} 
        placeholder="Data (ex: 2026-04-20)" 
        placeholderTextColor="#888"
        value={novaData}
        onChangeText={setNovaData}
      />

      <TextInput 
        style={styles.formulario} 
        placeholder="Tempo de execução (ex: 1 Hora)" 
        placeholderTextColor="#888"
        value={novoTempo}
        onChangeText={setNovoTempo}
      />

      <TextInput 
        style={styles.formulario} 
        placeholder="Status (ex: Em andamento, Pendente)" 
        placeholderTextColor="#888"
        value={novoStatus}
        onChangeText={setNovoStatus}
      />

      <TextInput 
        style={styles.formulario} 
        placeholder="Relevância (Importante, Média...)" 
        placeholderTextColor="#888"
        value={novaRelevancia}
        onChangeText={setNovaRelevancia}
      />

      <TextInput 
        style={styles.formulario} 
        placeholder="ID do Usuário" 
        placeholderTextColor="#888"
        keyboardType="numeric"
        value={idUsuario}
        onChangeText={setIdUsuario}
      />

      <TouchableOpacity style={styles.botaoPadraoCustom} onPress={salvarTarefa}>
        <Text style={styles.textoBotaoPadrao}>Criar Tarefa</Text>
      </TouchableOpacity>
    </View>
  );
}
export {CriarTarefa}