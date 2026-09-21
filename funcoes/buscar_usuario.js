import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';

import axios from 'axios';
import { styles } from '../style/style';



function BuscarUsuario() {

  const [id, setId] = useState('');
  const [users, setUsers] = useState(null);

  const buscarUsuario = async () => {

    if (!id) {
      Alert.alert('Erro', 'Digite um ID');
      return;
    }

    try {

      const response = await axios.get(
        `${BASE_URL}/usuario/${id}`
      );

      setUsers(response.data);

    } catch (error) {

      Alert.alert(
        'Erro',
        'Usuário não encontrado'
      );

      setUsers(null);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.titulo}>
        Buscar Usuário
      </Text>

      <TextInput
        style={styles.formulario}
        placeholder="Digite o ID"
        keyboardType="numeric"
        value={id}
        onChangeText={setId}
      />

      <TouchableOpacity
        style={styles.botaoPadraoCustom}
        onPress={buscarUsuario}
      >
        <Text style={styles.textoBotaoPadrao}>
          Buscar
        </Text>
      </TouchableOpacity>
      {users && (
        <View style= {styles.cardApresentar}>
          <Text>
            Nome: {users.nome}
          </Text>

          <Text>
            Usuário: {users.usuario}
          </Text>

        </View>
      )}
    </View>
  );
}

export {BuscarUsuario}