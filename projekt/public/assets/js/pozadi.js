// === POZADI STRANKY - STROMY A PTACI ===
// tento soubor vytvari nahodne stromy na zelene louce a nahodne letici ptaky

// === GENEROVANI STROMU ===
// vygeneruje nahodny pocet stromu s ruznymi velikostmi po cele sirce obrazovky
function generateRandomTrees() {
    const city = document.getElementById("city");
    if (!city) return;

    // Vyčistit předchozí stromy
    const existingTrees = city.querySelectorAll('.tree');
    existingTrees.forEach(tree => tree.remove());

    // Vytvořit SVG pro stromy
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} 200`);
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';

    // Počet stromů
    const treeCount = Math.floor(window.innerWidth / 150);
    
    // Generovat náhodné stromy
    for (let i = 0; i < treeCount; i++) {
        const x = Math.random() * window.innerWidth;
        const size = 0.6 + Math.random() * 0.6;
        const trunkWidth = 15 * size;
        const trunkHeight = 80 * size;
        const crownRadius = 40 * size;
        const yOffset = 30 * (Math.random() * 0.3);

        // Kmen
        const trunk = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        trunk.setAttribute('x', x - trunkWidth / 2);
        trunk.setAttribute('y', 120 - trunkHeight + yOffset);
        trunk.setAttribute('width', trunkWidth);
        trunk.setAttribute('height', trunkHeight);
        trunk.setAttribute('fill', '#6b4423');
        svg.appendChild(trunk);

        // Koruna
        const crown = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        crown.setAttribute('cx', x);
        crown.setAttribute('cy', 70 + yOffset);
        crown.setAttribute('r', crownRadius);
        crown.setAttribute('fill', '#2d5016');
        svg.appendChild(crown);
    }

    const treeContainer = document.createElement('div');
    treeContainer.className = 'tree';
    treeContainer.style.position = 'absolute';
    treeContainer.style.width = '100%';
    treeContainer.style.height = '100%';
    treeContainer.appendChild(svg);
    
    city.appendChild(treeContainer);
}

// spustit vytvoreni stromu pri nacteni stranky
generateRandomTrees();

// kdyz uzivatel zmeni velikost okna, prekresli stromy
window.addEventListener('resize', generateRandomTrees);

// === VYTVORENI LETICIHO PTAKA ===
// vytvori zlutcho ptaka s cernym obkreslenim, ktery preleti pres obrazovku zleva doprava
function createFlyingBird() {
    const background = document.getElementById('background');
    if (!background) return;

    // Vytvořit SVG ptáka
    const bird = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    bird.setAttribute('width', '80');
    bird.setAttribute('height', '40');
    bird.setAttribute('viewBox', '0 0 80 40');
    bird.style.position = 'fixed';
    bird.style.top = Math.random() * 30 + 20 + '%'; // Náhodná výška v horní části
    bird.style.left = '-100px';
    bird.style.zIndex = '-8';
    bird.style.pointer = 'none';

    // Krídla ptáka
    const birdBody = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    
    // Tělo
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    body.setAttribute('cx', '40');
    body.setAttribute('cy', '20');
    body.setAttribute('r', '8');
    body.setAttribute('fill', '#FFD700');
    body.setAttribute('stroke', '#000');
    body.setAttribute('stroke-width', '1.5');
    birdBody.appendChild(body);

    // Grupa pro křídla s animací
    const wingsGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wingsGroup.style.animation = `flutter 0.4s ease-in-out infinite`;

    // Levé křídlo
    const leftWing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    leftWing.setAttribute('d', 'M 35 20 Q 20 15 10 18 Q 20 20 35 22 Z');
    leftWing.setAttribute('fill', '#FFD700');
    leftWing.setAttribute('stroke', '#000');
    leftWing.setAttribute('stroke-width', '1.5');
    wingsGroup.appendChild(leftWing);

    // Pravé křídlo
    const rightWing = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    rightWing.setAttribute('d', 'M 45 20 Q 60 15 70 18 Q 60 20 45 22 Z');
    rightWing.setAttribute('fill', '#FFD700');
    rightWing.setAttribute('stroke', '#000');
    rightWing.setAttribute('stroke-width', '1.5');
    wingsGroup.appendChild(rightWing);

    birdBody.appendChild(wingsGroup);
    bird.appendChild(birdBody);
    document.body.appendChild(bird);

    // Přidat animaci pro křídla
    if (!document.getElementById('bird-flutter-style')) {
        const flutterStyle = document.createElement('style');
        flutterStyle.id = 'bird-flutter-style';
        flutterStyle.textContent = `
            @keyframes flutter {
                0%, 100% {
                    transform: scaleY(1);
                }
                50% {
                    transform: scaleY(0.6);
                }
            }
        `;
        document.head.appendChild(flutterStyle);
    }

    // Animace létání
    const duration = 8 + Math.random() * 4; // 8-12 sekund
    const keyframes = `
        @keyframes fly-${Math.random().toString(36).substr(2, 9)} {
            0% {
                left: -100px;
                opacity: 0;
            }
            5% {
                opacity: 1;
            }
            95% {
                opacity: 1;
            }
            100% {
                left: calc(100vw + 100px);
                opacity: 0;
            }
        }
    `;

    const animationName = `fly-${Math.random().toString(36).substr(2, 9)}`;
    bird.style.animation = `${animationName} ${duration}s linear forwards`;

    // Přidat keyframes do head
    const style = document.createElement('style');
    style.textContent = keyframes.replace(/fly-[a-z0-9]+/g, animationName);
    document.head.appendChild(style);

    // Odstranit pták po animaci
    setTimeout(() => {
        bird.remove();
    }, duration * 1000);
}

// naplanuje dalsiho ptaka aby proletel za 5-20 sekund
function scheduleNextBird() {
    const randomDelay = 5000 + Math.random() * 15000; // 5-20 sekund
    setTimeout(() => {
        createFlyingBird();
        scheduleNextBird(); // Naplánovat dalšího ptáka
    }, randomDelay);
}

// Spustit prvního ptáka po 3 sekundách
setTimeout(() => {
    createFlyingBird();
    scheduleNextBird();
}, 3000);