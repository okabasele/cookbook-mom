import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

// ===========================
// 🎨 iOS SYSTEM COLORS
// ===========================
const iOS = {
  colors: {
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    groupedBackground: '#F2F2F7',
    label: '#000000',
    secondaryLabel: 'rgba(60, 60, 67, 0.6)',
    tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
    separator: 'rgba(60, 60, 67, 0.29)',
    tint: '#8B2B3E',
    systemRed: '#FF3B30',
    systemBlue: '#007AFF',
    systemGreen: '#34C759',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },
  
  typography: {
    largeTitle: { fontSize: 34, lineHeight: '41px', fontWeight: '700' },
    title1: { fontSize: 28, lineHeight: '34px', fontWeight: '700' },
    title2: { fontSize: 22, lineHeight: '28px', fontWeight: '700' },
    title3: { fontSize: 20, lineHeight: '25px', fontWeight: '600' },
    headline: { fontSize: 17, lineHeight: '22px', fontWeight: '600' },
    body: { fontSize: 17, lineHeight: '22px', fontWeight: '400' },
    callout: { fontSize: 16, lineHeight: '21px', fontWeight: '400' },
    subheadline: { fontSize: 15, lineHeight: '20px', fontWeight: '400' },
    footnote: { fontSize: 13, lineHeight: '18px', fontWeight: '400' },
    caption1: { fontSize: 12, lineHeight: '16px', fontWeight: '400' },
  },
  
  spacing: { statusBar: 47, navBar: 44, standard: 16, compact: 8 },
};

// ===========================
// 🏠 MAIN COMPONENT
// ===========================
export default function SettingsScreen() {
  const [recipeCount] = useState(12); // Mock data
  const [storageUsed] = useState('2.3'); // Mock data in MB

  const handleExportAll = () => {
    alert('📄 Export de toutes vos recettes en cours...\n\nVous recevrez un PDF avec toutes vos recettes.');
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      'Êtes-vous sûr de vouloir supprimer toutes vos recettes?\n\nCette action est irréversible.'
    );
    if (confirmed) {
      alert('✅ Toutes les données ont été effacées');
    }
  };

  const handleHelp = (topic) => {
    const helpTexts = {
      addRecipe: '📱 Pour ajouter une recette:\n\n1. Appuyez sur le bouton "+" dans l\'onglet Recettes\n2. Collez le lien YouTube de la recette\n3. Choisissez la langue de traduction\n4. Validez et modifiez si nécessaire',
      translate: '🌍 Pour traduire une recette:\n\n1. Ouvrez une recette existante\n2. Appuyez sur "Traduire"\n3. Choisissez la langue cible\n4. La traduction s\'affiche automatiquement',
      conversions: '🔢 Pour convertir des unités:\n\n1. Allez dans l\'onglet "Conversions"\n2. Choisissez la catégorie (température, volume, etc.)\n3. Entrez la valeur à convertir\n4. Le résultat s\'affiche instantanément',
      support: '📧 Pour nous contacter:\n\nEmail: support@recettes-app.com\n\nNous répondons sous 24h.'
    };
    alert(helpTexts[topic]);
  };

  // Section Header Component
  const SectionHeader = ({ children }) => (
    <div
      style={{
        padding: `20px ${iOS.spacing.standard}px 8px`,
        ...iOS.typography.footnote,
        color: iOS.colors.secondaryLabel,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
    >
      {children}
    </div>
  );

  // Section Footer Component
  const SectionFooter = ({ children }) => (
    <div
      style={{
        padding: `8px ${iOS.spacing.standard}px 20px`,
        ...iOS.typography.footnote,
        color: iOS.colors.secondaryLabel,
        lineHeight: '18px',
      }}
    >
      {children}
    </div>
  );

  // Info Row Component
  const InfoRow = ({ label, value, showArrow = false, onClick }) => (
    <button
      onClick={onClick}
      disabled={!onClick}
      style={{
        width: '100%',
        backgroundColor: iOS.colors.systemBackground,
        border: 'none',
        borderBottom: `0.5px solid ${iOS.colors.separator}`,
        padding: `12px ${iOS.spacing.standard}px`,
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
      }}
    >
      <span style={{ ...iOS.typography.body, color: iOS.colors.label }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {value && (
          <span style={{ ...iOS.typography.body, color: iOS.colors.secondaryLabel }}>
            {value}
          </span>
        )}
        {showArrow && (
          <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
        )}
      </div>
    </button>
  );

  // Action Row Component (with arrow, for navigation)
  const ActionRow = ({ label, onClick, isLast = false }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        backgroundColor: iOS.colors.systemBackground,
        border: 'none',
        borderBottom: isLast ? 'none' : `0.5px solid ${iOS.colors.separator}`,
        padding: `12px ${iOS.spacing.standard}px`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
      }}
    >
      <span style={{ ...iOS.typography.body, color: iOS.colors.label }}>
        {label}
      </span>
      <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
    </button>
  );

  // Primary Button Component (for export)
  const PrimaryButton = ({ onClick, children }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        backgroundColor: iOS.colors.systemBackground,
        border: 'none',
        borderRadius: 10,
        padding: `14px ${iOS.spacing.standard}px`,
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: 50,
      }}
    >
      <span style={{ ...iOS.typography.body, color: iOS.colors.tint, fontWeight: '600' }}>
        {children}
      </span>
    </button>
  );

  // Danger Button Component
  const DangerButton = ({ onClick }) => (
    <button
      onClick={onClick}
      style={{
        width: '100%',
        backgroundColor: iOS.colors.systemBackground,
        border: 'none',
        borderRadius: 10,
        padding: `14px ${iOS.spacing.standard}px`,
        cursor: 'pointer',
        textAlign: 'center',
        minHeight: 50,
      }}
    >
      <span style={{ ...iOS.typography.body, color: iOS.colors.systemRed }}>
        Effacer toutes les recettes
      </span>
    </button>
  );

  // Language Badge Component
  const LanguageBadge = ({ flag, name, isLast = false }) => (
    <div
      style={{
        backgroundColor: iOS.colors.systemBackground,
        borderBottom: isLast ? 'none' : `0.5px solid ${iOS.colors.separator}`,
        padding: `12px ${iOS.spacing.standard}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 44,
      }}
    >
      <div style={{ fontSize: 24, lineHeight: 1 }}>{flag}</div>
      <span style={{ ...iOS.typography.body, color: iOS.colors.label, fontWeight: '600' }}>
        {name}
      </span>
    </div>
  );

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: iOS.colors.groupedBackground,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          height: '100vh',
          margin: '0 auto',
          backgroundColor: iOS.colors.groupedBackground,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Nav Bar */}
        <nav
          style={{
            backgroundColor: `rgba(242, 242, 247, 0.95)`,
            backdropFilter: 'blur(20px)',
            borderBottom: `0.5px solid ${iOS.colors.separator}`,
          }}
        >
          <div
            style={{
              height: iOS.spacing.statusBar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${iOS.spacing.standard}px`,
              ...iOS.typography.footnote,
              color: iOS.colors.label,
            }}
          >
            <span>9:41</span>
            <span>🔋 📶</span>
          </div>

          <div
            style={{
              height: iOS.spacing.navBar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: `0 ${iOS.spacing.standard}px`,
            }}
          >
            <h1
              style={{
                margin: 0,
                ...iOS.typography.headline,
                color: iOS.colors.label,
              }}
            >
              Paramètres
            </h1>
          </div>
        </nav>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
            paddingBottom: 34,
          }}
        >
          {/* Data Section */}
          <SectionHeader>Mes données</SectionHeader>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: iOS.colors.systemBackground,
              marginBottom: iOS.spacing.compact,
            }}
          >
            <InfoRow label="Recettes enregistrées" value={`${recipeCount}`} showArrow={false} />
            <InfoRow label="Espace utilisé" value={`${storageUsed} MB`} showArrow={false} />
          </div>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              marginBottom: iOS.spacing.compact,
            }}
          >
            <PrimaryButton onClick={handleExportAll}>
              📄 Exporter toutes mes recettes
            </PrimaryButton>
          </div>
          <SectionFooter>
            Exportez toutes vos recettes en PDF pour les imprimer ou les sauvegarder.
          </SectionFooter>

          {/* Help Section */}
          <SectionHeader>Aide & Support</SectionHeader>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: iOS.colors.systemBackground,
              marginBottom: iOS.spacing.standard,
            }}
          >
            <ActionRow label="Comment ajouter une recette" onClick={() => handleHelp('addRecipe')} />
            <ActionRow label="Comment traduire une recette" onClick={() => handleHelp('translate')} />
            <ActionRow label="Comment utiliser les conversions" onClick={() => handleHelp('conversions')} />
            <ActionRow label="Contacter le support" onClick={() => handleHelp('support')} isLast={true} />
          </div>

          {/* About Section */}
          <SectionHeader>À propos</SectionHeader>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: iOS.colors.systemBackground,
              marginBottom: iOS.spacing.compact,
            }}
          >
            <InfoRow label="Version" value="1.0.0" showArrow={false} />
            <InfoRow label="Développé pour" value="Seniors 60+" showArrow={false} />
          </div>
          <SectionFooter>
            Interface optimisée pour les utilisateurs de 60 ans et plus
          </SectionFooter>

          {/* Languages Section */}
          <SectionHeader>Langues supportées</SectionHeader>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: iOS.colors.systemBackground,
              marginBottom: iOS.spacing.standard,
            }}
          >
            <LanguageBadge flag="🇫🇷" name="Français" />
            <LanguageBadge flag="🇺🇸" name="English" isLast={true} />
          </div>

          {/* Danger Zone */}
          <SectionHeader>Zone dangereuse</SectionHeader>
          <div
            style={{
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              marginBottom: iOS.spacing.compact,
            }}
          >
            <DangerButton onClick={handleClearData} />
          </div>
          <SectionFooter>
            Cette action supprimera définitivement toutes vos recettes et traductions.
          </SectionFooter>
        </div>

        {/* Home Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 134,
            height: 5,
            backgroundColor: iOS.colors.label,
            borderRadius: 100,
            opacity: 0.3,
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}