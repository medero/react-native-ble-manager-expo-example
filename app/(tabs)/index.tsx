import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import {  NativeEventEmitter, NativeModules, PermissionsAndroid, Image, StyleSheet, Platform, Button } from "react-native";
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
import * as ExpoDevice from "expo-device";

BleManager.start({showAlert: false}).then(() => {
  console.error('BleManager.start!')
}).catch(console.error);

const doScan = async () => {
  const isPermissionsGranted = await requestPermissions();

  if (isPermissionsGranted) {
    BleManager.scan([], 5, true) // scan for 5 seconds, allow duplicates
      .then(() => {
        console.log('Scanning...');
      })
      .catch((err) => {
        console.error('Scan failed', err);
      });
  } else {
    console.warn('Bluetooth permissions not granted.');
  }
}

const handleDiscoverPeripheral = (peripheral) => {
  console.info('Got ble peripheral', peripheral);
  if (!peripheral.name) {
    peripheral.name = 'NO NAME';
  }
}

bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral);

const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    try {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Permission",
              message: "Bluetooth Low Energy requires Location",
              buttonPositive: "OK",
            }
          );
          return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
          const isAndroid31PermissionsGranted =
            await requestAndroid31Permissions();

          return isAndroid31PermissionsGranted;
        }

      } catch (err) {
        console.warn(err);
        return false;
      }
  }
}

const requestAndroid31Permissions = async () => {
  try {
      const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
      }
      );
      const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
      }
      );
      const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
          title: "Location Permission",
          message: "Bluetooth Low Energy requires Location",
          buttonPositive: "OK",
      }
      );

          console.info(bluetoothScanPermission);
          console.info(bluetoothConnectPermission);
          console.info(fineLocationPermission);

          return (
            bluetoothScanPermission === "granted" &&
            bluetoothConnectPermission === "granted" &&
            fineLocationPermission === "granted"
          );
  } catch (error) {
      console.error('try catch found ' + error?.message);
  }

  return false;
};


export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Hey Young World</ThemedText>
        <HelloWave />
        <Button onPress={doScan} title="Scan" />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
