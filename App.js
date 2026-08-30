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
import { Button } from '@react-navigation/elements';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';

// Descobre o IP da máquina atual dinamicamente. Se não achar, usa o seu atual como fallback.
const host = Constants.expoConfig?.hostUri?.split(':').shift() || '192.168.200.229';
const BASE_URL = `http://${host}:3000`;


function TelaLogin() {

  const navigation = useNavigation();



  const [usuario, setUsuario] = useState('');

  const [senha, setSenha] = useState('');



  const fazerLogin = async () => {

    if (!usuario || !senha) {

      Alert.alert('Atenção', 'Preencha usuário e senha!');

      return;

    }



    try {

      const response = await axios.post(`${BASE_URL}/login`, {

        usuario: usuario,

        senha: senha,

      });



      if (response.status === 200) {

        navigation.navigate('Home');

      }

    } catch (error) {

      Alert.alert(

        'Erro',

        error.response?.data?.message || 'Usuário ou senha inválidos!'

      );

    }

  };



  return (

    <View style={styles.container}>

      <Text style={styles.titulo}>Login</Text>



      <TextInput

        style={styles.formulario}

        placeholder="Usuário"

        onChangeText={setUsuario}

        value={usuario}

        autoCapitalize="none"

      />

      <TextInput

        style={styles.formulario}

        placeholder="Senha"

        secureTextEntry

        onChangeText={setSenha}

        value={senha}

        autoCapitalize="none"

      />



      <TouchableOpacity style={styles.botaoPadraoCustom} onPress={fazerLogin}>

        <Text style={styles.textoBotaoPadrao}>Entrar</Text>

      </TouchableOpacity>

    </View>

  );

}


function HomeScreen() {
  const navigation = useNavigation();

  const [clima, setClima] = useState(null);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  const buscarClima = async () => {
    const minhaChave = '21322aa5'; 
    const cidade = 'Sao Paulo,SP';
    const url = `https://api.hgbrasil.com/weather?key=${minhaChave}&format=json-cors&city_name=${encodeURIComponent(cidade)}`;

    try {
      setCarregando(true);
      const response = await axios.get(url);
      
      if (response.data.valid_key === false) {
         setErro("Chave de API inválida.");
      } else {
         setClima(response.data.results);
         setErro('');
      }
    } catch (error) {
      setErro("Erro ao conectar com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscarClima();
  }, []);

  return (
    /* O ScrollView agora envolve todo o conteúdo com preenchimento correto */
    <ScrollView 
      style={{flex: 1, backgroundColor: '#121212'}} 
      contentContainerStyle={styles.scrollContentHome}
    >
      
      {/* EXIBIÇÃO DO CLIMA */}
      {carregando ? (
        <ActivityIndicator size="small" color="#f1da77" style={{marginVertical: 20}} />
      ) : erro ? (
        <Text style={styles.erro}>{erro}</Text>
      ) : clima && (
        <View style={styles.cartaoClimaHome}>
          <Text style={styles.tempHome}>{clima.temp}°C</Text>
          <Text style={styles.descHome}>{clima.city} - {clima.description}</Text>
        </View>
      )}

      <View style={styles.func}>
        <View style={styles.funcE}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_todos} 
            onPress={() => navigation.navigate('Todos')}
          >
            <Text style={styles.textoBotaoHome}>📂 Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_concluidos} 
            onPress={() => navigation.navigate('Concluidos')}
          >
            <Text style={styles.textoBotaoHome}>✅ Concluídos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_prog} 
            onPress={() => navigation.navigate('Relevancia')}
          >
            <Text style={styles.textoBotaoHome}>⚡ Relevância</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.funcD}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_hoje} 
            onPress={() => navigation.navigate('Hoje')}
          >
            <Text style={styles.textoBotaoHome}>📅 Hoje</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_sinal} 
            onPress={() => navigation.navigate('Pendente')}
          >
            <Text style={styles.textoBotaoHome}>⏳ Pendentes</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.bt_criar} 
            onPress={() => navigation.navigate('CriarTarefa')}
          >
            <Text style={styles.textoBotaoHome}>➕ Criar Tarefa</Text>
          </TouchableOpacity>
        </View> 
      </View>

      <View style={styles.botaoDev}>
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.botaoPadraoCustom} 
          onPress={() => navigation.navigate('Desenvolvedoras')}
        >
          <Text style={styles.textoBotaoPadrao}>Desenvolvedoras</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          activeOpacity={0.7}
          style={styles.botaoPadraoCustom} 
          onPress={() => navigation.navigate('Apresentar')}
        >
          <Text style={styles.textoBotaoPadrao}>Ver banco</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Item = ({id, descr_tarefa, dataConclusao, tempoExecucao, status, relevancia, onPress, onExcluir, onEditar}) => {
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


function TodoTodos() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);
  const route = useRoute();
  const navigation = useNavigation();

  const buscarTodasTarefas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tarefas`);
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTodasTarefas();
  }, []);

  useEffect(() => {
    if (route.params?.novaTarefa) {
      buscarTodasTarefas();
    }
  }, [route.params?.novaTarefa]);

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
      buscarTodasTarefas();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status da tarefa');
    }
  };

  const excluirTarefa = (id) => {
  console.log("Tentando excluir tarefa com ID:", id);


  const confirmar = typeof window !== 'undefined' && window.confirm 
    ? window.confirm("Deseja realmente excluir esta tarefa?")
    : true;

  if (confirmar) {
    axios.delete(`${BASE_URL}/tarefas/${id}`)
      .then(() => {
        setLista(prev => prev.filter(t => (t.id || t.id_tarefa) !== id));
        Alert.alert('Sucesso', 'Tarefa excluída!');
      })
      .catch(error => {
        console.error("Erro na requisição DELETE:", error);
        Alert.alert('Erro', 'Não foi possível excluir a tarefa');
      });
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
    <SafeAreaView style={styles.containerLista}> 
      <Text style={styles.tituloTodos}>Todas Tarefas</Text>
      
        <FlatList
  data={lista}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <Item 
      {...item}
      onPress={() => marcarComoConcluida(item)}
      onExcluir={(id) => excluirTarefa(id)}
    />
  )}
  contentContainerStyle={{ 
    paddingHorizontal: 20, 
    paddingBottom: 40 
  }}
/>
    </SafeAreaView>
  );
}

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

function TodoRelevantes() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarTarefas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tarefas`);
      setLista(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

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

  const importantes = lista.filter(t => t.relevancia === 'Importante');
  const medias = lista.filter(t => t.relevancia === 'Importância Média');
  const poucas = lista.filter(t => t.relevancia === 'Pouca Importância');
  const outras = lista.filter(t => !['Importante', 'Importância Média', 'Pouca Importância'].includes(t.relevancia));

  const dadosOrdenados = [...importantes, ...medias, ...poucas, ...outras];

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#f1da77" />
      </View>
    );
  }

  return (
    <View style={styles.containerLista}>
      <Text style={styles.tituloTodos}>Prioridade</Text>
      <FlatList
        data={dadosOrdenados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Item {...item} onPress={() => marcarComoConcluida(item)} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />
    </View>
  );
}

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

function TodoPendente() {
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarTarefas = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tarefas`);
      setLista(response.data.filter(t => t.status !== 'Concluído'));
    } catch (error) {
      console.error("Erro ao buscar tarefas pendentes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarTarefas();
  }, []);

  const alternarStatus = async (item) => {
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
      <Text style={styles.tituloTodos}>Tarefas Pendentes</Text>
      <FlatList
        data={lista}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Item {...item} onPress={() => alternarStatus(item)} />
        )}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />
    </View>
  );
}

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


/* pagina das programadoras */
function DevsScreen(){
  return(
    <ScrollView style={{backgroundColor: '#121212'}}>
      <View style={styles.containerDevs}>
        
        <Text style={styles.tituloDevs}>Desenvolvedoras</Text>

        <View style={styles.cardsContainer}>
          {/* card Agatha*/} 
          <View style={styles.card}>
            <Image source={require('./assets/agatha.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Agatha</Text>
            <Text style={styles.desc}>Designer</Text>
          </View>

          {/* card geovanna */}
          <View style={styles.card}>
            <Image source={require('./assets/geovanna.jpeg' )} style={styles.imagem} />
            <Text style={styles.nome}>Geovanna</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>

          {/* card isabella */}
          <View style={styles.card}>
            <Image source={require('./assets/isabella.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Isabella</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>

          {/* card julia */}
          <View style={styles.card}>
            <Image source={require('./assets/julia.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Julia</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

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

const MyStack = createStackNavigator({
  screens: {
    Login: TelaLogin,
    Home: HomeScreen,
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



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  containerHomeCustom: {
    width: '100%',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#f1da77', 
  },
  formulario: {
    width: '100%', 
    maxWidth: 320, 
    height: 45,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#1e1e1e', 
    color: '#fff', 
    alignSelf: 'center',
  },

  /* css clima ajustado para a home */
  cartaoClimaHome: {
    backgroundColor: '#1e1e1e',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  tempHome: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f1da77',
  },
  descHome: {
    color: '#aaa',
    fontSize: 14,
    fontStyle: 'italic',
  },

  /* css devs */
  containerDevs: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 40,
  },
  tituloDevs: {
    color: '#e7d27a',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    gap: 20,
  },
  card: {
    backgroundColor: '#000000',
    width: 180,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  imagem: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#e7d27a',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f1da77',
  },
  desc: {
    fontSize: 14,
    color: '#aaa', 
    textAlign: 'center',
  },

  /* HOME */
  scrollContentHome: {
    flexGrow: 1,
    paddingBottom: 80, // Espaço extra para conseguir rolar até o final sem cortar nada
    paddingHorizontal: 20,
    alignItems: 'center',
    paddingTop: 20,
  },
  func: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  funcE: {
    gap: 20,
    marginBottom: 20,
  },
  funcD: {
    gap: 20,
    marginBottom: 20,
    marginLeft: 20,
  },
  bt_todos: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  bt_concluidos: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  bt_prog: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  bt_hoje: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  bt_sinal: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  bt_criar: {
    backgroundColor: '#f1da77',
    width: 150,
    height: 120,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderRadius: 15, 
    borderWidth: 2,
    borderColor: '#e7d27a', 
  },
  botaoDev: {
    marginTop: 20,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
    gap: 10,
  },
  containerLista: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: 20, 
  },
  center: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloTodos: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '100%',
    textAlign: 'center',
    color: '#f1da77', 
  },
  item: {
    backgroundColor: '#1e1e1e', 
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
  },
  descrTarefa: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', 
  },
  Conclusao: {
    fontSize: 14,
    color: '#aaa', 
  },
  tempo: {
    fontSize: 14,
    color: '#aaa',
  },
  status: {
    fontWeight: 'bold',
    marginTop: 5,
    color: '#ff6b6b', 
  },
  relevancia: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#888',
  },
  botaoPadraoCustom: {
    backgroundColor: '#f1da77',
    height: 50,
    width: '100%', 
    maxWidth: 320,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#e7d27a',
    alignSelf: 'center', 
  },
  textoBotaoPadrao: {
    color: '#000', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  textoBotaoHome: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 12,
  },
  erro: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  tituloApresentar: {
    color: 'white',
  },
  cardApresentar: {
    backgroundColor: '#e7d27a',
    borderRadius: 20,
    width: 200,
    margin: 10,
    alignItems: 'center',
  },
  cardApresentarTarefas: {
    backgroundColor: '#e7d27a',
    borderRadius: 20,
    width: '100%',
    maxWidth: 350,
    marginVertical: 10,
    padding: 15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  tituloTarefas: {
    margin: 20,
    color: 'white',
  },
});