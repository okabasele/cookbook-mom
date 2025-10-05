import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Search, Plus, ChevronRight, Trash2 } from 'lucide-react';

// ===========================
// 🎨 iOS SYSTEM COLORS (Real)
// ===========================
const iOS = {
  colors: {
    // Backgrounds
    systemBackground: '#FFFFFF',
    secondarySystemBackground: '#F2F2F7',
    tertiarySystemBackground: '#FFFFFF',
    groupedBackground: '#F2F2F7',
    
    // Labels
    label: '#000000',
    secondaryLabel: 'rgba(60, 60, 67, 0.6)',
    tertiaryLabel: 'rgba(60, 60, 67, 0.3)',
    
    // Fills
    systemFill: 'rgba(120, 120, 128, 0.2)',
    secondarySystemFill: 'rgba(120, 120, 128, 0.16)',
    tertiarySystemFill: 'rgba(118, 118, 128, 0.12)',
    
    // Separator
    separator: 'rgba(60, 60, 67, 0.29)',
    opaqueSeparator: '#C6C6C8',
    
    // Tint (customizable accent)
    tint: '#8B2B3E', // Notre burgundy comme accent
    tintLight: '#A6495A',
    
    // System colors
    systemRed: '#FF3B30',
    systemGreen: '#34C759',
    systemBlue: '#007AFF',
    systemOrange: '#FF9500',
    systemYellow: '#FFCC00',
    systemGray: '#8E8E93',
    systemGray2: '#AEAEB2',
    systemGray3: '#C7C7CC',
    systemGray4: '#D1D1D6',
    systemGray5: '#E5E5EA',
    systemGray6: '#F2F2F7',
  },
  
  typography: {
    // iOS Dynamic Type sizes
    largeTitle: { fontSize: 34, lineHeight: '41px', fontWeight: '700', letterSpacing: '0.374px' },
    title1: { fontSize: 28, lineHeight: '34px', fontWeight: '700', letterSpacing: '0.364px' },
    title2: { fontSize: 22, lineHeight: '28px', fontWeight: '700', letterSpacing: '0.352px' },
    title3: { fontSize: 20, lineHeight: '25px', fontWeight: '600', letterSpacing: '0.38px' },
    headline: { fontSize: 17, lineHeight: '22px', fontWeight: '600', letterSpacing: '-0.408px' },
    body: { fontSize: 17, lineHeight: '22px', fontWeight: '400', letterSpacing: '-0.408px' },
    callout: { fontSize: 16, lineHeight: '21px', fontWeight: '400', letterSpacing: '-0.32px' },
    subheadline: { fontSize: 15, lineHeight: '20px', fontWeight: '400', letterSpacing: '-0.24px' },
    footnote: { fontSize: 13, lineHeight: '18px', fontWeight: '400', letterSpacing: '-0.078px' },
    caption1: { fontSize: 12, lineHeight: '16px', fontWeight: '400', letterSpacing: '0px' },
    caption2: { fontSize: 11, lineHeight: '13px', fontWeight: '400', letterSpacing: '0.066px' },
  },
  
  spacing: {
    statusBar: 47,
    navBar: 44,
    tabBar: 49,
    homeIndicator: 34,
    standard: 16,
    compact: 8,
  },
  
  animations: {
    spring: { tension: 300, friction: 20 },
    duration: { fast: 200, normal: 300, slow: 500 },
  },
};

// ===========================
// 🍽️ RECIPE UTILS
// ===========================
const getRecipeEmoji = (title) => {
  const map = {
    cookie: '🍪', cake: '🍰', bread: '🥖', pasta: '🍝', soup: '🍲',
    salad: '🥗', pizza: '🍕', burger: '🍔', croissant: '🥐', cupcake: '🧁',
  };
  const key = Object.keys(map).find(k => title.toLowerCase().includes(k));
  return map[key] || '🍽️';
};

const getRelativeTime = (date) => {
  const days = Math.floor((new Date() - new Date(date)) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7) return `Il y a ${days}j`;
  return `Il y a ${Math.floor(days / 7)}sem`;
};

// ===========================
// 🧩 iOS LIST ROW (Real Component)
// ===========================
const RecipeRow = ({ recipe, onClick, onDelete, showDeleteButton }) => {
  const [isPressed, setIsPressed] = useState(false);
  const [swipeX, setSwipeX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  const emoji = useMemo(() => getRecipeEmoji(recipe.title), [recipe.title]);
  const relativeTime = useMemo(() => getRelativeTime(recipe.createdAt), [recipe.createdAt]);
  const languageFlag = recipe.language === 'fr' ? '🇫🇷' : '🇺🇸';

  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;
    if (diff > 0 && diff < 80) {
      setSwipeX(diff);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (swipeX > 40) {
      setSwipeX(80); // Snap to delete button
    } else {
      setSwipeX(0); // Snap back
    }
  };

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Delete button (revealed on swipe) */}
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          backgroundColor: iOS.colors.systemRed,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: swipeX > 0 ? 1 : 0,
          transition: isDragging ? 'none' : 'opacity 0.2s ease',
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          style={{
            background: 'none',
            border: 'none',
            color: iOS.colors.systemBackground,
            cursor: 'pointer',
            padding: iOS.spacing.compact,
          }}
          aria-label="Supprimer la recette"
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Main row */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onClick={onClick}
        style={{
          position: 'relative',
          backgroundColor: isPressed ? iOS.colors.systemGray6 : iOS.colors.systemBackground,
          padding: `12px ${iOS.spacing.standard}px`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          cursor: 'pointer',
          transition: isDragging ? 'none' : 'all 0.2s ease',
          transform: `translateX(-${swipeX}px)`,
          userSelect: 'none',
        }}
        role="button"
        tabIndex={0}
        aria-label={`Ouvrir la recette ${recipe.title}`}
      >
        {/* Emoji icon */}
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: 12,
            background: `linear-gradient(135deg, ${iOS.colors.systemGray6} 0%, ${iOS.colors.systemGray5} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          {emoji}
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <h3
              style={{
                margin: 0,
                ...iOS.typography.body,
                fontWeight: '600',
                color: iOS.colors.label,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {recipe.title}
            </h3>
          </div>

          {/* Metadata */}
          <div
            style={{
              ...iOS.typography.subheadline,
              color: iOS.colors.secondaryLabel,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexWrap: 'wrap',
            }}
          >
            {/* Language flags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {recipe.language === 'fr' ? (
                <>
                  <span>🇫🇷</span>
                  {recipe.translationsCount > 0 && <span>🇺🇸</span>}
                </>
              ) : (
                <>
                  <span>🇺🇸</span>
                  {recipe.translationsCount > 0 && <span>🇫🇷</span>}
                </>
              )}
            </div>
            <span>•</span>
            <span>{recipe.ingredientsCount} ingr.</span>
            <span>•</span>
            <span>{recipe.prepTime} min</span>
            <span>•</span>
            <span>{relativeTime}</span>
          </div>
        </div>

        {/* Chevron */}
        <ChevronRight
          size={20}
          color={iOS.colors.tertiaryLabel}
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        />
      </div>

      {/* Separator */}
      <div
        style={{
          height: 0.5,
          backgroundColor: iOS.colors.separator,
          marginLeft: 88, // Align with content (60px icon + 12px gap + 16px padding)
        }}
        aria-hidden="true"
      />
    </div>
  );
};

// ===========================
// 🧩 EMPTY STATE
// ===========================
const EmptyState = ({ onAddRecipe }) => (
  <div
    style={{
      padding: `${iOS.spacing.standard * 4}px ${iOS.spacing.standard}px`,
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: 80, marginBottom: iOS.spacing.standard * 2 }} aria-hidden="true">
      🧑‍🍳
    </div>
    <h2
      style={{
        margin: `0 0 ${iOS.spacing.compact}px 0`,
        ...iOS.typography.title2,
        color: iOS.colors.label,
      }}
    >
      Aucune recette
    </h2>
    <p
      style={{
        margin: `0 0 ${iOS.spacing.standard * 2}px 0`,
        ...iOS.typography.body,
        color: iOS.colors.secondaryLabel,
        maxWidth: 280,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      Commencez par ajouter votre première recette familiale
    </p>
  </div>
);

// ===========================
// 🏠 MAIN COMPONENT
// ===========================
export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const scrollRef = useRef(null);

  const recipes = [
    { id: '1', title: 'Cookies aux Pépites de Chocolat', language: 'fr', translationsCount: 1, ingredientsCount: 8, prepTime: 25, difficulty: 'facile', createdAt: '2025-09-27' },
    { id: '2', title: 'Chocolate Chip Cookies', language: 'en', translationsCount: 0, ingredientsCount: 8, prepTime: 25, difficulty: 'facile', createdAt: '2025-09-27' },
    { id: '3', title: 'Soupe à l\'Oignon Gratinée', language: 'fr', translationsCount: 2, ingredientsCount: 12, prepTime: 60, difficulty: 'moyen', createdAt: '2025-09-20' },
    { id: '4', title: 'Tarte Tatin aux Pommes', language: 'fr', translationsCount: 1, ingredientsCount: 6, prepTime: 45, difficulty: 'difficile', createdAt: '2025-09-15' },
    { id: '5', title: 'Pain Maison Traditionnel', language: 'fr', translationsCount: 0, ingredientsCount: 4, prepTime: 180, difficulty: 'moyen', createdAt: '2025-08-28' },
    { id: '6', title: 'Ratatouille Provençale', language: 'fr', translationsCount: 0, ingredientsCount: 10, prepTime: 45, difficulty: 'moyen', createdAt: '2025-09-10' },
  ];

  const filteredRecipes = useMemo(
    () => recipes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  const handleScroll = useCallback((e) => {
    setScrollY(e.target.scrollTop);
  }, []);

  const handleRecipeClick = useCallback((recipe) => {
    alert(`Navigation vers: ${recipe.title}`);
  }, []);

  const handleDeleteRecipe = useCallback((recipeId) => {
    alert(`Supprimer recette ID: ${recipeId}`);
  }, []);

  const handleAddRecipe = useCallback(() => {
    alert('Navigation vers écran d\'ajout');
  }, []);

  // Calculate nav bar state
  const navBarProgress = Math.min(scrollY / 52, 1);
  const largeTitleOpacity = Math.max(0, 1 - navBarProgress * 2);
  const smallTitleOpacity = navBarProgress;

  return (
    <div
      style={{
        height: '100vh',
        backgroundColor: iOS.colors.groupedBackground,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Mobile Container */}
      <div
        style={{
          maxWidth: 480,
          height: '100vh',
          margin: '0 auto',
          backgroundColor: iOS.colors.groupedBackground,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* iOS Navigation Bar */}
        <nav
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            backgroundColor: `rgba(242, 242, 247, ${0.8 + navBarProgress * 0.2})`,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderBottom: `0.5px solid ${iOS.colors.separator}`,
          }}
          role="banner"
        >
          {/* Status Bar */}
          <div
            style={{
              height: iOS.spacing.statusBar,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `0 ${iOS.spacing.standard}px`,
              ...iOS.typography.caption1,
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
            {/* Left (empty for home screen) */}
            <div style={{ width: 44 }} />

            {/* Center - Small Title */}
            <h1
              style={{
                margin: 0,
                ...iOS.typography.headline,
                color: iOS.colors.label,
                opacity: smallTitleOpacity,
                transition: 'opacity 0.2s ease',
              }}
            >
              Mes Recettes
            </h1>

            {/* Right - Add Button */}
            <button
              onClick={handleAddRecipe}
              style={{
                background: 'none',
                border: 'none',
                color: iOS.colors.tint,
                cursor: 'pointer',
                padding: iOS.spacing.compact,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Ajouter une recette"
            >
              <Plus size={28} strokeWidth={2} />
            </button>
          </div>
        </nav>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
          }}
          role="main"
        >
          {/* Large Title Area */}
          <div
            style={{
              paddingTop: iOS.spacing.statusBar + iOS.spacing.navBar,
              paddingLeft: iOS.spacing.standard,
              paddingRight: iOS.spacing.standard,
              paddingBottom: iOS.spacing.compact,
              backgroundColor: iOS.colors.groupedBackground,
            }}
          >
            {/* Large Title */}
            <h1
              style={{
                margin: `0 0 ${iOS.spacing.standard}px 0`,
                ...iOS.typography.largeTitle,
                color: iOS.colors.label,
                opacity: largeTitleOpacity,
                transform: `translateY(${navBarProgress * -8}px)`,
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              Mes Recettes
            </h1>

            {/* Search Bar (iOS style) */}
            <div
              style={{
                position: 'relative',
                backgroundColor: searchFocused ? iOS.colors.tertiarySystemFill : iOS.colors.systemFill,
                borderRadius: 10,
                transition: 'background-color 0.2s ease',
              }}
            >
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: iOS.spacing.compact,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: iOS.colors.secondaryLabel,
                }}
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Rechercher"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                style={{
                  width: '100%',
                  border: 'none',
                  padding: `10px ${iOS.spacing.compact}px 10px 32px`,
                  ...iOS.typography.body,
                  color: iOS.colors.label,
                  outline: 'none',
                  backgroundColor: 'transparent',
                }}
                aria-label="Rechercher une recette"
              />
            </div>
          </div>

          {/* List Section */}
          <div
            style={{
              marginTop: iOS.spacing.standard,
              backgroundColor: iOS.colors.systemBackground,
              borderRadius: 10,
              marginLeft: iOS.spacing.standard,
              marginRight: iOS.spacing.standard,
              marginBottom: iOS.spacing.homeIndicator + iOS.spacing.standard,
              overflow: 'hidden',
            }}
          >
            {filteredRecipes.length === 0 && !searchQuery && (
              <EmptyState onAddRecipe={handleAddRecipe} />
            )}

            {filteredRecipes.length === 0 && searchQuery && (
              <div
                style={{
                  padding: `${iOS.spacing.standard * 3}px ${iOS.spacing.standard}px`,
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 56, marginBottom: iOS.spacing.standard }} aria-hidden="true">
                  🔍
                </div>
                <p style={{ ...iOS.typography.body, color: iOS.colors.secondaryLabel, margin: 0 }}>
                  Aucun résultat pour "{searchQuery}"
                </p>
              </div>
            )}

            {filteredRecipes.length > 0 && (
              <div role="list" aria-label="Liste des recettes">
                {filteredRecipes.map((recipe, index) => (
                  <div key={recipe.id} role="listitem">
                    <RecipeRow
                      recipe={recipe}
                      onClick={() => handleRecipeClick(recipe)}
                      onDelete={() => handleDeleteRecipe(recipe.id)}
                      showDeleteButton={true}
                    />
                  </div>
                ))}
              </div>
            )}
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