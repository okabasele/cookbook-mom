import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ChevronRight, ArrowLeftRight, Calculator } from 'lucide-react-native';
import iOS from '@/styles/ios';
import Section from '@/components/ui/Section';
import { CONVERSIONS } from '@/utils';
import type { ConversionCategory, ConversionData } from '@/types/mobile-utils';
import CalculatorScreen from './CalculatorScreen';
import { useRouter } from 'expo-router';


interface CategoryCardProps {
  category: ConversionCategory;
  data: ConversionData;
  onPress: () => void;
  isLast: boolean;
}

const CategoryCard = ({ category, data, onPress, isLast }: CategoryCardProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.categoryCard, isLast && styles.categoryCardLast]}
    activeOpacity={0.7}
  >
    <View style={styles.categoryCardContent}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{data.emoji}</Text>
      </View>
      <Text style={styles.categoryName}>{data.name}</Text>
    </View>
    <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
  </TouchableOpacity>
);

export function ConversionCalculatorScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState<ConversionCategory | null>(null);

  const handleBack = () => {
    setSelectedCategory(null);
  };

  return (
    <ScrollView style={styles.container}>
        <View style={styles.scrollView}>
          {/* Header Section */}
          <View style={styles.header}>
            <Text style={styles.headerSubtitle}>
              Convertissez facilement les mesures de vos recettes
            </Text>
          </View>

          {/* Categories */}
          <Section title="Choisir une catégorie">
            {Object.entries(CONVERSIONS).map(([key, data], index) => (
              <CategoryCard
                key={key}
                category={key as ConversionCategory}
                data={data}
                onPress={() => router.push(`/calculator/${key}`)}
                isLast={index === Object.entries(CONVERSIONS).length - 1}
              />
            ))}
          </Section>
        </View>
    </ScrollView>
  );
}

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

  // Header
  header: {
    paddingHorizontal: iOS.spacing.standard,
    paddingVertical: iOS.spacing.standard * 2,
    alignItems: 'center',
  },
  headerEmoji: {
    fontSize: 64,
    marginBottom: iOS.spacing.standard,
  },
  headerTitle: {
    ...iOS.typography.title2,
    color: iOS.colors.label,
    marginBottom: iOS.spacing.compact,
    textAlign: 'center',
  },
  headerSubtitle: {
    ...iOS.typography.body,
    color: iOS.colors.secondaryLabel,
    textAlign: 'center',
  },

  // Category Card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iOS.spacing.standard,
    paddingVertical: 14,
    backgroundColor: iOS.colors.systemBackground,
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
    minHeight: 58,
  },
  categoryCardLast: {
    borderBottomWidth: 0,
  },
  categoryCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: iOS.colors.systemGray6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  categoryName: {
    ...iOS.typography.body,
    color: iOS.colors.label,
  }
});
