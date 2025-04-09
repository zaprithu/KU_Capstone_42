import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveIpAndPort = async (ip: string, port: number) => {
  try {
    await AsyncStorage.setItem('ip', ip);
    await AsyncStorage.setItem('port', port.toString()); // storing as string
  } catch (error) {
    console.error("Failed to save IP and Port", error);
  }
};


import IpInput, { IpInputData } from './IpInput';
import PortInput, { PortInputData } from './PortInput';
import ListenButton from './ListenButton';

const Separator = () => <View style={styles.separator} />;

const App: React.FC = () => {
  const [serverIpAddr, setServerIpAddr] = useState<string | null>(null);
  const [serverPort, setServerPort] = useState<number | null>(null);
  const [validIp, setValidIp] = useState<boolean>(false);
  const [validPort, setValidPort] = useState<boolean>(false);

  const loadIp = async (): Promise<IpInputData> => {
    try {
      const value = await AsyncStorage.getItem('ipValue');
      const valid = await AsyncStorage.getItem('ipValid');

      // If both values exist, return them
      if (value !== null && valid !== null) {
        return { value: value, valid: JSON.parse(valid) };
      } else {
        // Return default values if nothing is found
        return { value: null, valid: false };
      }
    } catch (error) {
      console.error("Failed to load IP", error);
      return { value: null, valid: false }; // return default values in case of an error
    }
  };

  const loadPort = async (): Promise<PortInputData> => {
    try {
      const value = await AsyncStorage.getItem('portValue');
      const valid = await AsyncStorage.getItem('portValid');

      // If both values exist, return them
      if (value !== null && valid !== null) {
        return { value: Number(value), valid: JSON.parse(valid) };
      } else {
        // Return default values if nothing is found
        return { value: null, valid: false };
      }
    } catch (error) {
      console.error("Failed to load Port", error);
      return { value: null, valid: false }; // return default values in case of an error
    }
  };

  const saveIp = async (data: IpInputData) => {
    if (!data.value)
      return;

    try {
      await AsyncStorage.setItem('ipValue', data.value);
      await AsyncStorage.setItem('ipValid', data.valid.toString());
    } catch (error) {
      console.error("Failed to save IP", error);
    }
  }

  const savePort = async (data: PortInputData) => {
    if (!data.value)
      return;

    try {
      await AsyncStorage.setItem('portValue', data.value.toString());
      await AsyncStorage.setItem('portValid', data.valid.toString());
    } catch (error) {
      console.error("Failed to save Port", error);
    }
  }

  const handleIpInputChange = (data: IpInputData) => {
    setServerIpAddr(data.value);
    setValidIp(data.valid);
    if (data.valid === true)
      saveIp(data);
  };

  const handlePortInputChange = (data: PortInputData) => {
    setServerPort(data.value);
    setValidPort(data.valid);
    if (data.valid === true)
      savePort(data);
  };

  useEffect(() => {
    const fetchIpData = async () => {
      const ipData = await loadIp();
      setServerIpAddr(ipData.value);
      setValidIp(ipData.valid);
    };

    const fetchPortData = async () => {
      const portData = await loadPort();
      setServerPort(portData.value);
      setValidPort(portData.valid);
    }

    fetchIpData();
    fetchPortData()
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
          <IpInput
            passToParent={handleIpInputChange}
            initialData={{ value: serverIpAddr, valid: validIp }}
            />
          <PortInput 
            passToParent={handlePortInputChange} 
            initialData={{ value: Number(serverPort), valid: validPort }} 
            />
        </View>

        <View style={styles.buttonContainer}>
          <ListenButton
            ip={{ value: serverIpAddr, valid: validIp }}
            port={{ value: serverPort, valid: validPort }} />
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
    textAlign: 'center'
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