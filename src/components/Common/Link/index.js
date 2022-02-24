import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Styles from './style';

const Link = ({ desc, link, onPress }) => {
  const [isPress, setIsPress] = useState(false);
  const touchProps = {
    activeOpacity: 1,
    underlayColor: 'transparent',
    onHideUnderlay: () => {
      setIsPress(false);
      setTimeout(() => {
        if (onPress) {
          onPress();
        }
      }, 0)
    },
    onShowUnderlay: () => setIsPress(true),
    onPress: () => null
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.wrapperLink}>
        <Text style={Styles.text}>{desc}</Text>
        <TouchableHighlight {...touchProps}>
          <Text style={Styles.textDaftar(isPress)}>{link}</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default Link;
