// Utility: vytvořit flip-kartu z dat postavy
function createFlipCard(character) {
  const article = document.createElement('article');
  article.className = 'flip-card w-full h-64';
  article.setAttribute('tabindex', '0');
  article.setAttribute('role', 'button');
  article.setAttribute('aria-pressed', 'false');
  
  const flipInner = document.createElement('div');
  flipInner.className = 'flip-inner w-full h-full';
  
  // Front face - obrázek a jméno
  const flipFront = document.createElement('div');
  flipFront.className = 'flip-front bg-white shadow-lg rounded-xl p-4 text-center border border-gray-200 overflow-hidden flex flex-col items-center justify-center';
  flipFront.innerHTML = `
    ${character.image ? `<img src="${character.image}" alt="${character.name}" class="w-full h-32 object-cover rounded-md mb-3">` : `<div class="w-full h-32 bg-gray-300 rounded-md mb-3 flex items-center justify-center text-gray-500">Obrázek</div>`}
    <h3 class="text-xl font-bold">${character.name}</h3>
  `;
  
  // Back face - detailní info
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

// Utility: inicializovat flip-karty (event listenery)
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

// Načíst a vykreslit karty z JSON
async function loadCharacters() {
  try {
    // Načíst hlavní postavy
    const mainResponse = await fetch('/data/hlavni_postavy.json');
    const mainCharacters = await mainResponse.json();
    const mainContainer = document.getElementById('main-characters');
    
    if (mainContainer) {
      mainCharacters.forEach(char => {
        mainContainer.appendChild(createFlipCard(char));
      });
    }

    // Načíst vedlejší postavy
    const sideResponse = await fetch('/data/vedlejsi_postavy.json');
    const sideCharacters = await sideResponse.json();
    const sideContainer = document.getElementById('side-characters');
    
    if (sideContainer) {
      sideCharacters.forEach(char => {
        sideContainer.appendChild(createFlipCard(char));
      });
    }

    // Inicializovat flip-karty
    initializeFlipCards();
  } catch (error) {
    console.error('Chyba při načítání postav z JSON:', error);
  }
}

// Spustit po načtení DOM
document.addEventListener('DOMContentLoaded', loadCharacters);
