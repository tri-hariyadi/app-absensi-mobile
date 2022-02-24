import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
  Animated
} from 'react-native';
import { change } from 'redux-form';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { colors, customFont } from '../../../utils';
import Gap from '../Gap';
Feather.loadFont();

const SelectNative = ({
  label,
  options,
  noOptionMessages,
  dropdownStyle,
  animated,
  disabled,
  isLoading,
  autoFillField,
  iconName,
  input: { onChange, ...restInput },
  meta: { error, warning, touched, form, dispatch },
}) => {
  const [value, setValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [button, setButton] = useState(null);
  const [buttonFrame, setButtonFrame] = useState(null);
  const [heightDropdown, setHeightDropdown] = useState(0);
  const [fieldWidth, setFieldWidth] = useState(0);
  const [isFocus, setIsFocus] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: (isFocus || restInput.value !== '') ? 1 : 0,
      duration: 200,
      useNativeDriver: false
    }).start();
  }, [isFocus, restInput]);

  useEffect(() => {
    if (autoFillField && restInput.value) setValue(restInput.value)
  }, [restInput]);

  const onSelectPressed = () => {
    updatePosition(() => setShowDropdown(!showDropdown));
    setIsFocus(true);
  }

  const onItemSelected = (value, label) => {
    dispatch(change(form, restInput.name, value));
    setValue(label);
    setShowDropdown(!showDropdown)
    setIsFocus(false);
  }

  const updatePosition = (callback) => {
    if (button && button.measure) {
      button.measure((fx, fy, width, height, px, py) => {
        setButtonFrame({ x: px, y: py, w: width, h: height });
        callback && callback();
      });
    }
  }

  const NoOptionMessage = () => {
    return (
      <Text style={[Styles.rowText, { textAlign: 'center' }]}>
        {noOptionMessages ? noOptionMessages : 'No Options'}
      </Text>
    )
  }

  const RenderLoading = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
        <Gap height={1} />
        <ActivityIndicator size={20} color={colors.colorVariables.blue1} />
        <Text style={Styles.textLoading}>Loading...</Text>
      </View>
    );
  }

  const RenderDropdown = () => {
    return (
      <FlatList
        data={options}
        keyExtractor={(item, idx) => idx.toString()}
        automaticallyAdjustContentInsets={false}
        renderItem={({ item }) =>
          <TouchableOpacity
            style={{ backgroundColor: 'black' }}
            onPress={() => onItemSelected(item.value, item.label)}>
            <Text style={Styles.rowText}>{item.label}</Text>
          </TouchableOpacity>
        }
      />
    );
  }

  const RenderModal = () => {
    if (showDropdown && buttonFrame) {
      const dropdownStyle = dropdownStyle && dropdownStyle
      const frameStyle = calcPosition();
      const animationType = animated ? 'none' : 'fade';
      return (
        <Modal
          animationType={animationType}
          visible={true}
          transparent={true}
          onRequestClose={() => {
            setShowDropdown(false)
            setIsFocus(false);
          }}
          supportedOrientations={['portrait', 'portrait-upside-down', 'landscape', 'landscape-left', 'landscape-right']}>
          <TouchableWithoutFeedback
            accessible={false}
            disabled={!showDropdown}
            onPress={() => {
              setShowDropdown(false)
              setIsFocus(false);
            }}>
            <View style={Styles.modal}>
              <View
                onLayout={e => setHeightDropdown(e.nativeEvent.layout.height)}
                style={[Styles.dropdown, dropdownStyle, frameStyle]}>
                {options && options.length > 0 ? RenderDropdown() : isLoading ? RenderLoading() : NoOptionMessage()}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      );
    }
  }

  const calcPosition = () => {
    const dimensions = Dimensions.get('window');
    const windowWidth = dimensions.width;
    const windowHeight = dimensions.height;

    const dropdownHeight = (dropdownStyle && StyleSheet.flatten(dropdownStyle).height) ||
      // StyleSheet.flatten(Styles.dropdown).maxHeight;
      heightDropdown

    const bottomSpace = windowHeight - buttonFrame.y - buttonFrame.h;
    const maxDropDownHeight = dropdownHeight < 167.5 ? 167 : dropdownHeight
    const rightSpace = windowWidth - buttonFrame.x;
    const showInBottom = bottomSpace >= maxDropDownHeight || bottomSpace >= buttonFrame.y;
    const showInLeft = rightSpace >= buttonFrame.x;

    const positionStyle = {
      // height: dropdownHeight,
      width: fieldWidth,
      top: showInBottom ? buttonFrame.y + buttonFrame.h + 6 : Math.max(0, buttonFrame.y - dropdownHeight) - 6,
    };

    if (dropdownStyle && StyleSheet.flatten(dropdownStyle).width && StyleSheet.flatten(dropdownStyle).position) {
      // positionStyle.width = StyleSheet.flatten(dropdownStyle).width;
      positionStyle.width = fieldWidth;
      positionStyle.position = StyleSheet.flatten(dropdownStyle).position;
    }
    if (showInLeft) {
      const dropdownLeft = (dropdownStyle && StyleSheet.flatten(dropdownStyle).left);
      if (dropdownStyle) {
        positionStyle.left = dropdownLeft;
      } else {
        positionStyle.left = buttonFrame.x;
      }
    } else {
      const dropdownWidth = (dropdownStyle && StyleSheet.flatten(dropdownStyle).width) ||
        (style && StyleSheet.flatten(style).width) || -1;
      if (dropdownWidth !== -1) {
        positionStyle.width = dropdownWidth;
      }
      positionStyle.right = rightSpace - buttonFrame.w;
    }
    return positionStyle;
  }

  const labelStyle = {
    position: 'absolute',
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [2, -16],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [responsiveFontSize(1.8), responsiveFontSize(1.6)],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [
        (error && touched) ? colors.colorVariables.danger : colors.colorVariables.black1,
        isFocus ? (error && touched) ? colors.colorVariables.danger : colors.colorVariables.blue1
          : colors.colorVariables.black1
      ],
    }),
    backgroundColor: colors.colorVariables.white,
    paddingHorizontal: 0,
  }

  return (
    <View>
      <TouchableOpacity
        ref={fieldRef => setButton(fieldRef)}
        // onLayout={e => setFieldWidth(e.nativeEvent.layout.width)}
        onPress={onSelectPressed}
        disabled={disabled}
        style={Styles.select}>
        <Icon
          name={iconName}
          size={responsiveFontSize(2.5)}
          color={error && touched ? colors.colorVariables.danger : colors.colorVariables.black} />
        <Gap width={2.4} />
        <View onLayout={e => setFieldWidth(e.nativeEvent.layout.width)} style={Styles.selectContent(isFocus, error && touched)}>
          <View style={Styles.labelItemWrapper}>
            <Animated.Text style={labelStyle}>{label}</Animated.Text>
            <Text style={Styles.labelItem}>{value}</Text>
          </View>
          <Feather
            name={showDropdown ? 'chevron-up' : 'chevron-down'}
            size={responsiveFontSize(2.5)}
            color={error && touched ? colors.colorVariables.danger : isFocus ? colors.colorVariables.blue1 : colors.colorVariables.black}
            style={{ marginRight: 9 }} />
        </View>
      </TouchableOpacity>
      {RenderModal()}
      <TextInput
        {...restInput}
        style={{ display: 'none' }}
        value={restInput.value}
      />
      {touched && error &&
        <View style={Styles.errorHelper}>
          <Text style={Styles.errorText}>{error}</Text>
        </View>
      }
    </View>
  )
}

export default SelectNative;

const Styles = StyleSheet.create({
  select: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  selectContent: (isFocus, error) => ({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
    borderBottomWidth: isFocus ? 1.7 : 1,
    borderColor: error ? colors.colorVariables.danger : isFocus ? colors.colorVariables.blue1 : colors.borderColor,
  }),
  labelItem: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: customFont.secondary[400],
    color: colors.colorVariables.indigo1,
    textTransform: 'capitalize',
    position: 'relative',
    bottom: -5
  },
  labelItemWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
  },
  modal: {
    flexGrow: 1,
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.1)'
  },
  dropdown: {
    position: 'absolute',
    // height: (33 + StyleSheet.hairlineWidth) * 5,
    maxHeight: (33 + StyleSheet.hairlineWidth) * 5,
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 5,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    overflow: 'hidden',
  },
  rowText: {
    paddingHorizontal: 6,
    paddingVertical: 10,
    fontSize: responsiveFontSize(1.9),
    color: '#000',
    backgroundColor: 'white',
    textAlignVertical: 'center'
  },
  textLoading: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: customFont.secondary[400],
    marginTop: 5,
    marginBottom: 5,
    color: colors.colorVariables.indigo1
  },
  errorHelper: {
    flexDirection: 'row-reverse',
    marginTop: 9
  },
  errorText: {
    color: colors.colorVariables.danger,
    textAlign: 'left',
    // marginRight: responsiveWidth(4.5),
    fontSize: responsiveFontSize(1.5),
    fontFamily: customFont.secondary[400]
  },
});
