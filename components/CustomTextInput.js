import React from 'react';
import { StyleSheet } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';

const CustomTextInput = ({ label, value, onChangeText, keyboardType = 'default', secureTextEntry = false, style, ...props }) => {
    const { colors } = useTheme();

    return (
        <TextInput
            label={label}
            value={value}
            onChangeText={onChangeText}
            keyboardType={keyboardType}
            secureTextEntry={secureTextEntry}
            mode="outlined" 
            style={[styles.input, { backgroundColor: colors.background, color: colors.text }, style]}
            theme={{
                colors: {
                    primary: colors.primary,    
                    placeholder: colors.placeholder, 
                    text: colors.text,          
                    background: colors.background, 
                    onSurface: colors.text,    
                }
            }}
            {...props}
        />
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        marginBottom: 15, 
    },
});

export default CustomTextInput;