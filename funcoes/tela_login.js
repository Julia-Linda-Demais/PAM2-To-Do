import { useState } from 'react';
import { 
  Text, 
  View, 
  TextInput, 
  Alert, 
  TouchableOpacity, 
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import { styles } from '../style/style';
import {BASE_URL} from '../App'

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

      <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
        <Text style={styles.linkCadastro}>
        Não tem uma conta?{' '}
       <Text style={styles.textoLinkCadastro}>
        Cadastre-se
        </Text>
      </Text>
    </TouchableOpacity>

    </View>

  );

}

export {TelaLogin}