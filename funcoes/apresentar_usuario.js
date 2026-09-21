import * as React from 'react';
import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  StyleSheet, 
  Alert, 
  Image, 
  FlatList, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  SafeAreaView 
} from 'react-native';
import {createStaticNavigation,useNavigation, useRoute} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { styles } from '../style/style';


function ApresentarUsuario(){
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = `${BASE_URL}/usuarios`;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () =>{
    try{
      const response = await axios.get(API_URL);
      setUsers(response.data)
      console.log(users);
    }catch (error) {
      console.error("Erro ao buscar Usuários:", error);
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
      <Text style={styles.tituloApresentar}>Lista de Usuários</Text>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()} 
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

export {ApresentarUsuario}