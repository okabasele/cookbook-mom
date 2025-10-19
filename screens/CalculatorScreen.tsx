import type { ConversionCategory, ConversionData } from '@/types/mobile-utils';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChevronRight, ArrowLeftRight, ChevronLeft } from 'lucide-react-native';
import iOS from '@/styles/ios';
import Section from '@/components/ui/Section';
import { CONVERSIONS } from '@/utils';
import Button from '@/components/ui/Button';
import { NavButton } from '@/components/ui/NavButton';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// ===========================
//  COMPONENTS
// ===========================

interface ExampleRowProps {
  example: {
    from: number;
    fromUnit: string;
    to: number;
    toUnit: string;
    label: string;
  };
  onPress: () => void;
  isLast: boolean;
}

const ExampleRow = ({ example, onPress, isLast }: ExampleRowProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.exampleRow, isLast && styles.exampleRowLast]}
    activeOpacity={0.7}
  >
    <View style={styles.exampleRowContent}>
      <Text style={styles.exampleLabel}>{example.label}</Text>
      <Text style={styles.exampleConversion}>
        {example.from} {example.fromUnit} = {Math.round(example.to * 10) / 10}{' '}
        {example.toUnit}
      </Text>
    </View>
    <ChevronRight size={18} color={iOS.colors.tertiaryLabel} />
  </TouchableOpacity>
);

interface UnitSegmentedControlProps {
  units: string[];
  selected: string;
  onChange: (unit: string) => void;
}

const UnitSegmentedControl = ({
  units,
  selected,
  onChange,
}: UnitSegmentedControlProps) => (
  <View style={styles.segmentedControl}>
    {units.map((unit) => (
      <TouchableOpacity
        key={unit}
        onPress={() => onChange(unit)}
        style={[
          styles.segmentButton,
          selected === unit && styles.segmentButtonSelected,
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.segmentButtonText,
            selected === unit && styles.segmentButtonTextSelected,
          ]}
        >
          {unit}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

interface CalculatorScreenProps {
  category: ConversionCategory;
  data: ConversionData;
  onBack: () => void;
}

const CalculatorScreen = ({}: //   category,
//   data,
//   onBack,
CalculatorScreenProps) => {
  const navigation = useNavigation();
  const router = useRouter();
  const { category } = useLocalSearchParams() as { category: string };
  const data = CONVERSIONS[category as ConversionCategory];

  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(data.units[0]);
  const [toUnit, setToUnit] = useState(data.units[1] || data.units[0]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <NavButton
          onPress={navigation.goBack}
          icon={<ChevronLeft size={18} color={iOS.colors.tint} />}
        />
      ),
    });
  }, [category]);

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);

    if (result !== '') {
      setInputValue(result.toString());
    }
  };

  const handleLoadExample = (example: ExampleRowProps['example']) => {
    setInputValue(example.from.toString());
    setFromUnit(example.fromUnit);
    setToUnit(example.toUnit);
  };

  const calculateResult = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';

    if (category === 'temperature' || category === 'length') {
      return Math.round(data.convert(value, fromUnit) * 10) / 10;
    } else {
      return Math.round(data.convert(value, fromUnit, toUnit) * 10) / 10;
    }
  };

  const result = calculateResult();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.scrollView}>
        {/* Calculator Card */}

        <View style={styles.calculatorCard}>
          {/* From Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>De</Text>
            <TextInput
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="0"
              keyboardType="numeric"
              style={styles.input}
              placeholderTextColor={iOS.colors.tertiaryLabel}
              autoFocus
            />
            <UnitSegmentedControl
              units={data.units}
              selected={fromUnit}
              onChange={setFromUnit}
            />
          </View>

          {/* Swap Button */}
          <View style={styles.swapButtonContainer}>
            <TouchableOpacity
              onPress={handleSwapUnits}
              style={styles.swapButton}
              activeOpacity={0.7}
            >
              <ArrowLeftRight
                size={20}
                color={iOS.colors.tint}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>

          {/* To Section */}
          <View style={styles.outputSection}>
            <Text style={styles.inputLabel}>Vers</Text>
            <View style={styles.output}>
              <Text
                style={[
                  styles.outputText,
                  !result && styles.outputTextPlaceholder,
                ]}
              >
                {result || '0'}
              </Text>
            </View>
            <UnitSegmentedControl
              units={data.units}
              selected={toUnit}
              onChange={setToUnit}
            />
          </View>
        </View>

        {/* Examples Section */}
        {data.examples && data.examples.length > 0 && (
          <View style={styles.examplesSection}>
            <Section title="Conversions courantes">
              {data.examples.map((example, index) => (
                <ExampleRow
                  key={index}
                  example={example}
                  onPress={() => handleLoadExample(example)}
                  isLast={index === data.examples.length - 1}
                />
              ))}
            </Section>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CalculatorScreen;

// ===========================
// STYLES
// ===========================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.colors.secondarySystemBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },

  // Example Row
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iOS.spacing.standard,
    paddingVertical: 12,
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    minHeight: 54,
  },
  exampleRowLast: {
    borderBottomWidth: 0,
  },
  exampleRowContent: {
    flex: 1,
  },
  exampleLabel: {
    ...iOS.typography.body,
    color: iOS.colors.label,
    marginBottom: 2,
  },
  exampleConversion: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
  },

  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: iOS.colors.systemGray6,
    borderRadius: 9,
    padding: 2,
    gap: 2,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  segmentButtonSelected: {
    backgroundColor: iOS.colors.systemBackground,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentButtonText: {
    ...iOS.typography.subheadline,
    fontWeight: '600',
    color: iOS.colors.label,
  },
  segmentButtonTextSelected: {
    color: iOS.colors.label,
  },

  // Calculator Card
  calculatorCard: {
    marginHorizontal: iOS.spacing.standard,
    marginTop: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 16,
    padding: iOS.spacing.standard * 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  // Input Section
  inputSection: {
    marginBottom: iOS.spacing.standard,
  },
  inputLabel: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    marginBottom: iOS.spacing.compact,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    padding: iOS.spacing.standard,
    ...iOS.typography.largeTitle,
    color: iOS.colors.label,
    backgroundColor: iOS.colors.systemGray6,
    marginBottom: iOS.spacing.compact,
    minHeight: 68,
  },

  // Swap Button
  swapButtonContainer: {
    alignItems: 'center',
    marginVertical: iOS.spacing.compact,
  },
  swapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: iOS.colors.systemGray6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Output Section
  outputSection: {
    marginTop: iOS.spacing.compact,
  },
  output: {
    borderRadius: 10,
    padding: iOS.spacing.standard,
    backgroundColor: iOS.colors.systemGray6,
    minHeight: 68,
    justifyContent: 'center',
    marginBottom: iOS.spacing.compact,
  },
  outputText: {
    ...iOS.typography.largeTitle,
    color: iOS.colors.label,
  },
  outputTextPlaceholder: {
    color: iOS.colors.tertiaryLabel,
  },

  // Examples Section
  examplesSection: {
    marginTop: iOS.spacing.standard,
  },
});
