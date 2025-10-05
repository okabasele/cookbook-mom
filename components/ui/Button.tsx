import iOS from '@/styles/ios';
import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'

type ButtonProps = {
    title: string;
    variant?: 'primary' | 'secondary' | 'glass';
    onPress?: () => void;
}

const Button = ({ title, variant = 'primary', onPress }: ButtonProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: iOS.colors.tint,
        borderRadius: 10000,
        padding: iOS.spacing.standard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        ...iOS.typography.headline,
        color: iOS.colors.systemBackground,
    },
})

export default Button