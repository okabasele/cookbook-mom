import iOS from "@/styles/ios";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import Svg, { Path } from "react-native-svg";
// Checkmark SVG Component
const CheckmarkIcon = () => (
  <Svg width={14} height={11} viewBox="0 0 14 11" fill="none">
    <Path
      d="M1 5.5L5 9.5L13 1.5"
      stroke="white"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Checkbox Item Component
interface CheckboxItemProps {
  checked: boolean;
  onChange: () => void;
  children: string;
  number?: number;
  isLast?: boolean;
}

const CheckboxItem: React.FC<CheckboxItemProps> = ({
  checked,
  onChange,
  children,
  number,
  isLast = false,
}) => {
  return (
    <TouchableOpacity
      onPress={onChange}
      style={[styles.checkboxItem, !isLast && styles.checkboxItemBorder]}
      activeOpacity={0.7}
    >
      {/* Checkbox Circle */}
      <View
        style={[
          styles.checkbox,
          checked ? styles.checkboxChecked : styles.checkboxUnchecked,
        ]}
      >
        {checked && <CheckmarkIcon />}
      </View>

      {/* Content */}
      <View style={styles.checkboxContent}>
        <Text
          style={[styles.checkboxText, checked && styles.checkboxTextChecked]}
        >
          {number !== undefined && (
            <Text style={styles.checkboxNumber}>{number}. </Text>
          )}
          {children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default CheckboxItem;
const styles = StyleSheet.create({
    // Checkbox Item
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
    minHeight: 44,
  },
  checkboxItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
  },
  checkbox: {
    minWidth: 24,
    minHeight: 24,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxUnchecked: {
    borderColor: iOS.colors.systemGray5,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    borderColor: iOS.colors.tint,
    backgroundColor: iOS.colors.tint,
  },
  checkboxContent: {
    flex: 1,
  },
  checkboxText: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  },
  checkboxTextChecked: {
    color: iOS.colors.secondaryLabel,
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  checkboxNumber: {
    fontWeight: '700',
  },
})