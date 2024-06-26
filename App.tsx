import React, {useState, useRef, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {Face} from 'react-native-face-detection';
import {detectFaces} from 'react-native-face-detection';

const App = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [faces, setFaces] = useState<Face[]>([]);
  const camera = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.front;

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    })();
  }, []);

  const onFacesDetected = useCallback((detectedFaces: Face[]) => {
    setFaces(detectedFaces);
  }, []);

  const takePicture = useCallback(async () => {
    if (camera.current) {
      const photo = await camera.current.takePhoto();
      const detectedFaces = await detectFaces(photo.path);
      onFacesDetected(detectedFaces);
    }
  }, [onFacesDetected]);

  if (!hasPermission) {
    return <Text>카메라 권한이 필요합니다</Text>;
  }

  if (device == null) {
    return <Text>카메라를 불러오는 중...</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      <View style={styles.facesContainer}>
        {faces.map((face, index) => (
          <Text key={index} style={styles.faceText}>
            얼굴 {index + 1}: ({face.bounds.origin.x}, {face.bounds.origin.y})
          </Text>
        ))}
      </View>
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureButtonText}>사진 촬영</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  facesContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  faceText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 15,
  },
  captureButtonText: {
    fontSize: 16,
  },
});

export default App;
