import React from 'react';
import { SafeAreaView } from 'react-native';
import { TabItem } from '../../Common';
import { styles } from './style';

const BottomNavigator = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabItem 
            key={index} 
            title={label} 
            active={isFocused} 
            onPress={onPress}
            onLongPress={onLongPress}
          />
        );
      })}
    </SafeAreaView>
  )
}

export default BottomNavigator
