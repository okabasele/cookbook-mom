import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Loader, Check } from 'lucide-react';

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
    placeholderText: 'rgba(60, 60, 67, 0.3)',
    separator: 'rgba(60, 60, 67, 0.29)',
    tint: '#8B2B3E',
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
// 🌍 LANGUAGES
// ===========================
const LANGUAGES = [
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
];

// ===========================
// 🧮 CONVERSION SYSTEM
// ===========================
const CONVERSIONS = {
  // Volume to weight (context-specific)
  'cup flour': { value: 120, unit: 'g', ingredient: 'farine' },
  'cup sugar': { value: 200, unit: 'g', ingredient: 'sucre' },
  'cup butter': { value: 225, unit: 'g', ingredient: 'beurre' },
  'cup brown sugar': { value: 220, unit: 'g', ingredient: 'cassonade' },
  
  // Generic volume
  'cup': { value: 240, unit: 'ml' },
  'tablespoon': { value: 15, unit: 'ml' },
  'tbsp': { value: 15, unit: 'ml' },
  'teaspoon': { value: 5, unit: 'ml' },
  'tsp': { value: 5, unit: 'ml' },
  
  // Temperature
  'fahrenheit': (f) => Math.round((f - 32) * 5 / 9),
};

const convertIngredient = (text) => {
  // Extract quantity and unit
  const match = text.match(/(\d+(?:\/\d+)?|\d+\.\d+)\s*(cups?|tablespoons?|tbsps?|teaspoons?|tsps?)\s+(.+)/i);
  
  if (!match) return { converted: text, original: text };
  
  const [, qty, unit, ingredient] = match;
  const amount = eval(qty); // Convert fractions like "3/4"
  const unitLower = unit.toLowerCase().replace(/s$/, '');
  
  // Try context-specific conversion first
  const ingredientLower = ingredient.toLowerCase();
  for (const [key, conversion] of Object.entries(CONVERSIONS)) {
    if (key.includes(unitLower) && ingredientLower.includes(key.split(' ')[1])) {
      const convertedAmount = Math.round(amount * conversion.value);
      return {
        converted: `${convertedAmount}${conversion.unit} de ${conversion.ingredient}`,
        original: text
      };
    }
  }
  
  // Generic conversion
  if (CONVERSIONS[unitLower]) {
    const conversion = CONVERSIONS[unitLower];
    const convertedAmount = Math.round(amount * conversion.value);
    return {
      converted: `${convertedAmount}${conversion.unit} ${ingredient}`,
      original: text
    };
  }
  
  return { converted: text, original: text };
};

const convertTemperature = (text) => {
  return text.replace(/(\d+)\s*°?F/gi, (match, temp) => {
    const celsius = CONVERSIONS.fahrenheit(parseInt(temp));
    return `${celsius}°C`;
  });
};

// ===========================
// 🌐 MOCK API
// ===========================
const mockYouTubeExtraction = async (url, targetLang) => {
  // Simulate 3 stages
  await new Promise(resolve => setTimeout(resolve, 1000)); // Extract
  await new Promise(resolve => setTimeout(resolve, 1000)); // Translate
  await new Promise(resolve => setTimeout(resolve, 800));  // Convert
  
  if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
    throw new Error('URL invalide');
  }
  
  // Mock data (already translated to French if targetLang === 'fr')
  const data = {
    title: targetLang === 'fr' ? "Cookies aux Pépites de Chocolat" : "Chocolate Chip Cookies",
    language: targetLang,
    ingredients: targetLang === 'fr' ? [
      { converted: "240g de farine tout usage", original: "2 cups all-purpose flour" },
      { converted: "225g de beurre ramolli", original: "1 cup butter, softened" },
      { converted: "150g de sucre blanc", original: "3/4 cup granulated sugar" },
      { converted: "165g de cassonade", original: "3/4 cup brown sugar" },
      { converted: "2 gros œufs", original: "2 large eggs" },
      { converted: "10ml d'extrait de vanille", original: "2 tsp vanilla extract" },
      { converted: "5ml de bicarbonate de soude", original: "1 tsp baking soda" },
      { converted: "350g de pépites de chocolat", original: "2 cups chocolate chips" }
    ] : [
      { converted: "2 cups all-purpose flour", original: "2 cups all-purpose flour" },
      { converted: "1 cup butter, softened", original: "1 cup butter, softened" },
      { converted: "3/4 cup granulated sugar", original: "3/4 cup granulated sugar" },
      { converted: "3/4 cup brown sugar", original: "3/4 cup brown sugar" },
      { converted: "2 large eggs", original: "2 large eggs" },
      { converted: "2 tsp vanilla extract", original: "2 tsp vanilla extract" },
      { converted: "1 tsp baking soda", original: "1 tsp baking soda" },
      { converted: "2 cups chocolate chips", original: "2 cups chocolate chips" }
    ],
    steps: targetLang === 'fr' ? [
      { converted: "Préchauffer le four à 190°C", original: "Preheat oven to 375°F" },
      { converted: "Mélanger le beurre et les sucres jusqu'à obtenir une texture crémeuse", original: "Mix butter and sugars until creamy" },
      { converted: "Incorporer les œufs et la vanille en battant", original: "Beat in eggs and vanilla" },
      { converted: "Mélanger la farine et le bicarbonate de soude", original: "Combine flour and baking soda" },
      { converted: "Incorporer progressivement les ingrédients secs", original: "Gradually blend dry ingredients" },
      { converted: "Ajouter les pépites de chocolat en remuant", original: "Stir in chocolate chips" },
      { converted: "Déposer des cuillères bombées sur des plaques", original: "Drop rounded tablespoons onto sheets" },
      { converted: "Cuire 9-11 minutes jusqu'à dorure", original: "Bake 9-11 minutes until golden" }
    ] : [
      { converted: "Preheat oven to 375°F", original: "Preheat oven to 375°F" },
      { converted: "Mix butter and sugars until creamy", original: "Mix butter and sugars until creamy" },
      { converted: "Beat in eggs and vanilla", original: "Beat in eggs and vanilla" },
      { converted: "Combine flour and baking soda", original: "Combine flour and baking soda" },
      { converted: "Gradually blend dry ingredients", original: "Gradually blend dry ingredients" },
      { converted: "Stir in chocolate chips", original: "Stir in chocolate chips" },
      { converted: "Drop rounded tablespoons onto sheets", original: "Drop rounded tablespoons onto sheets" },
      { converted: "Bake 9-11 minutes until golden", original: "Bake 9-11 minutes until golden" }
    ],
    prepTime: 15,
    cookTime: 11,
    difficulty: 'facile'
  };
  
  return data;
};

// ===========================
// 🧩 COMPONENTS
// ===========================

// Language Picker Modal
const LanguagePicker = ({ visible, value, onChange, onClose }) => {
  if (!visible) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: iOS.colors.systemBackground,
          borderRadius: '12px 12px 0 0',
          padding: iOS.spacing.standard,
          paddingBottom: 34,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            ...iOS.typography.headline,
            color: iOS.colors.label,
            marginBottom: iOS.spacing.standard,
            paddingBottom: iOS.spacing.standard,
            borderBottom: `0.5px solid ${iOS.colors.separator}`,
          }}
        >
          Traduire en
        </div>
        
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => {
              onChange(lang.code);
              onClose();
            }}
            style={{
              width: '100%',
              backgroundColor: value === lang.code ? iOS.colors.systemGray6 : 'transparent',
              border: 'none',
              borderRadius: 10,
              padding: `${iOS.spacing.standard}px`,
              marginBottom: iOS.spacing.compact,
              ...iOS.typography.body,
              color: iOS.colors.label,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 44,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: iOS.spacing.compact }}>
              <span style={{ fontSize: 24 }}>{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
            {value === lang.code && <Check size={20} color={iOS.colors.tint} strokeWidth={2.5} />}
          </button>
        ))}
      </div>
    </div>
  );
};

// Progress Step
const ProgressStep = ({ completed, active, label }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: iOS.spacing.compact,
      padding: `${iOS.spacing.compact}px 0`,
    }}
  >
    <div
      style={{
        width: 24,
        height: 24,
        borderRadius: '50%',
        backgroundColor: completed ? iOS.colors.systemGreen : (active ? iOS.colors.tint : iOS.colors.systemGray5),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
      }}
    >
      {completed ? (
        <Check size={14} color={iOS.colors.systemBackground} strokeWidth={3} />
      ) : active ? (
        <Loader size={14} color={iOS.colors.systemBackground} style={{ animation: 'spin 1s linear infinite' }} />
      ) : null}
    </div>
    <span
      style={{
        ...iOS.typography.body,
        color: completed ? iOS.colors.systemGreen : (active ? iOS.colors.label : iOS.colors.secondaryLabel),
        fontWeight: active ? '600' : '400',
      }}
    >
      {label}
    </span>
  </div>
);

// Section Header
const SectionHeader = ({ children, count }) => (
  <div
    style={{
      padding: `12px ${iOS.spacing.standard}px 8px`,
      ...iOS.typography.footnote,
      color: iOS.colors.secondaryLabel,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    }}
  >
    {children} {count !== undefined && `(${count})`}
  </div>
);

// Ingredient Item with conversion display
const IngredientItem = ({ ingredient, onUpdate, onDelete }) => {
  return (
    <div
      style={{
        backgroundColor: iOS.colors.systemBackground,
        borderBottom: `0.5px solid ${iOS.colors.separator}`,
        padding: `12px ${iOS.spacing.standard}px`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: iOS.spacing.compact }}>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={ingredient.converted}
            onChange={(e) => onUpdate({ ...ingredient, converted: e.target.value })}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              ...iOS.typography.body,
              color: iOS.colors.label,
              backgroundColor: 'transparent',
              padding: 0,
              marginBottom: 2,
            }}
          />
          {ingredient.original !== ingredient.converted && (
            <div
              style={{
                ...iOS.typography.caption1,
                color: iOS.colors.tertiaryLabel,
              }}
            >
              ({ingredient.original})
            </div>
          )}
        </div>
        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: 'none',
            color: iOS.colors.systemGray5,
            cursor: 'pointer',
            padding: iOS.spacing.compact,
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// Step Item with conversion display
const StepItem = ({ step, number, onUpdate, onDelete }) => {
  return (
    <div
      style={{
        backgroundColor: iOS.colors.systemBackground,
        borderBottom: `0.5px solid ${iOS.colors.separator}`,
        padding: `12px ${iOS.spacing.standard}px`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: iOS.spacing.compact }}>
        <span
          style={{
            ...iOS.typography.body,
            color: iOS.colors.secondaryLabel,
            fontWeight: '600',
            minWidth: 24,
          }}
        >
          {number}.
        </span>
        <div style={{ flex: 1 }}>
          <input
            type="text"
            value={step.converted}
            onChange={(e) => onUpdate({ ...step, converted: e.target.value })}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              ...iOS.typography.body,
              color: iOS.colors.label,
              backgroundColor: 'transparent',
              padding: 0,
              marginBottom: 2,
            }}
          />
          {step.original !== step.converted && (
            <div
              style={{
                ...iOS.typography.caption1,
                color: iOS.colors.tertiaryLabel,
              }}
            >
              ({step.original})
            </div>
          )}
        </div>
        <button
          onClick={onDelete}
          style={{
            background: 'none',
            border: 'none',
            color: iOS.colors.systemGray5,
            cursor: 'pointer',
            padding: iOS.spacing.compact,
          }}
        >
          <X size={20} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};

// Add Button
const AddButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      backgroundColor: iOS.colors.systemBackground,
      border: 'none',
      borderBottom: `0.5px solid ${iOS.colors.separator}`,
      padding: `12px ${iOS.spacing.standard}px`,
      ...iOS.typography.body,
      color: iOS.colors.tint,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: iOS.spacing.compact,
      minHeight: 44,
    }}
  >
    <Plus size={20} strokeWidth={2.5} />
    {children}
  </button>
);

// Info Row
const InfoRow = ({ label, value, onClick }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%',
      backgroundColor: iOS.colors.systemBackground,
      border: 'none',
      borderBottom: `0.5px solid ${iOS.colors.separator}`,
      padding: `12px ${iOS.spacing.standard}px`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      minHeight: 44,
    }}
  >
    <span style={{ ...iOS.typography.body, color: iOS.colors.label }}>{label}</span>
    <span style={{ ...iOS.typography.body, color: iOS.colors.secondaryLabel }}>{value}</span>
  </button>
);

// Difficulty Picker Modal
const DifficultyPicker = ({ visible, value, onChange, onClose }) => {
  if (!visible) return null;
  
  const options = [
    { value: 'facile', label: 'Facile', emoji: '🟢' },
    { value: 'moyen', label: 'Moyen', emoji: '🟡' },
    { value: 'difficile', label: 'Difficile', emoji: '🔴' },
  ];
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          backgroundColor: iOS.colors.systemBackground,
          borderRadius: '12px 12px 0 0',
          padding: iOS.spacing.standard,
          paddingBottom: 34,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            ...iOS.typography.headline,
            color: iOS.colors.label,
            marginBottom: iOS.spacing.standard,
            paddingBottom: iOS.spacing.standard,
            borderBottom: `0.5px solid ${iOS.colors.separator}`,
          }}
        >
          Difficulté
        </div>
        
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              onChange(option.value);
              onClose();
            }}
            style={{
              width: '100%',
              backgroundColor: value === option.value ? iOS.colors.systemGray6 : 'transparent',
              border: 'none',
              borderRadius: 10,
              padding: `${iOS.spacing.standard}px`,
              marginBottom: iOS.spacing.compact,
              ...iOS.typography.body,
              color: iOS.colors.label,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: iOS.spacing.compact,
              minHeight: 44,
            }}
          >
            <span style={{ fontSize: 24 }}>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            backgroundColor: iOS.colors.tint,
            color: iOS.colors.systemBackground,
            border: 'none',
            borderRadius: 10,
            padding: `${iOS.spacing.standard}px`,
            marginTop: iOS.spacing.standard,
            ...iOS.typography.headline,
            cursor: 'pointer',
            minHeight: 44,
          }}
        >
          Valider
        </button>
      </div>
    </div>
  );
};

// ===========================
// 🏠 MAIN COMPONENT
// ===========================
export default function AddRecipeScreen() {
  const [step, setStep] = useState('input'); // 'input' | 'analyzing' | 'edit'
  const [analysisStep, setAnalysisStep] = useState(0); // 0=extract, 1=translate, 2=convert
  
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [targetLang, setTargetLang] = useState('fr'); // Default French
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [prepTime, setPrepTime] = useState(15);
  const [cookTime, setCookTime] = useState(15);
  const [difficulty, setDifficulty] = useState('facile');
  const [showDifficultyPicker, setShowDifficultyPicker] = useState(false);

  const handleAnalyze = async () => {
    setUrlError('');
    
    if (!youtubeUrl.trim()) {
      setUrlError('Veuillez entrer une URL YouTube');
      return;
    }
    
    setStep('analyzing');
    setAnalysisStep(0);
    
    try {
      // Stage 1: Extract
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisStep(1);
      
      // Stage 2: Translate
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisStep(2);
      
      // Stage 3: Convert
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisStep(3);
      
      const data = await mockYouTubeExtraction(youtubeUrl, targetLang);
      setTitle(data.title);
      setIngredients(data.ingredients);
      setSteps(data.steps);
      setPrepTime(data.prepTime);
      setCookTime(data.cookTime);
      setDifficulty(data.difficulty);
      setStep('edit');
    } catch (error) {
      setUrlError("Impossible de récupérer la recette. Vérifiez l'URL.");
      setStep('input');
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { converted: '', original: '' }]);
  };

  const handleUpdateIngredient = (index, ingredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = ingredient;
    setIngredients(newIngredients);
  };

  const handleDeleteIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleAddStep = () => {
    setSteps([...steps, { converted: '', original: '' }]);
  };

  const handleUpdateStep = (index, step) => {
    const newSteps = [...steps];
    newSteps[index] = step;
    setSteps(newSteps);
  };

  const handleDeleteStep = (index) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    alert(`✅ Recette sauvegardée en ${targetLang === 'fr' ? 'français' : 'anglais'} !\n\nTitre: ${title}\nIngrédients: ${ingredients.length}\nÉtapes: ${steps.length}`);
  };

  const handleCancel = () => {
    if (step === 'edit') {
      if (confirm('Abandonner les modifications ?')) {
        setStep('input');
        setYoutubeUrl('');
        setTitle('');
        setIngredients([]);
        setSteps([]);
      }
    } else {
      alert('Retour à l\'écran précédent');
    }
  };

  const getDifficultyLabel = () => {
    const map = { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' };
    return map[difficulty];
  };

  const getSelectedLanguage = () => {
    return LANGUAGES.find(l => l.code === targetLang);
  };

  const canSave = title.trim() && ingredients.length > 0 && steps.length > 0;

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
          <div style={{ height: iOS.spacing.statusBar, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${iOS.spacing.standard}px`, ...iOS.typography.footnote, color: iOS.colors.label }}>
            <span>9:41</span>
            <span>🔋 📶</span>
          </div>
          
          <div style={{ height: iOS.spacing.navBar, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${iOS.spacing.standard}px` }}>
            <button onClick={handleCancel} style={{ background: 'none', border: 'none', color: iOS.colors.tint, cursor: 'pointer', padding: iOS.spacing.compact, display: 'flex', alignItems: 'center', gap: 4, ...iOS.typography.body }}>
              <ChevronLeft size={20} />
              {step === 'input' ? 'Retour' : 'Annuler'}
            </button>
            
            <h1 style={{ margin: 0, ...iOS.typography.headline, color: iOS.colors.label }}>
              {step === 'input' ? 'YouTube' : 'Nouvelle recette'}
            </h1>
            
            {step === 'edit' && (
              <button onClick={handleSave} disabled={!canSave} style={{ background: 'none', border: 'none', color: canSave ? iOS.colors.tint : iOS.colors.tertiaryLabel, cursor: canSave ? 'pointer' : 'not-allowed', padding: iOS.spacing.compact, ...iOS.typography.body, fontWeight: '600' }}>
                Valider
              </button>
            )}
            {step !== 'edit' && <div style={{ width: 60 }} />}
          </div>
        </nav>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
          
          {/* STEP 1: URL + LANGUAGE INPUT */}
          {step === 'input' && (
            <div style={{ padding: `${iOS.spacing.standard * 2}px ${iOS.spacing.standard}px` }}>
              <div style={{ textAlign: 'center', marginBottom: iOS.spacing.standard * 2 }}>
                <div style={{ fontSize: 80, marginBottom: iOS.spacing.standard }}>📺</div>
                <h2 style={{ margin: `0 0 ${iOS.spacing.compact}px 0`, ...iOS.typography.title2, color: iOS.colors.label }}>
                  Importez une recette YouTube
                </h2>
                <p style={{ margin: 0, ...iOS.typography.body, color: iOS.colors.secondaryLabel }}>
                  Collez le lien et choisissez la langue
                </p>
              </div>
              
              {/* URL Input */}
              <div style={{ marginBottom: iOS.spacing.standard }}>
                <label style={{ display: 'block', ...iOS.typography.footnote, color: iOS.colors.secondaryLabel, marginBottom: iOS.spacing.compact }}>
                  Lien YouTube
                </label>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: `${iOS.spacing.standard}px`,
                    border: urlError ? `2px solid ${iOS.colors.tint}` : `1px solid ${iOS.colors.separator}`,
                    borderRadius: 10,
                    ...iOS.typography.body,
                    color: iOS.colors.label,
                    backgroundColor: iOS.colors.systemBackground,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                />
                {urlError && (
                  <p style={{ margin: `${iOS.spacing.compact}px 0 0 0`, ...iOS.typography.footnote, color: iOS.colors.tint }}>
                    {urlError}
                  </p>
                )}
              </div>
              
              {/* Language Selector */}
              <div style={{ marginBottom: iOS.spacing.standard * 2 }}>
                <label style={{ display: 'block', ...iOS.typography.footnote, color: iOS.colors.secondaryLabel, marginBottom: iOS.spacing.compact }}>
                  Traduire en
                </label>
                <button
                  onClick={() => setShowLangPicker(true)}
                  style={{
                    width: '100%',
                    backgroundColor: iOS.colors.systemBackground,
                    border: `1px solid ${iOS.colors.separator}`,
                    borderRadius: 10,
                    padding: `${iOS.spacing.standard}px`,
                    ...iOS.typography.body,
                    color: iOS.colors.label,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    minHeight: 50,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: iOS.spacing.compact }}>
                    <span style={{ fontSize: 24 }}>{getSelectedLanguage()?.flag}</span>
                    <span>{getSelectedLanguage()?.name}</span>
                  </div>
                  <ChevronRight size={20} color={iOS.colors.tertiaryLabel} />
                </button>
              </div>
              
              {/* Analyze Button */}
              <button
                onClick={handleAnalyze}
                style={{
                  width: '100%',
                  backgroundColor: iOS.colors.tint,
                  color: iOS.colors.systemBackground,
                  border: 'none',
                  borderRadius: 10,
                  padding: `${iOS.spacing.standard}px`,
                  ...iOS.typography.headline,
                  cursor: 'pointer',
                  minHeight: 50,
                }}
              >
                Analyser et traduire
              </button>
            </div>
          )}

          {/* STEP 2: ANALYZING with 3 stages */}
          {step === 'analyzing' && (
            <div style={{ padding: `${iOS.spacing.standard * 3}px ${iOS.spacing.standard}px`, textAlign: 'center' }}>
              <div style={{ fontSize: 72, marginBottom: iOS.spacing.standard * 2 }}>⚡</div>
              
              <h2 style={{ margin: `0 0 ${iOS.spacing.standard}px 0`, ...iOS.typography.title2, color: iOS.colors.label }}>
                Traitement en cours...
              </h2>
              
              <p style={{ margin: `0 0 ${iOS.spacing.standard * 2}px 0`, ...iOS.typography.body, color: iOS.colors.secondaryLabel }}>
                Cela peut prendre quelques secondes
              </p>
              
              <div style={{ 
                backgroundColor: iOS.colors.systemBackground, 
                borderRadius: 12, 
                padding: iOS.spacing.standard, 
                textAlign: 'left',
                marginBottom: iOS.spacing.standard
              }}>
                <ProgressStep 
                  completed={analysisStep > 0} 
                  active={analysisStep === 0} 
                  label="Extraction de la transcription" 
                />
                <ProgressStep 
                  completed={analysisStep > 1} 
                  active={analysisStep === 1} 
                  label={`Traduction en ${getSelectedLanguage()?.name}`}
                />
                <ProgressStep 
                  completed={analysisStep > 2} 
                  active={analysisStep === 2} 
                  label="Conversion des unités de mesure" 
                />
              </div>
            </div>
          )}

          {/* STEP 3: EDIT with converted units */}
          {step === 'edit' && (
            <div style={{ paddingBottom: 34 }}>
              {/* AI Badge */}
              <div style={{ padding: `${iOS.spacing.standard}px`, textAlign: 'center', ...iOS.typography.footnote, color: iOS.colors.secondaryLabel }}>
                ✨ Généré et traduit par intelligence artificielle
              </div>

              {/* Title */}
              <SectionHeader>Titre</SectionHeader>
              <div style={{ marginLeft: iOS.spacing.standard, marginRight: iOS.spacing.standard, marginBottom: iOS.spacing.standard, borderRadius: 10, overflow: 'hidden' }}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nom de la recette"
                  style={{
                    width: '100%',
                    backgroundColor: iOS.colors.systemBackground,
                    border: 'none',
                    padding: `${iOS.spacing.standard}px`,
                    ...iOS.typography.title3,
                    color: iOS.colors.label,
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Ingredients with conversion display */}
              <SectionHeader count={ingredients.length}>Ingrédients</SectionHeader>
              <div style={{ marginLeft: iOS.spacing.standard, marginRight: iOS.spacing.standard, marginBottom: iOS.spacing.standard, borderRadius: 10, overflow: 'hidden' }}>
                {ingredients.map((ingredient, index) => (
                  <IngredientItem
                    key={index}
                    ingredient={ingredient}
                    onUpdate={(ing) => handleUpdateIngredient(index, ing)}
                    onDelete={() => handleDeleteIngredient(index)}
                  />
                ))}
                <AddButton onClick={handleAddIngredient}>Ajouter un ingrédient</AddButton>
              </div>

              {/* Steps with conversion display */}
              <SectionHeader count={steps.length}>Étapes</SectionHeader>
              <div style={{ marginLeft: iOS.spacing.standard, marginRight: iOS.spacing.standard, marginBottom: iOS.spacing.standard, borderRadius: 10, overflow: 'hidden' }}>
                {steps.map((step, index) => (
                  <StepItem
                    key={index}
                    number={index + 1}
                    step={step}
                    onUpdate={(st) => handleUpdateStep(index, st)}
                    onDelete={() => handleDeleteStep(index)}
                  />
                ))}
                <AddButton onClick={handleAddStep}>Ajouter une étape</AddButton>
              </div>

              {/* Infos */}
              <SectionHeader>Informations</SectionHeader>
              <div style={{ marginLeft: iOS.spacing.standard, marginRight: iOS.spacing.standard, marginBottom: iOS.spacing.standard, borderRadius: 10, overflow: 'hidden' }}>
                <InfoRow label="Préparation" value={`${prepTime} min`} onClick={() => {
                  const newTime = prompt('Temps de préparation (minutes):', prepTime);
                  if (newTime && !isNaN(newTime)) setPrepTime(parseInt(newTime));
                }} />
                <InfoRow label="Cuisson" value={`${cookTime} min`} onClick={() => {
                  const newTime = prompt('Temps de cuisson (minutes):', cookTime);
                  if (newTime && !isNaN(newTime)) setCookTime(parseInt(newTime));
                }} />
                <InfoRow label="Difficulté" value={getDifficultyLabel()} onClick={() => setShowDifficultyPicker(true)} />
              </div>

              {/* Language Badge */}
              <div style={{ padding: `0 ${iOS.spacing.standard}px ${iOS.spacing.standard}px`, textAlign: 'center', ...iOS.typography.footnote, color: iOS.colors.secondaryLabel }}>
                {getSelectedLanguage()?.flag} Recette en {getSelectedLanguage()?.name}
              </div>
            </div>
          )}
        </div>

        {/* Language Picker Modal */}
        <LanguagePicker
          visible={showLangPicker}
          value={targetLang}
          onChange={setTargetLang}
          onClose={() => setShowLangPicker(false)}
        />

        {/* Difficulty Picker Modal */}
        <DifficultyPicker
          visible={showDifficultyPicker}
          value={difficulty}
          onChange={setDifficulty}
          onClose={() => setShowDifficultyPicker(false)}
        />

        {/* Home Indicator */}
        <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 134, height: 5, backgroundColor: iOS.colors.label, borderRadius: 100, opacity: 0.3 }} aria-hidden="true" />
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}