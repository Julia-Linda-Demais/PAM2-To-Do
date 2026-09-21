import { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { styles } from '../style/style';
import { BASE_URL } from '../App';

function TelaCadastro(){
    const navigation = useNavigation();

    const [nome, setNome] = useState('');

    const [usuario, setUsuario] = useState('');

    const [senha, setSenha] = useState('');

    const [confirmarSenha, setConfirmarSenha] = useState('');

    const fazerCadastro = async () => {
        if (!nome ||!usuario || !senha || !confirmarSenha){
            
            Alert.alert('Atenção', 'Preencha todos os campos!!');

      return;

        }
        
        if (senha !== confirmarSenha){
            Alert.alert('Atenção', 'As senhas estão diferentes!');
            return;
        }

        try{
           const response = await axios.post(`${BASE_URL}/usuarios`,{

            nome_user: usuario,
            senha: senha,
            nome: nome,

           });


           if(response.status === 201){

            Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
            navigation.navigate('Login'); //ou home?
           }

        } catch (error){
            Alert.alert(
                'Erro',
                error.response?.data?.message ||
                error.response?.data?.mensagem ||
                'Não foi possível realizar o cadastro!'
            );
        }
    }


      return (
  <View style={styles.container}>

    <Text style={styles.titulo}>Cadastro</Text>

    <TextInput
      style={styles.formulario}
      placeholder="Nome"
      onChangeText={setNome}
      value={nome}
      autoCapitalize="words"
    />

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

    <TextInput
      style={styles.formulario}
      placeholder="Confirmar senha"
      secureTextEntry
      onChangeText={setConfirmarSenha}
      value={confirmarSenha}
      autoCapitalize="none"
    />

    <TouchableOpacity
      style={styles.botaoPadraoCustom}
      onPress={fazerCadastro}
    >
      <Text style={styles.textoBotaoPadrao}>Cadastrar</Text>
    </TouchableOpacity>

  </View>
    );
}


export { TelaCadastro };