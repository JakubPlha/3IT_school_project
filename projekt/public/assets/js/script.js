// === VYTVARENI FLIP KARTY ===
// tato funkce dostane objekt postavy a vytvori z nej otocitelnou kartu
// zepredu je obrazek + jmeno, zezadu jsou detaily (vek, vztahy atd.)
function createFlipCard(character) {
  const article = document.createElement('article');
  article.className = 'flip-card w-full h-64';
  article.setAttribute('tabindex', '0');
  article.setAttribute('role', 'button');
  article.setAttribute('aria-pressed', 'false');
  
  const flipInner = document.createElement('div');
  flipInner.className = 'flip-inner w-full h-full';
  
  // predni stranma - obrázek a jméno
  const flipFront = document.createElement('div');
  flipFront.className = 'flip-front bg-white shadow-lg rounded-xl p-0 text-center border border-gray-200 overflow-hidden flex flex-col items-center justify-end relative';
  flipFront.innerHTML = `
    <div class="absolute inset-0">
      ${character.image ? `<img src="${character.image}" alt="${character.name}" class="w-full h-full object-cover">` : `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Obrázek</div>`}
    </div>
    <h3 class="text-xl font-bold bg-white bg-opacity-90 w-full py-3 relative z-10">${character.name}</h3>
  `;
  
  // zadni strana - detailní info
  const flipBack = document.createElement('div');
  flipBack.className = 'flip-back bg-white shadow-lg rounded-xl p-4 text-center border border-gray-200 flex items-center justify-center';
  
  let backContent = `
    <div class="w-full text-left">
      <h3 class="text-xl font-bold mb-2 text-center">${character.name}</h3>
  `;
  
  if (character.age) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Věk:</strong> ${character.age}</p>`;
  if (character.gender) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Pohlaví:</strong> ${character.gender}</p>`;
  if (character.status) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Stav:</strong> ${character.status}</p>`;
  if (character.relationship) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Vztah:</strong> ${character.relationship}</p>`;
  if (character.children) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Děti:</strong> ${character.children}</p>`;
  if (character.spouse) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Partner:</strong> ${character.spouse}</p>`;
  if (character.enemy) backContent += `<p class="text-sm text-gray-600 mb-1"><strong>Nepřítel:</strong> ${character.enemy}</p>`;
  if (character.description) backContent += `<p class="text-gray-700 text-sm mt-2 text-center">${character.description}</p>`;
  
  backContent += `</div>`;
  flipBack.innerHTML = backContent;
  
  flipInner.appendChild(flipFront);
  flipInner.appendChild(flipBack);
  article.appendChild(flipInner);
  
  return article;
}

// === INICIALIZACE FLIPOVANI ===
// nastavi event listenery na vsechny karty aby se daly otocit kliknutim nebo enterem
function initializeFlipCards() {
  const cards = document.querySelectorAll('.flip-card');
  cards.forEach(card => {
    // toggle na klik
    card.addEventListener('click', function(e){
      const isFlipped = card.classList.toggle('is-flipped');
      card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
    });

    // klávesa Enter a Space
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        const isFlipped = card.classList.toggle('is-flipped');
        card.setAttribute('aria-pressed', isFlipped ? 'true' : 'false');
      }
    });
  });
}

// === NACTENI POSTAV Z JSON ===
// stahne hlavni i vedlejsi postavy ze souboru a vytvori z nich karty
async function loadCharacters() {
  try {
    console.log("Začínam načítat postavy...");
    
    // Načíst hlavní postavy
    const mainResponse = await fetch('/data/hlavni_postavy.json');
    console.log("Odpověď z hlavni_postavy.json:", mainResponse.status);
    
    if (!mainResponse.ok) {
      throw new Error(`HTTP error! status: ${mainResponse.status}`);
    }
    
    const mainCharacters = await mainResponse.json();
    console.log("Hlavní postavy načteny:", mainCharacters);
    
    const mainContainer = document.getElementById('main-characters');
    console.log("Main container element:", mainContainer);
    
    if (mainContainer) {
      mainCharacters.forEach(char => {
        console.log("Přidávám postavu:", char.name);
        mainContainer.appendChild(createFlipCard(char));
      });
    }

    // Načíst vedlejší postavy
    const sideResponse = await fetch('/data/vedlejsi_postavy.json');
    console.log("Odpověď z vedlejsi_postavy.json:", sideResponse.status);
    
    if (!sideResponse.ok) {
      throw new Error(`HTTP error! status: ${sideResponse.status}`);
    }
    
    const sideCharacters = await sideResponse.json();
    console.log("Vedlejší postavy načteny:", sideCharacters);
    
    const sideContainer = document.getElementById('side-characters');
    console.log("Side container element:", sideContainer);
    
    if (sideContainer) {
      sideCharacters.forEach(char => {
        console.log("Přidávám vedlejší postavu:", char.name);
        sideContainer.appendChild(createFlipCard(char));
      });
    }

    // Inicializovat flip-karty
    initializeFlipCards();
    console.log("Postavy úspěšně načteny!");
  } catch (error) {
    console.error('Chyba při načítání postav z JSON:', error);
  }
}

// === FEEDBACK FORMULAR ===
// otevirani/zavirani
function initializeFeedback() {
  const feedbackButton = document.getElementById('feedback-button');
  const feedbackModal = document.getElementById('feedback-modal');
  const feedbackClose = document.getElementById('feedback-close');
  const feedbackForm = document.getElementById('feedback-form');
  const charCount = document.getElementById('char-count');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackMessage = document.getElementById('feedback-message');

  // Otevřít
  feedbackButton.addEventListener('click', () => {
    feedbackModal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Zakázat scrollování
  });

  // Zavřít
  const closeModal = () => {
    feedbackModal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Povolit scrollování
    feedbackForm.reset();
    charCount.textContent = '0';
    feedbackMessage.classList.add('hidden');
  };

  feedbackClose.addEventListener('click', closeModal);

  // Zavřít při kliknutí na pozadí
  feedbackModal.addEventListener('click', (e) => {
    if (e.target === feedbackModal) {
      closeModal();
    }
  });

  // Počítadlo znaků
  feedbackText.addEventListener('input', (e) => {
    charCount.textContent = e.target.value.length;
  });

  // Odeslat formulář
  feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('feedback-email').value;
    const message = feedbackText.value;

    // stav: posilam
    feedbackMessage.classList.remove('hidden', 'error', 'success');
    feedbackMessage.textContent = 'Posilam...';

    // Pokusne zavolat AJAX ping (staticky JSON na python serveru)
    try {
      const res = await fetch('/api/ping.json');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      await res.json();
      // OK
      feedbackMessage.classList.remove('error');
      feedbackMessage.classList.add('success');
      feedbackMessage.textContent = `Dekujeme za feedback, ${email}! 🎉`;
    } catch (err) {
      // chyba
      feedbackMessage.classList.remove('success');
      feedbackMessage.classList.add('error');
      feedbackMessage.textContent = 'Odeslani se nepovedlo, zkus to prosim znovu.';
      console.warn('Ping selhal:', err);
      return; // nechame formular otevreny
    }

    // Resetovat formulář
    setTimeout(() => {
      feedbackForm.reset();
      charCount.textContent = '0';
      feedbackMessage.classList.add('hidden');
      closeModal();
    }, 2000);

    // Zde by se normálně poslalo na backend
    console.log('Feedback:', { email, message });
  });
}

// === HRA HADEJ POSTAVU ===
// globalni stav hry - drzi info o aktualni postave, odkrytych policek a pokusech
let gameState = {
  allCharacters: [],
  currentCharacter: null,
  revealedTiles: [],
  attempts: 0,
  gameOver: false
};

// nacte vsechny postavy do hry a spusti prvni kolo
async function initializeGame() {
  try {
    // stahne vsechny postavy pro hru
    const mainResponse = await fetch('/data/hlavni_postavy.json');
    const sideResponse = await fetch('/data/vedlejsi_postavy.json');
    
    const mainChars = await mainResponse.json();
    const sideChars = await sideResponse.json();
    
    gameState.allCharacters = [...mainChars, ...sideChars].filter(char => char.image);
    
    startNewGame();
  } catch (error) {
    console.error('Chyba při načítání postav pro hru:', error);
  }
}

// vytvori novou hru - vybere nahodnou postavu a resetuje stav
function startNewGame() {
  // vybere nahodnou postavu
  gameState.currentCharacter = gameState.allCharacters[Math.floor(Math.random() * gameState.allCharacters.length)];
  gameState.revealedTiles = [];
  gameState.attempts = 0;
  gameState.gameOver = false;
  
  // UI reset
  document.getElementById('attempts-count').textContent = '0';
  document.getElementById('guess-input').value = '';
  document.getElementById('guess-input').disabled = false;
  document.getElementById('guess-button').disabled = false;
  document.getElementById('game-result').classList.add('hidden');
  document.getElementById('new-game-button').classList.add('hidden');
  
  // Vytvoř grid
  createGameGrid();
  
  console.log('Nová hra! Správná odpověď:', gameState.currentCharacter.name);
}

// vytvori 3x3 grid s obrazkem postavy na pozadi, vsechno zacernene
function createGameGrid() {
  const grid = document.getElementById('game-grid');
  grid.innerHTML = '';
  grid.style.backgroundImage = `url('${gameState.currentCharacter.image}')`;
  
  // Vytvoř 9 políček (3x3)
  for (let i = 0; i < 9; i++) {
    const tile = document.createElement('div');
    tile.className = 'grid-tile';
    tile.dataset.index = i;
    
    const overlay = document.createElement('div');
    overlay.className = 'grid-tile-overlay';
    
    tile.appendChild(overlay);
    grid.appendChild(tile);
  }
}

// odkryje nahodne jedno policko (po spatnem tipu)
function revealRandomTile() {
  const hiddenTiles = Array.from({length: 9}, (_, i) => i)
    .filter(i => !gameState.revealedTiles.includes(i));
  
  if (hiddenTiles.length === 0) return;
  
  const randomIndex = hiddenTiles[Math.floor(Math.random() * hiddenTiles.length)];
  gameState.revealedTiles.push(randomIndex);
  
  const tile = document.querySelector(`.grid-tile[data-index="${randomIndex}"] .grid-tile-overlay`);
  if (tile) {
    tile.classList.add('revealed');
  }
}

// odkryje vsechna policka (pri vyhre nebo prohre)
function revealAllTiles() {
  for (let i = 0; i < 9; i++) {
    const tile = document.querySelector(`.grid-tile[data-index="${i}"] .grid-tile-overlay`);
    if (tile) {
      tile.classList.add('revealed');
    }
  }
}

// odstrani diakritiku a prebytecne mezery pro porovnani jmen
function normalizeString(str) {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

// zkontroluje tip hrace a rozhodne o vyhre/prohre/dalsim kole
function checkGuess() {
  if (gameState.gameOver) return;
  
  const input = document.getElementById('guess-input');
  const guess = normalizeString(input.value);
  const correctName = normalizeString(gameState.currentCharacter.name);
  
  if (!guess) return;
  
  gameState.attempts++;
  document.getElementById('attempts-count').textContent = gameState.attempts;
  
  if (guess === correctName) {
    // VÝHRA!
    gameState.gameOver = true;
    revealAllTiles();
    
    const result = document.getElementById('game-result');
    result.textContent = `✓ Správně! ${gameState.currentCharacter.name}`;
    result.classList.remove('hidden', 'failure');
    result.classList.add('success');
    
    document.getElementById('guess-input').disabled = true;
    document.getElementById('guess-button').disabled = true;
    document.getElementById('new-game-button').classList.remove('hidden');
  } else {
    // ŠPATNĚ - odkryj políčko
    revealRandomTile();
    input.value = '';
    input.focus();
    
    // Pokud jsou všechna políčka odkrytá - prohra
    if (gameState.revealedTiles.length >= 9) {
      gameState.gameOver = true;
      
      const result = document.getElementById('game-result');
      result.textContent = `✗ Neúspěch! Správná odpověď: ${gameState.currentCharacter.name}`;
      result.classList.remove('hidden', 'success');
      result.classList.add('failure');
      
      document.getElementById('guess-input').disabled = true;
      document.getElementById('guess-button').disabled = true;
      document.getElementById('new-game-button').classList.remove('hidden');
    }
  }
}

// nastavi tlacitka a enter pro hadani
function setupGameListeners() {
  document.getElementById('guess-button').addEventListener('click', checkGuess);
  
  document.getElementById('guess-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      checkGuess();
    }
  });
  
  document.getElementById('new-game-button').addEventListener('click', startNewGame);
}

// === SPUSTENI VSECH FUNKCI PO NACTENI STRANKY ===
document.addEventListener('DOMContentLoaded', () => {
  loadCharacters();
  initializeFeedback();
  initializeGame();
  setupGameListeners();
});
