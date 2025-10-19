import React, { useState } from 'react';
import { ChevronRight, ArrowLeftRight } from 'lucide-react';

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
    systemGreen: '#34C759',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
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
// 📊 CONVERSION DATA
// ===========================
const CONVERSIONS = {
  temperature: {
    name: 'Température',
    emoji: '🌡️',
    units: ['°F', '°C'],
    convert: (value, from) => {
      if (from === '°F') return ((value - 32) * 5) / 9;
      return (value * 9) / 5 + 32;
    },
    examples: [
      { from: 350, fromUnit: '°F', to: 177, toUnit: '°C', label: 'Four moyen' },
      { from: 375, fromUnit: '°F', to: 190, toUnit: '°C', label: 'Four chaud' },
      { from: 425, fromUnit: '°F', to: 218, toUnit: '°C', label: 'Four très chaud' },
    ],
  },
  volume: {
    name: 'Volume',
    emoji: '🥤',
    units: ['cup', 'ml', 'tbsp', 'tsp', 'L'],
    convert: (value, from, to) => {
      const toMl = {
        cup: 240,
        ml: 1,
        tbsp: 15,
        tsp: 5,
        L: 1000,
      };
      const mlValue = value * toMl[from];
      return mlValue / toMl[to];
    },
    examples: [
      { from: 1, fromUnit: 'cup', to: 240, toUnit: 'ml', label: '1 tasse' },
      { from: 1, fromUnit: 'tbsp', to: 15, toUnit: 'ml', label: '1 c. à soupe' },
      { from: 1, fromUnit: 'tsp', to: 5, toUnit: 'ml', label: '1 c. à café' },
    ],
  },
  weight: {
    name: 'Poids',
    emoji: '⚖️',
    units: ['oz', 'g', 'lb', 'kg'],
    convert: (value, from, to) => {
      const toG = {
        oz: 28.35,
        g: 1,
        lb: 453.592,
        kg: 1000,
      };
      const gValue = value * toG[from];
      return gValue / toG[to];
    },
    examples: [
      { from: 1, fromUnit: 'oz', to: 28, toUnit: 'g', label: '1 once' },
      { from: 1, fromUnit: 'lb', to: 454, toUnit: 'g', label: '1 livre' },
      { from: 8, fromUnit: 'oz', to: 227, toUnit: 'g', label: '8 onces' },
    ],
  },
  length: {
    name: 'Longueur (moules)',
    emoji: '📏',
    units: ['inch', 'cm'],
    convert: (value, from) => {
      if (from === 'inch') return value * 2.54;
      return value / 2.54;
    },
    examples: [
      { from: 6, fromUnit: 'inch', to: 15, toUnit: 'cm', label: 'Moule 6 pouces' },
      { from: 8, fromUnit: 'inch', to: 20, toUnit: 'cm', label: 'Moule 8 pouces' },
      { from: 9, fromUnit: 'inch', to: 23, toUnit: 'cm', label: 'Moule 9 pouces' },
      { from: 10, fromUnit: 'inch', to: 25, toUnit: 'cm', label: 'Moule 10 pouces' },
    ],
  },
};

// ===========================
// 🧩 COMPONENTS
// ===========================

const CategoryCard = ({ category, data, onClick, isLast }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      backgroundColor: iOS.colors.systemBackground,
      border: 'none',
      borderBottom: isLast ? 'none' : `0.5px solid ${iOS.colors.separator}`,
      padding: `14px ${iOS.spacing.standard}px`,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 58,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          backgroundColor: iOS.colors.systemGray6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}
      >
        {data.emoji}
      </div>
      <span style={{ ...iOS.typography.body, color: iOS.colors.label }}>
        {data.name}
      </span>
    </div>
    <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
  </button>
);

const ExampleRow = ({ example, onClick, isLast }) => (
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
      minHeight: 54,
    }}
  >
    <div style={{ flex: 1 }}>
      <div
        style={{
          ...iOS.typography.body,
          color: iOS.colors.label,
          marginBottom: 2,
        }}
      >
        {example.label}
      </div>
      <div
        style={{
          ...iOS.typography.footnote,
          color: iOS.colors.secondaryLabel,
        }}
      >
        {example.from} {example.fromUnit} = {Math.round(example.to * 10) / 10}{' '}
        {example.toUnit}
      </div>
    </div>
    <ChevronRight size={18} color={iOS.colors.tertiaryLabel} />
  </button>
);

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

const UnitSegmentedControl = ({ units, selected, onChange }) => (
  <div
    style={{
      display: 'flex',
      backgroundColor: iOS.colors.systemGray6,
      borderRadius: 9,
      padding: 2,
      gap: 2,
    }}
  >
    {units.map((unit) => (
      <button
        key={unit}
        onClick={() => onChange(unit)}
        style={{
          flex: 1,
          padding: '8px 12px',
          border: 'none',
          borderRadius: 7,
          backgroundColor: selected === unit ? iOS.colors.systemBackground : 'transparent',
          color: iOS.colors.label,
          ...iOS.typography.subheadline,
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: selected === unit ? '0 1px 3px rgba(0,0,0,0.12)' : 'none',
        }}
      >
        {unit}
      </button>
    ))}
  </div>
);

const CalculatorScreen = ({ category, data, onBack }) => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState(data.units[0]);
  const [toUnit, setToUnit] = useState(data.units[1] || data.units[0]);

  const handleSwapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    if (result !== '') {
      setInputValue(result.toString());
    }
  };

  const handleLoadExample = (example) => {
    setInputValue(example.from.toString());
    setFromUnit(example.fromUnit);
    setToUnit(example.toUnit);
  };

  const calculateResult = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return '';
    
    if (category === 'temperature') {
      return Math.round(data.convert(value, fromUnit) * 10) / 10;
    } else {
      return Math.round(data.convert(value, fromUnit, toUnit) * 10) / 10;
    }
  };

  const result = calculateResult();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Calculator Card */}
      <div style={{ padding: iOS.spacing.standard }}>
        <div
          style={{
            backgroundColor: iOS.colors.systemBackground,
            borderRadius: 16,
            padding: iOS.spacing.standard * 1.5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
          }}
        >
          {/* From Section */}
          <div style={{ marginBottom: iOS.spacing.standard }}>
            <label
              style={{
                display: 'block',
                ...iOS.typography.footnote,
                color: iOS.colors.secondaryLabel,
                marginBottom: iOS.spacing.compact,
              }}
            >
              De
            </label>
            <input
              type="number"
              inputMode="decimal"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                border: 'none',
                borderRadius: 10,
                padding: `${iOS.spacing.standard}px`,
                ...iOS.typography.largeTitle,
                color: iOS.colors.label,
                backgroundColor: iOS.colors.systemGray6,
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: iOS.spacing.compact,
              }}
              autoFocus
            />
            <UnitSegmentedControl
              units={data.units}
              selected={fromUnit}
              onChange={setFromUnit}
            />
          </div>

          {/* Swap Button */}
          <div style={{ textAlign: 'center', margin: `${iOS.spacing.compact}px 0` }}>
            <button
              onClick={handleSwapUnits}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: iOS.colors.systemGray6,
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: iOS.colors.tint,
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = iOS.colors.systemGray5}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = iOS.colors.systemGray6}
            >
              <ArrowLeftRight size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* To Section */}
          <div>
            <label
              style={{
                display: 'block',
                ...iOS.typography.footnote,
                color: iOS.colors.secondaryLabel,
                marginBottom: iOS.spacing.compact,
              }}
            >
              Vers
            </label>
            <div
              style={{
                borderRadius: 10,
                padding: `${iOS.spacing.standard}px`,
                backgroundColor: iOS.colors.systemGray6,
                minHeight: 68,
                display: 'flex',
                alignItems: 'center',
                marginBottom: iOS.spacing.compact,
              }}
            >
              <span
                style={{
                  ...iOS.typography.largeTitle,
                  color: result ? iOS.colors.label : iOS.colors.tertiaryLabel,
                }}
              >
                {result || '—'}
              </span>
            </div>
            <UnitSegmentedControl
              units={data.units}
              selected={toUnit}
              onChange={setToUnit}
            />
          </div>
        </div>
      </div>

      {/* Examples Section */}
      {data.examples && data.examples.length > 0 && (
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <SectionHeader>Conversions courantes</SectionHeader>
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
            {data.examples.map((example, index) => (
              <ExampleRow
                key={index}
                example={example}
                onClick={() => handleLoadExample(example)}
                isLast={index === data.examples.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ===========================
// 🏠 MAIN COMPONENT
// ===========================
export default function ConversionsScreen() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleBack = () => {
    setSelectedCategory(null);
  };

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
        {/* Nav Bar with Liquid Glass Effect */}
        <nav
          style={{
            backgroundColor: `rgba(242, 242, 247, 0.8)`,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
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
              justifyContent: 'space-between',
              padding: `0 ${iOS.spacing.standard}px`,
            }}
          >
            {selectedCategory ? (
              <>
                <button
                  onClick={handleBack}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: iOS.colors.tint,
                    cursor: 'pointer',
                    padding: iOS.spacing.compact,
                    ...iOS.typography.body,
                  }}
                >
                  ← Retour
                </button>
                <h1
                  style={{
                    margin: 0,
                    ...iOS.typography.headline,
                    color: iOS.colors.label,
                  }}
                >
                  {CONVERSIONS[selectedCategory].name}
                </h1>
                <div style={{ width: 60 }} />
              </>
            ) : (
              <>
                <div style={{ width: 44 }} />
                <h1
                  style={{
                    margin: 0,
                    ...iOS.typography.headline,
                    color: iOS.colors.label,
                  }}
                >
                  Conversions
                </h1>
                <div style={{ width: 44 }} />
              </>
            )}
          </div>
        </nav>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {!selectedCategory ? (
            // Category List
            <>
              <div
                style={{
                  padding: `${iOS.spacing.standard * 2}px ${iOS.spacing.standard}px ${iOS.spacing.standard}px`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 64, marginBottom: iOS.spacing.standard }}>
                  🔢
                </div>
                <h2
                  style={{
                    margin: `0 0 ${iOS.spacing.compact}px 0`,
                    ...iOS.typography.title2,
                    color: iOS.colors.label,
                  }}
                >
                  Convertisseur d'unités
                </h2>
                <p
                  style={{
                    margin: 0,
                    ...iOS.typography.body,
                    color: iOS.colors.secondaryLabel,
                  }}
                >
                  Convertissez facilement les mesures de vos recettes
                </p>
              </div>

              <SectionHeader>Choisir une catégorie</SectionHeader>
              <div
                style={{
                  marginLeft: iOS.spacing.standard,
                  marginRight: iOS.spacing.standard,
                  borderRadius: 10,
                  overflow: 'hidden',
                  backgroundColor: iOS.colors.systemBackground,
                  marginBottom: iOS.spacing.standard * 3,
                }}
              >
                {Object.entries(CONVERSIONS).map(([key, data], index) => (
                  <CategoryCard
                    key={key}
                    category={key}
                    data={data}
                    onClick={() => setSelectedCategory(key)}
                    isLast={index === Object.entries(CONVERSIONS).length - 1}
                  />
                ))}
              </div>
            </>
          ) : (
            // Calculator Screen
            <CalculatorScreen
              category={selectedCategory}
              data={CONVERSIONS[selectedCategory]}
              onBack={handleBack}
            />
          )}
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