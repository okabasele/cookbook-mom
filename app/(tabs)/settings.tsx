import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme, commonStyles } from '@/styles/theme';

export default function SettingsScreen() {
  const clearAllData = () => {
    Alert.alert(
      'Effacer toutes les données',
      'Êtes-vous sûr de vouloir supprimer toutes vos recettes? Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: confirmClearData }
      ]
    );
  };

  const confirmClearData = async () => {
    try {
      await AsyncStorage.removeItem('recipes');
      Alert.alert('Succès', 'Toutes les données ont été effacées');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'effacer les données');
    }
  };

  return (
    <ScrollView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Paramètres</Text>
        <Text style={styles.subtitle}>
          Gérez vos préférences et données de l'application
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📱 À propos de l'application</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Version:</Text> 1.0.0
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Développé pour:</Text> Les passionnés de cuisine 60+
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.bold}>Fonctionnalités:</Text> Traduction automatique de recettes (EN ↔ FR)
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌍 Langues supportées</Text>
          <View style={styles.languageList}>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇺🇸</Text>
              <Text style={styles.languageText}>English</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageFlag}>🇫🇷</Text>
              <Text style={styles.languageText}>Français</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔧 Fonctionnalités</Text>
          <View style={styles.featureList}>
            <Text style={styles.featureItem}>✅ Détection automatique de langue</Text>
            <Text style={styles.featureItem}>✅ Traduction bidirectionnelle EN ↔ FR</Text>
            <Text style={styles.featureItem}>✅ Gestion des familles de recettes</Text>
            <Text style={styles.featureItem}>✅ Export PDF pour impression</Text>
            <Text style={styles.featureItem}>✅ Interface adaptée aux seniors</Text>
            <Text style={styles.featureItem}>✅ Stockage hors ligne</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗑️ Données</Text>
          <TouchableOpacity 
            style={[commonStyles.button, commonStyles.dangerButton]}
            onPress={clearAllData}
          >
            <Text style={commonStyles.buttonText}>
              Effacer toutes les recettes
            </Text>
          </TouchableOpacity>
          <Text style={styles.warningText}>
            ⚠️ Cette action supprimera définitivement toutes vos recettes et traductions
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Créé avec ❤️ pour faciliter la cuisine multilingue
          </Text>
          <Text style={styles.footerSubtext}>
            Interface optimisée pour les utilisateurs de 60 ans et plus
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.gray50,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  
  title: {
    ...theme.typography.title,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  
  content: {
    padding: theme.spacing.md,
  },
  
  section: {
    marginBottom: theme.spacing.xl,
  },
  
  sectionTitle: {
    ...theme.typography.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  
  infoCard: {
    ...commonStyles.card,
    backgroundColor: theme.colors.blue50,
    borderColor: theme.colors.primary,
  },
  
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    lineHeight: 24,
  },
  
  bold: {
    fontWeight: 'bold',
  },
  
  languageList: {
    gap: theme.spacing.sm,
  },
  
  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  languageFlag: {
    fontSize: 24,
    marginRight: theme.spacing.md,
  },
  
  languageText: {
    ...theme.typography.bodyLarge,
    color: theme.colors.text,
    fontWeight: '600',
  },
  
  featureList: {
    gap: theme.spacing.sm,
  },
  
  featureItem: {
    ...theme.typography.body,
    color: theme.colors.text,
    lineHeight: 24,
  },
  
  warningText: {
    ...theme.typography.captionSmall,
    color: theme.colors.danger,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  
  footer: {
    marginTop: theme.spacing.xl,
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  footerSubtext: {
    ...theme.typography.captionSmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});