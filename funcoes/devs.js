/* pagina das programadoras */
import { 
  Text, 
  View, 
  Image, 
  ScrollView, 
} from 'react-native';
import { styles } from '../style/style';

function DevsScreen(){
  return(
    <ScrollView style={{backgroundColor: '#121212'}}>
      <View style={styles.containerDevs}>
        
        <Text style={styles.tituloDevs}>Desenvolvedoras</Text>

        <View style={styles.cardsContainer}>
          {/* card Agatha*/} 
          <View style={styles.card}>
            <Image source={require('../assets/agatha.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Agatha</Text>
            <Text style={styles.desc}>Designer</Text>
          </View>

          {/* card geovanna */}
          <View style={styles.card}>
            <Image source={require('../assets/geovanna.jpeg' )} style={styles.imagem} />
            <Text style={styles.nome}>Geovanna</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>

          {/* card isabella */}
          <View style={styles.card}>
            <Image source={require('../assets/isabella.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Isabella</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>

          {/* card julia */}
          <View style={styles.card}>
            <Image source={require('../assets/julia.jpeg')} style={styles.imagem} />
            <Text style={styles.nome}>Julia</Text>
            <Text style={styles.desc}>Dev Back-End</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

export {DevsScreen}