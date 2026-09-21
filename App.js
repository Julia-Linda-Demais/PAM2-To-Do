import { 
  Text, 
  View, 
  TouchableOpacity, 
} from 'react-native';
import {createStaticNavigation} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import { styles } from './style/style.js';
import { TelaLogin } from './funcoes/tela_login';
import { TelaCadastro } from './funcoes/tela_cadastro';
import { HomeScreen } from './funcoes/home';
import { TodoTodos } from './funcoes/todo_todos';
import { TodoHoje } from './funcoes/todo_hoje';
import { TodoRelevantes } from './funcoes/todo_relevante';
import { BuscarTarefasPorUsuario } from './funcoes/buscar_tarefa_usuario.js';
import { TodoConcluidos } from './funcoes/todo_concluido';
import { TodoPendente } from './funcoes/todo_pendente';
import { CriarTarefa } from './funcoes/criar_tarefa';
import { DevsScreen } from './funcoes/devs.js';
import { Apresentar } from './funcoes/apresentar.js'
import { BuscarUsuario } from './funcoes/buscar_usuario.js';
import { ApresentarDevs } from './funcoes/apresentar_devs.js'
import { ApresentarTarefas } from './funcoes/apresentar_tarefas.js'
import { ApresentarUsuario } from './funcoes/apresentar_usuario.js'



// Descobre o IP da máquina atual dinamicamente. Se não achar, usa o seu atual como fallback.
const host = Constants.expoConfig?.hostUri?.split(':').shift() || '192.168.15.1';
// export const BASE_URL = `http://${host}:3000`;
export const BASE_URL = `http://localhost:${PORT}`;




export const Item = ({id, descr_tarefa, dataConclusao, tempoExecucao, status, relevancia, onPress, onExcluir, onEditar}) => {
  const concluida = status === 'Concluído';

  return (
    /* Trocado de TouchableOpacity para View */
    <View style={styles.item}>
      
      {/* Clique na área das informações da tarefa */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text style={[styles.descrTarefa, concluida && {textDecorationLine: 'line-through', color: 'gray'}]}>
          {descr_tarefa}
        </Text>
        <Text style={styles.Conclusao}> Prazo: {dataConclusao}</Text>
        <Text style={styles.tempo}> Tempo de Execução: {tempoExecucao}</Text>
        <Text style={[styles.status, concluida && {color: 'green'}]}> Status: {status}</Text>
        <Text style={styles.relevancia}> Prioridade: {relevancia}</Text>
      </TouchableOpacity>

      {/* Área dos Botões de Ação */}
      <View style={styles.acoesContainer}>
      
        {onExcluir && (
          <TouchableOpacity 
            style={styles.btnExcluir} 
            onPress={() => onExcluir(id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.txtAcao}>🗑️ Excluir</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};


const MyStack = createStackNavigator({
  screens: {
    Login: TelaLogin,
    Home: HomeScreen,
    Cadastro: TelaCadastro,
    Hoje: TodoHoje,
    Relevancia: TodoRelevantes,
    Todos: TodoTodos,
    Pendente: TodoPendente,
    Concluidos: TodoConcluidos,
    CriarTarefa: CriarTarefa,
    Desenvolvedoras: DevsScreen,
    Apresentar: Apresentar,
    Usuarios: ApresentarUsuario,
    Devs: ApresentarDevs,
    Tarefas: ApresentarTarefas,
    UsuariosPorId: BuscarUsuario,
    TarefasPorUsuario: BuscarTarefasPorUsuario,
    
  },
});

const Navigation = createStaticNavigation(MyStack);

export default function App() {
  return (
    <>
      <Navigation />
      <StatusBar style="light" />
    </>
  );
}