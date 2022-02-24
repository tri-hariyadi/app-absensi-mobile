import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../../Common';
import Styles from './style';

const Header = ({
  title,
  onPress,
  background,
  rippleColor,
  pdTop,
  onLayout,
  styleContainer
}) => {
  const [width, setWidth] = React.useState(0);
  const onBtnBackPressed = () => {
    if (onPress) onPress();
  }

  const OnLayout = (e) => {
    if (onLayout) onLayout(e);
  }

  return (
    <View style={[Styles.container(background, pdTop), styleContainer]} onLayout={OnLayout}>
      <View onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <Button
          BtnIcon
          large={1.2}
          rippleColor={rippleColor}
          iconName="keyboard-arrow-left"
          type="transparent"
          containerBtnIconStyle={Styles.containerBtnIconStyle}
          onPress={onBtnBackPressed}
        />
      </View>
      <View style={Styles.titleWrapper(width)}>
        <Text style={Styles.title}>{title}</Text>
      </View>
    </View>
  )
}

export default Header;
