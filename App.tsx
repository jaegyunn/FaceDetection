import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Button,
} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Face} from 'react-native-face-detection';
import {detectFaces} from 'react-native-face-detection';

const App = () => {
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front;

  const [cameraPermission, requestCameraPermission] = useState(false);
  const [imageSource, setImageSource] = useState('');

  useEffect(() => {
    async function getPermission() {
      const permission = await Camera.requestCameraPermission();
      console.log('Camera permission status: ', permission);
      if (permission == 'denied') await Linking.openSettings();
    }
    getPermission();
  }, []);

  const capturePhoto = async () => {
    if (camera.current != null) {
      const photo = await camera.current.takePhoto({});
      setImageSource(photo.path);
      requestCameraPermission(false);
      console.log(photo.path);
    }
  };

  if (!cameraPermission) {
    return <Text>카메라 권한이 필요합니다</Text>;
  }

  if (device == null) {
    return <Text>Camera not available</Text>;
  }

  return (
    <Camera
      ref={camera}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={cameraPermission}
      photo={true}
    />
  );
};

export default App;
