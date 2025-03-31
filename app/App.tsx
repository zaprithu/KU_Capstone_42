import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, {useState, useEffect} from 'react';
import * as Network from 'expo-network';

import IpInput from './IpInput';
import PortInput from './PortInput';

const Separator = () => <View style={styles.separator} />;

const App: React.FC = () => {
  const [clientIpAddr, setClientIpAddr] = useState<string | null>(null);
  const [serverIpAddr, setServerIpAddr] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState<number | null>(null);

  const getIpAddress = async () => {
    try {
      const ip = await Network.getIpAddressAsync();
      setClientIpAddr(ip);
    } catch (error) {
      console.error("Error getting IP address:", error);
    }
  };

  useEffect(() => {
    getIpAddress();
  }, []);
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./assets/logo.png')} 
          style={styles.logo}
        />
      </View>

      <View style={styles.infoContainer}>
        {/* <View style={styles.infoRow}>
          <Text style={[styles.greenText, styles.underline]}>User</Text>
          <View style={styles.inline}>
            <Text style={styles.greenText}>IP: </Text>
            <Text style={styles.whiteText}>{clientIpAddr ? clientIpAddr : '...'}</Text>
          </View>
        </View>
        {/* <Separator/> */}
        {/* <Text>{'\n'}</Text> */} 
        {/* <View style={styles.infoRow}> */}
          {/* <Text style={[styles.greenText, styles.underline]}>Server</Text>
          <View style={styles.inline}>
            <Text style={styles.greenText}>IP:     </Text>
            <Text style={styles.whiteText}>{serverIpAddr ? serverIpAddr : '...'}</Text>
          </View>
          <View style={styles.inline}>
            <Text style={styles.greenText}>Port: </Text>
            <Text style={styles.whiteText}>{serverPort ? serverPort : '...'}</Text>
          </View> */}
          <IpInput/>
          <PortInput/>
        {/* </View> */}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.listenButton} onPress={()=>{Alert.alert("PRESSED")}}>
          <Text style={styles.listenButtonText}>Start Listening</Text>
        </TouchableOpacity>
      </View>


      <StatusBar style="auto" />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111113',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20
  },
  greenText: {
    color: '#2bd659'
  },
  whiteText: {
    color: '#e3e3e3'
  },
  infoRow: {
    // flex: 1,
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
    // borderWidth: 1,
    borderColor: 'white'
  },
  underline: {
    textDecorationLine: 'underline'
  },
  logo: { 
    objectFit: 'contain',
    width: 200,
    height: 200,
    // borderColor: 'yellow',
    // borderWidth: 1
  },
  logoContainer: {
    // flex: 1,
    // borderWidth: 1,
    // borderColor: 'blue'
  },
  infoContainer: {
    // flex: 1,
    // borderWidth: 1,
    // borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  inline: {
    flexDirection: 'row'
  },
  separator: {
    marginVertical: 8,
    borderBottomColor: '#2bd659',
    borderBottomWidth: StyleSheet.hairlineWidth,
    // borderWidth: 
    borderWidth: 10,
    width: '100%'
  },
  buttonContainer: {
    width: 200,
    height: 200,
    // flex: 1,
    // borderColor:'blue',
    // borderWidth: 1
  },
  listenButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2bd659',
    height: 200,
    width: 200,
    borderRadius: 100,
    padding: 20,
  },
  listenButtonText: {
    fontSize: 22,
    fontWeight: 'bold'
  }
});

export default App;