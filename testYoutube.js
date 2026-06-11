const { GetVideoDetails } = require('youtube-search-api');

const youtubeUrlPattern =
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
const youtubeIdPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([0-9A-Za-z_-]{11})/;
const isRecipeVideo = (title, description) => {
    const recipeKeywords = [
        // French
        'recette',
        'cuisine',
        'cuisson',
        'préparation',
        'ingrédients',
        'comment faire',
        'comment préparer',
        'gâteau',
        'tarte',
        'soupe',

        // English
        'recipe',
        'cooking',
        'baking',
        'how to make',
        'how to cook',
        'ingredients',
        'cake',
        'pie',
        'soup',
        'dish',
        'bake',
        'brownie'
    ];

    const text = (title + ' ' + description).toLowerCase();
    return recipeKeywords.some((keyword) => text.includes(keyword));
};

const fetchYoutubeMetadata = async (videoId) => {
    const video = await GetVideoDetails(videoId);

    if (!video) {
        throw new Error('Vidéo introuvable');
    }
    console.log({ video });

    return {
        title: video.title,
        description: video.description,
    };
};

 const retrieveYoutubeVideoRecipe = async (url, targetLang) => {
  // Step 1: Validate URL
  if (!youtubeUrlPattern.test(url)) {
    throw new Error('URL invalide');
  }
  console.log('URL validée');
  // Step 2: Extract video ID
  const videoIdMatch = url.match(youtubeIdPattern);
  if (!videoIdMatch) {
    throw new Error("ID de vidéo introuvable dans l'URL");
  }
    console.log('ID de vidéo extrait :', videoIdMatch[1]);
  // Step 3: Fetch metadata (title + description via oEmbed)
  const videoId = videoIdMatch[1];
  const metadata = await fetchYoutubeMetadata(videoId);
  console.log('Métadonnées récupérées :', metadata);
  // Step 4: Check if recipe with regex
  const isRecipe = isRecipeVideo(metadata.title, metadata.description);
  if (!isRecipe) {
    throw new Error('Not a recipe video');
  }
    console.log('Vidéo identifiée comme une recette');
  // Step 5: Extract recipe with OpenAI (pass targetLang AND targetMetric)
  return null;
};

// Example usage
(async () => {
    const testUrl = 'https://youtu.be/QY0TiUheSEU?si=zj6kkPYGtZLWCUc1'
    try {
        const recipe = await retrieveYoutubeVideoRecipe(testUrl, 'fr');
        console.log('Recette extraite :', recipe);
    } catch (error) {
        console.error('Erreur lors de l\'extraction de la recette :', error.message);
    }
})();

// run with: node testYoutube.js