import { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import { styles } from '../style/style';


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

export {HomeScreen}