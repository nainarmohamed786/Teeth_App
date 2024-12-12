import React, { useState, useRef } from 'react';
import { View, Button, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

const Index = () => {
  const [imageUri, setImageUri] = useState(null);
  const [colorAnalysis, setColorAnalysis] = useState(null);
  const [touchPoint, setTouchPoint] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null);

  const imageRef = useRef(null);

  // Capture an image using the device camera
  const captureImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      processImage(result.assets[0].uri);
    }
  };

  // Process the captured image
  const processImage = async (uri) => {
    try {
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 300 } }],
        { base64: true }
      );

      analyzeImage(manipulatedImage.base64);
    } catch (error) {
      console.error('Image processing failed:', error);
    }
  };

  // Analyze the image and compare tooth shades
  const analyzeImage = (base64Image) => {
    const mockShades = ['A1', 'A2', 'A3','A3.5','A4', 'B1', 'B2','B3','B4','C1','C2','C3','C4','D2','D3','D4'];
    const matchedShade = mockShades[Math.floor(Math.random() * mockShades.length)];

    setColorAnalysis({ shade: matchedShade });
  };

  // Handle touch on the image
  const handleImageTouch = (event) => {
    if (!imageDimensions) return;

    const { locationX, locationY } = event.nativeEvent;

    // Adjust coordinates based on actual image dimensions
    const relativeX = (locationX / imageDimensions.width) * 300;
    const relativeY = (locationY / imageDimensions.height) * 400;

    setTouchPoint({ x: relativeX, y: relativeY });

    // Simulate result based on touch point
    const mockShades = ['A1', 'A2', 'A3','A3.5','A4', 'B1', 'B2','B3','B4','C1','C2','C3','C4','D2','D3','D4'];
    const matchedShade = mockShades[Math.floor(Math.random() * mockShades.length)];
    setColorAnalysis({ shade: matchedShade });
  };

  // Get actual dimensions of the rendered image
  const handleImageLayout = (event) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Capture Image" onPress={captureImage} />

      {imageUri && (
        <View style={{ marginTop: 20, alignItems: 'center', position: 'relative' }}>
          <View
            style={{ width: 300, height: 400 }}
            onTouchEnd={handleImageTouch}
            onLayout={handleImageLayout}
          >
            <Image
              ref={imageRef}
              source={{ uri: imageUri }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {touchPoint && (
            <View
              style={{
                position: 'absolute',
                top: touchPoint.y,
                left: touchPoint.x,
                width: 15,
                height: 15,
                backgroundColor: 'red',
                borderRadius: 7.5,
                borderWidth: 2,
                borderColor: 'white',
              }}
            />
          )}

          {colorAnalysis ? (
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              Matching Shade: {colorAnalysis.shade}
            </Text>
          ) : (
            <Text style={{ fontSize: 16 }}>Analyzing image...</Text>
          )}

          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setImageUri(null);
              setTouchPoint(null);
              setColorAnalysis(null);
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  retakeButton: {
    backgroundColor: '#f4511e',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default Index;
