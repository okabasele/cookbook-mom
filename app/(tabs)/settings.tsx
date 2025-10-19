import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import iOS from '@/styles/ios';
import InfoRow from '@/components/ui/InfoRow';
import ActionRow from '@/components/ui/ActionRow';
export default function SettingsScreen() {
  const [recipeCount, setRecipeCount] = useState(0);
  const [storageUsed, setStorageUsed] = useState('0');

  useEffect(() => {
    loadRecipeData();
  }, []);

  const loadRecipeData = async () => {
    try {
      const recipes = await AsyncStorage.getItem('recipes');
      if (recipes) {
        const parsedRecipes = JSON.parse(recipes);
        setRecipeCount(parsedRecipes.length);
        // Calculate approximate storage (simplified)
        const sizeInBytes = new Blob([recipes]).size;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
        setStorageUsed(sizeInMB);
      }
    } catch (error) {
      console.error('Error loading recipe data:', error);
    }
  };

  const handleExportAll = () => {
    Alert.alert(
      '📄 Export de recettes',
      'Export de toutes vos recettes en cours...\n\nVous recevrez un PDF avec toutes vos recettes.',
      [{ text: 'OK' }]
    );
  };

  const handleClearData = () => {
    Alert.alert(
      'Effacer toutes les recettes',
      'Êtes-vous sûr de vouloir supprimer toutes vos recettes?\n\nCette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('recipes');
              Alert.alert('✅ Succès', 'Toutes les données ont été effacées');
              await loadRecipeData();
            } catch (error) {
              Alert.alert('Erreur', "Impossible d'effacer les données");
            }
          },
        },
      ]
    );
  };

  const handleHelp = (topic: string) => {
    const helpTexts: Record<string, string> = {
      addRecipe:
        '📱 Pour ajouter une recette:\n\n1. Appuyez sur le bouton "+" dans l\'onglet Recettes\n2. Collez le lien YouTube de la recette\n3. Choisissez la langue de traduction\n4. Validez et modifiez si nécessaire',
      translate:
        '🌍 Pour traduire une recette:\n\n1. Ouvrez une recette existante\n2. Appuyez sur "Traduire"\n3. Choisissez la langue cible\n4. La traduction s\'affiche automatiquement',
      conversions:
        '🔢 Pour convertir des unités:\n\n1. Allez dans l\'onglet "Conversions"\n2. Choisissez la catégorie (température, volume, etc.)\n3. Entrez la valeur à convertir\n4. Le résultat s\'affiche instantanément',
      support:
        '📧 Pour nous contacter:\n\nEmail: support@recettes-app.com\n\nNous répondons sous 24h.',
    };
    Alert.alert('Aide', helpTexts[topic], [{ text: 'OK' }]);
  };

  // Section Header Component
  const SectionHeader = ({ children }: { children: string }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{children}</Text>
    </View>
  );

  // Section Footer Component
  const SectionFooter = ({ children }: { children: string }) => (
    <View style={styles.sectionFooter}>
      <Text style={styles.sectionFooterText}>{children}</Text>
    </View>
  );

  // Primary Button Component
  const PrimaryButton = ({
    onPress,
    children,
  }: {
    onPress: () => void;
    children: string;
  }) => (
    <TouchableOpacity
      style={styles.primaryButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.primaryButtonText}>{children}</Text>
    </TouchableOpacity>
  );

  // Danger Button Component
  const DangerButton = ({ onPress }: { onPress: () => void }) => (
    <TouchableOpacity
      style={styles.dangerButton}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.dangerButtonText}>Effacer toutes les recettes</Text>
    </TouchableOpacity>
  );

  // Language Badge Component
  const LanguageBadge = ({
    flag,
    name,
    isLast = false,
  }: {
    flag: string;
    name: string;
    isLast?: boolean;
  }) => (
    <View style={[styles.languageRow, !isLast && styles.rowBorder]}>
      <Text style={styles.languageFlag}>{flag}</Text>
      <Text style={styles.languageName}>{name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Data Section */}
        <SectionHeader>MES DONNÉES</SectionHeader>
        <View style={styles.section}>
          <InfoRow label="Recettes enregistrées" value={`${recipeCount}`} />
          <InfoRow label="Espace utilisé" value={`${storageUsed} MB`} hideDivider />
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={handleExportAll}>
            📄 Exporter toutes mes recettes
          </PrimaryButton>
        </View>
        <SectionFooter>
          Exportez toutes vos recettes en PDF pour les imprimer ou les
          sauvegarder.
        </SectionFooter>

        {/* Help Section */}
        <SectionHeader>AIDE & SUPPORT</SectionHeader>
        <View style={styles.section}>
          <ActionRow
            label="Comment ajouter une recette"
            onPress={() => handleHelp('addRecipe')}
          />
          <ActionRow
            label="Comment traduire une recette"
            onPress={() => handleHelp('translate')}
          />
          <ActionRow
            label="Comment utiliser les conversions"
            onPress={() => handleHelp('conversions')}
          />
          <ActionRow
            label="Contacter le support"
            onPress={() => handleHelp('support')}
            isLast
          />
        </View>

        {/* About Section */}
        <SectionHeader>À PROPOS</SectionHeader>
        <View style={styles.section}>
          <InfoRow label="Version" value="1.0.0" hideDivider />
        </View>

        {/* Languages Section */}
        <SectionHeader>LANGUES SUPPORTÉES</SectionHeader>
        <View style={styles.section}>
          <LanguageBadge flag="🇫🇷" name="Français" />
          <LanguageBadge flag="🇺🇸" name="English" isLast />
        </View>

        {/* Danger Zone */}
        <SectionHeader>ZONE DANGEREUSE</SectionHeader>
        <View style={styles.buttonContainer}>
          <DangerButton onPress={handleClearData} />
        </View>
        <SectionFooter>
          Cette action supprimera définitivement toutes vos recettes et
          traductions.
        </SectionFooter>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iOS.colors.groupedBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 34,
  },

  // Section Headers & Footers
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: iOS.spacing.standard,
  },
  sectionHeaderText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionFooter: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: iOS.spacing.standard,
  },
  sectionFooterText: {
    ...iOS.typography.footnote,
    color: iOS.colors.secondaryLabel,
    lineHeight: 18,
  },

  // Section Container
  section: {
    marginHorizontal: iOS.spacing.standard,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: iOS.colors.systemBackground,
    marginBottom: iOS.spacing.compact,
  },

  // Row Styles
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: iOS.colors.separator,
  },
  // Buttons
  buttonContainer: {
    marginHorizontal: iOS.spacing.standard,
    marginBottom: iOS.spacing.compact,
  },
  primaryButton: {
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: iOS.spacing.standard,
    alignItems: 'center',
    minHeight: 50,
  },
  primaryButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.tint,
    fontWeight: '600',
  },
  dangerButton: {
    backgroundColor: iOS.colors.systemBackground,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: iOS.spacing.standard,
    alignItems: 'center',
    minHeight: 50,
  },
  dangerButtonText: {
    ...iOS.typography.body,
    color: iOS.colors.systemRed,
  },

  // Language Badge
  languageRow: {
    backgroundColor: iOS.colors.systemBackground,
    paddingVertical: 12,
    paddingHorizontal: iOS.spacing.standard,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  languageFlag: {
    fontSize: 24,
    lineHeight: 24,
  },
  languageName: {
    ...iOS.typography.body,
    color: iOS.colors.label,
    fontWeight: '600',
  },
});
