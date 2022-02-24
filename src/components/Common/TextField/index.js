import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TextInput, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { change } from 'redux-form';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
import { colors } from '../../../utils';
import Gap from '../Gap';
import Styles from './style';
import BtnIconField from './BtnIconField';

const TextField = ({
  label,
  theme,
  iconName,
  multiline,
  radiusSize,
  externalRef,
  placeholder,
  keyboardType,
  blurOnSubmit,
  returnKeyType,
  autoCapitalize,
  secureTextEntry,
  onSubmitEditing,
  onFocusTextField,
  showSoftInputOnFocus,
  styleInput,
  maxLength,
  autoFillField,
  showEraser,
  input: { onChange, ...restInput },
  meta: { error, warning, touched, form, dispatch },
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [zIndexSize, setZIndexSize] = useState(-1);
  const [secureText, setSecureText] = useState(secureTextEntry);
  const [value, onChangeText] = useState('');
  const [color, setColor] = useState(colors.colorVariables.indigo1);
  const animatedIsFocused = useRef(new Animated.Value(0)).current;
  const [ml, setMl] = useState(0);

  const updateField = () => {
    dispatch(change(form, restInput.name, ''));
    onChangeText('');
  }
  const handleFocus = () => {
    if (onFocusTextField) onFocusTextField();
    setIsFocused(true);
  }
  const handleBlur = () => setIsFocused(false);

  useEffect(() => {
    if (!isFocused.current || !restInput.value.current) {
      if (isFocused || restInput.value !== '') {
        setZIndexSize(1);
      } else {
        setTimeout(() => setZIndexSize(-1), 20);
        setZIndexSize(-1)
      }

      Animated.timing(animatedIsFocused, {
        toValue: (isFocused || restInput.value !== '') ? 1 : 0,
        duration: 200,
        useNativeDriver: false
      }).start();
    }

    if (!touched.current || !error.current) {
      if (touched && error) {
        setColor(colors.colorVariables.danger);
      } else {
        setColor(colors.colorVariables.indigo1);
      }
    }
  }, [isFocused, restInput.value, touched, error]);

  useEffect(() => {
    if (restInput.value === '') onChangeText('');
    if (restInput.value && autoFillField) onChangeText(restInput.value);
    if (restInput.value) onChangeText(restInput.value);
    if (restInput.value && isNaN(Number(restInput.value))) {
      let date = new Date(restInput.value);
      if (!isNaN(date.getTime())) {
        let localeDate = restInput.value.split('-');
        onChangeText(`${localeDate[2]}-${localeDate[1]}-${localeDate[0]}`);
      }
    }
  }, [restInput.value]);

  const labelStyle = {
    position: 'absolute',
    left: iconName ? responsiveWidth(6.5) : responsiveWidth(4),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [17, -5],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [responsiveFontSize(1.8), responsiveFontSize(1.6)],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (error && touched) ? colors.colorVariables.danger : colors.colorVariables.black1,
        (error && touched) ? colors.colorVariables.danger : isFocused ? colors.colorVariables.blue1
          : colors.colorVariables.black1
      ],
    }),
    backgroundColor: theme ? theme : colors.colorVariables.white,
    paddingHorizontal: 4,
    zIndex: zIndexSize,
  }

  return (
    <View>
      {label && <Animated.Text style={labelStyle}>
        {label}
      </Animated.Text>}
      <View style={Styles.wrapper(radiusSize, touched && error, isFocused, theme)}>
        {iconName &&
          <>
            <Icon
              name={iconName}
              size={responsiveFontSize(2.5)}
              color={color}
            />
            <Gap width={1.5} />
          </>
        }
        <TextInput
          {...restInput}
          ref={externalRef}
          onBlur={handleBlur}
          style={[Styles.input, styleInput, { paddingRight: ml * 1.7 }]}
          multiline={multiline}
          onFocus={handleFocus}
          onChangeText={(text) => {
            onChange(text);
            onChangeText(text);
          }}
          value={value}
          placeholder={placeholder}
          keyboardType={keyboardType}
          blurOnSubmit={blurOnSubmit}
          secureTextEntry={secureText}
          returnKeyType={returnKeyType}
          autoCapitalize={autoCapitalize}
          onSubmitEditing={onSubmitEditing}
          underlineColorAndroid={touched && error ? colors.colorVariables.danger : isFocused ? colors.colorVariables.blue1 : colors.borderColor}
          showSoftInputOnFocus={showSoftInputOnFocus}
          maxLength={maxLength}
        />
        {secureTextEntry && !(error && touched) &&
          <View style={Styles.btnField}>
            <BtnIconField
              iconName={secureText ? "visibility-off" : "visibility"}
              bgColor='transparent'
              onPress={() => setSecureText(!secureText)}
            />
          </View>
        }
        {!secureTextEntry && !(error && touched) && restInput.value !== '' && !showEraser &&
          <View style={Styles.btnField} onLayout={(e) => setMl(e.nativeEvent.layout.width)}>
            <BtnIconField
              iconName='cancel'
              onPress={updateField}
            />
          </View>
        }
        {touched && error &&
          <View style={Styles.btnField}>
            <BtnIconField
              iconName='error'
              iconColor={colors.colorVariables.danger}
            />
          </View>
        }
      </View>
      {touched && error &&
        <View style={Styles.errorHelper}>
          <Text style={Styles.errorText}>{error}</Text>
        </View>
      }
    </View>
  )
}

export default TextField;
