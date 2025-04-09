import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Button, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Network from 'expo-network';

import IpInput from './IpInput';
import PortInput from './PortInput';
import ListenButton from './ListenButton';

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

  const handleIpInputChange = (value: string) => {
    setServerIpAddr(value);
  };

  const handlePortInputChange = (value: number) => {
    setServerPort(value);
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
          <IpInput passToParent={handleIpInputChange}/>
          <PortInput passToParent={handlePortInputChange}/>
        </View>

        <View style={styles.buttonContainer}>
          <ListenButton ip={serverIpAddr} port={serverPort}/>
        </View>


        <StatusBar style='light' />
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
    textAlign:'center'
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
  },
  serverAddr: {
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default App;