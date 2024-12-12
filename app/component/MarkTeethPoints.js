import { PanResponder, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const MarkTeethPoints = ({ onPointSelected, imageUri }) => {
    const [points, setPoints] = useState([]);

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: (evt) => {
            const newPoint = { x: evt.nativeEvent.locationX, y: evt.nativeEvent.locationY };
            const updatePoints = [newPoint, ...points];
            setPoints(updatePoints);
            onPointSelected(updatePoints)

            console.log("Updated Points", updatePoints)
        }
    })
    return (
        <View>
            <Text>MarkTeethPoints</Text>
        </View>
    )
}

export default MarkTeethPoints

const styles = StyleSheet.create({})