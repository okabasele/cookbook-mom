import React, { useState } from 'react';
import { ChevronLeft, Share2 } from 'lucide-react';

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
    systemBlue: '#007AFF',
    systemGray5: '#E5E5EA',
  },
  
  typography: {
    largeTitle: { fontSize: 34, lineHeight: '41px', fontWeight: '700' },
    title1: { fontSize: 28, lineHeight: '34px', fontWeight: '700' },
    title2: { fontSize: 22, lineHeight: '28px', fontWeight: '700' },
    headline: { fontSize: 17, lineHeight: '22px', fontWeight: '600' },
    body: { fontSize: 17, lineHeight: '22px', fontWeight: '400' },
    subheadline: { fontSize: 15, lineHeight: '20px', fontWeight: '400' },
    footnote: { fontSize: 13, lineHeight: '18px', fontWeight: '400' },
  },
  
  spacing: { statusBar: 47, navBar: 44, standard: 16, compact: 8 },
};

// ===========================
// 🧩 COMPONENTS
// ===========================

// Checkbox Item
const CheckboxItem = ({ checked, onChange, children, number }) => {
  return (
    <div
      onClick={onChange}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: `12px ${iOS.spacing.standard}px`,
        cursor: 'pointer',
        backgroundColor: iOS.colors.systemBackground,
        borderBottom: `0.5px solid ${iOS.colors.separator}`,
        minHeight: 44,
      }}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
    >
      {/* Checkbox */}
      <div
        style={{
          minWidth: 24,
          minHeight: 24,
          width: 24,
          height: 24,
          borderRadius: '50%',
          border: `2px solid ${checked ? iOS.colors.tint : iOS.colors.systemGray5}`,
          backgroundColor: checked ? iOS.colors.tint : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
          marginTop: 2,
        }}
      >
        {checked && (
          <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <path
              d="M1 5.5L5 9.5L13 1.5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1 }}>
        {number !== undefined && (
          <span
            style={{
              ...iOS.typography.body,
              color: checked ? iOS.colors.secondaryLabel : iOS.colors.label,
              textDecoration: checked ? 'line-through' : 'none',
              opacity: checked ? 0.6 : 1,
            }}
          >
            <strong>{number}.</strong>{' '}
          </span>
        )}
        <span
          style={{
            ...iOS.typography.body,
            color: checked ? iOS.colors.secondaryLabel : iOS.colors.label,
            textDecoration: checked ? 'line-through' : 'none',
            opacity: checked ? 0.6 : 1,
          }}
        >
          {children}
        </span>
      </div>
    </div>
  );
};

// Section Header
const SectionHeader = ({ children, count }) => (
  <div
    style={{
      padding: `20px ${iOS.spacing.standard}px 8px`,
      ...iOS.typography.headline,
      color: iOS.colors.label,
    }}
  >
    {children} {count !== undefined && `(${count})`}
  </div>
);

// ===========================
// 🏠 MAIN COMPONENT
// ===========================
export default function RecipeDetailScreen() {
  // Mock recipe data
  const recipe = {
    id: '1',
    title: 'Cookies aux Pépites de Chocolat',
    language: 'fr',
    emoji: '🍪',
    prepTime: 25,
    cookTime: 15,
    difficulty: 'facile',
    createdAt: '2025-09-27',
    ingredients: [
      '240g de farine tout usage',
      '225g de beurre ramolli',
      '150g de sucre blanc',
      '165g de cassonade',
      '2 gros œufs',
      '10ml d\'extrait de vanille',
      '5ml de bicarbonate de soude',
      '350g de pépites de chocolat',
    ],
    steps: [
      'Préchauffer le four à 190°C',
      'Mélanger le beurre et les sucres jusqu\'à obtenir une texture crémeuse',
      'Incorporer les œufs et la vanille en battant',
      'Mélanger la farine et le bicarbonate de soude',
      'Incorporer progressivement les ingrédients secs au mélange de beurre',
      'Ajouter les pépites de chocolat en remuant',
      'Déposer des cuillères à soupe bombées sur des plaques de cuisson',
      'Cuire 9-11 minutes jusqu\'à ce que les bords soient dorés',
    ],
  };

  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleStep = (index) => {
    setCheckedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleBack = () => {
    alert('Retour à la liste des recettes');
  };

  const handleExport = () => {
    alert('🖨️ Export PDF...\n\nOuverture du Share Sheet iOS pour:\n- Imprimer\n- Sauvegarder en PDF\n- Partager par email');
  };

  const getDifficultyEmoji = () => {
    const map = { facile: '🟢', moyen: '🟡', difficile: '🔴' };
    return map[recipe.difficulty] || '🟢';
  };

  const getLanguageFlag = () => {
    return recipe.language === 'fr' ? '🇫🇷' : '🇺🇸';
  };

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: iOS.colors.systemBackground,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 480,
          height: '100vh',
          margin: '0 auto',
          backgroundColor: iOS.colors.systemBackground,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Nav Bar */}
        <nav
          style={{
            backgroundColor: `rgba(255, 255, 255, 0.95)`,
            backdropFilter: 'blur(20px)',
            borderBottom: `0.5px solid ${iOS.colors.separator}`,
          }}
        >
          {/* Status Bar */}
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

          {/* Nav Bar */}
          <div
            style={{
              height: iOS.spacing.navBar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${iOS.spacing.standard}px`,
            }}
          >
            {/* Back Button */}
            <button
              onClick={handleBack}
              style={{
                background: 'none',
                border: 'none',
                color: iOS.colors.tint,
                cursor: 'pointer',
                padding: iOS.spacing.compact,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                ...iOS.typography.body,
              }}
            >
              <ChevronLeft size={20} />
              Recettes
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              style={{
                background: 'none',
                border: 'none',
                color: iOS.colors.tint,
                cursor: 'pointer',
                padding: `${iOS.spacing.compact}px ${iOS.spacing.standard}px`,
                ...iOS.typography.body,
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Share2 size={18} />
              Export
            </button>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Title Section */}
          <div style={{ padding: `${iOS.spacing.standard * 2}px ${iOS.spacing.standard}px ${iOS.spacing.standard}px` }}>
            <h1
              style={{
                margin: `0 0 ${iOS.spacing.compact}px 0`,
                ...iOS.typography.largeTitle,
                color: iOS.colors.label,
              }}
            >
              {recipe.title}
            </h1>

            {/* Metadata */}
            <div
              style={{
                ...iOS.typography.subheadline,
                color: iOS.colors.secondaryLabel,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span>{getLanguageFlag()}</span>
              <span>•</span>
              <span>{recipe.prepTime} min</span>
              <span>•</span>
              <span>{getDifficultyEmoji()} {recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1)}</span>
            </div>
          </div>

          {/* Ingredients Section */}
          <div style={{ marginTop: iOS.spacing.standard }}>
            <SectionHeader count={recipe.ingredients.length}>
              Ingrédients
            </SectionHeader>
            
            {recipe.ingredients.map((ingredient, index) => (
              <CheckboxItem
                key={index}
                checked={checkedIngredients[index]}
                onChange={() => toggleIngredient(index)}
              >
                {ingredient}
              </CheckboxItem>
            ))}
          </div>

          {/* Steps Section */}
          <div style={{ marginTop: iOS.spacing.standard * 2, paddingBottom: 34 }}>
            <SectionHeader count={recipe.steps.length}>
              Étapes de préparation
            </SectionHeader>
            
            {recipe.steps.map((step, index) => (
              <CheckboxItem
                key={index}
                number={index + 1}
                checked={checkedSteps[index]}
                onChange={() => toggleStep(index)}
              >
                {step}
              </CheckboxItem>
            ))}
          </div>
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