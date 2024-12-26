import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import ProgressCircle from 'react-native-progress-circle';
import { colors } from '../../assets/constants';

const CountdownCircle = ({ duration }) => {

  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const progress = (timeLeft / duration) * 100;

  return (
    <View style={styles.container}>
      <ProgressCircle
        percent={progress}
        radius={50}
        borderWidth={5}
        color={colors.primaryText}
        shadowColor='lightgrey'
        bgColor={colors.backgroundLight}
      >
        <Image source={require("../../assets/images/microphone2.png")}
          resizeMode="contain"
          style={{height:90, alignSelf:'center'}}
        >
        </Image>
      </ProgressCircle>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CountdownCircle;
