import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  FlatList, 
  ActivityIndicator, 
} from 'react-native';
import axios from 'axios';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { styles } from '../style/style';


function ApresentarDevs(){
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${BASE_URL}/desenvolvedores`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () =>{
    try{
      const response = await axios.get(API_URL);
      setUsuarios(response.data)
      console.log(usuarios);
    }catch (error) {
      console.error("Erro ao buscar desenvolvedores:", error);
    }finally {
      setLoading(false); 
    }
  };

  const renderItem = ({ item }) => (
    <View style ={styles.cardApresentar}>
      <Text style={styles.campo}>ID: {item.id}</Text>
      <Text style={styles.campo}>UserName: {item.usuario}</Text>
      <Text style={styles.campo}>Nome: {item.nome}</Text>
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
      <Text style={styles.tituloApresentar}>Lista de Desenvolvedoras</Text>
      
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

export {ApresentarDevs}