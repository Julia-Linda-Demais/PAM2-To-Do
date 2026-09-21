import * as React from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,    
} from 'react-native';

import { styles } from '../style/style';

function Apresentar(){
  const navigation = useNavigation();
  return(
    <ScrollView 
      style={{flex: 1, backgroundColor: '#121212'}} 
      contentContainerStyle={styles.scrollContentHome}
    >
      <View style={styles.func}>
        <View style={styles.funcE}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_todos} 
            onPress={() => navigation.navigate('Usuarios')}
          >
            <Text style={styles.textoBotaoHome}>Ver todos Usuários</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_concluidos} 
            onPress={() => navigation.navigate('Devs')}
          >
            <Text style={styles.textoBotaoHome}>Ver todos Desenvolvedoras</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_prog} 
            onPress={() => navigation.navigate('Tarefas')}
          >
            <Text style={styles.textoBotaoHome}>Ver todas Tarefas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.funcD}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_hoje} 
            onPress={() => navigation.navigate('UsuariosPorId')}
          >
            <Text style={styles.textoBotaoHome}>Ver Usuário por Id</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_sinal} 
            onPress={() => navigation.navigate('TarefasPorUsuario')}
          >
            <Text style={styles.textoBotaoHome}>Ver Tarefas por Usuário</Text>
          </TouchableOpacity>
        </View> 
      </View>
    </ScrollView>
)}
export {Apresentar}