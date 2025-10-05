import { Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import Animated, {
    type AnimatedStyle
} from 'react-native-reanimated';
import iOS from '@/styles/ios';
import { Trash2 } from 'lucide-react-native';

type ActionButtonProps = {
    onPress: () => void;
    type?: 'flag' | 'delete';
    animatedStyle?: AnimatedStyle<any>;
    actionText?: string;
}

const ActionButton = ({ onPress, type, animatedStyle, actionText }: ActionButtonProps) => {
    return (
        <Animated.View style={[styles.actionButton, animatedStyle]}>
          <TouchableOpacity
            style={[
              styles.actionTouchable,
              styles.circularButton,
              {
                backgroundColor: type === 'delete'
                  ? iOS.colors.systemRed
                  : iOS.colors.systemGray
              }
            ]}
            onPress={onPress}
            activeOpacity={0.7}
          >
        <View style={styles.iconPlaceholder}>
{
    type === 'delete' ? (<Trash2 size={20} color="#fff" />) : null
}
        </View>
          </TouchableOpacity>
        {actionText && <Text style={styles.actionText}>{actionText}</Text>}
        </Animated.View>
    );
};
const styles = StyleSheet.create({
 actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    width: 80,
    height: 80,
  },
  actionTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circularButton: {
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: 'transparent',
  },
  actionText: {
    color: iOS.colors.systemGray,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});



export default ActionButton