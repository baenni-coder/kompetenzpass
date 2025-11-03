// Kompetenzbereiche definieren - angepasst an Schweizer Lehrplan 21
const competencies = [
    { 
        id: 1, 
        name: "👨‍💻 Programmieren", 
        description: "Grundlagen der Programmierung verstehen und anwenden",
        subskills: ["Scratch", "Python", "HTML/CSS"]
    },
    { 
        id: 2, 
        name: "📝 Textverarbeitung", 
        description: "Dokumente erstellen, formatieren und gestalten",
        subskills: ["Word", "Google Docs", "Formatierung"]
    },
    { 
        id: 3, 
        name: "🔍 Internet-Recherche", 
        description: "Informationen finden, bewerten und nutzen",
        subskills: ["Suchmaschinen", "Quellenkritik", "Urheberrecht"]
    },
    { 
        id: 4, 
        name: "🎨 Digitale Medien", 
        description: "Bilder, Audio und Videos bearbeiten",
        subskills: ["Bildbearbeitung", "Videoschnitt", "Präsentationen"]
    },
    { 
        id: 5, 
        name: "🔐 Digitale Sicherheit", 
        description: "Sicher und verantwortungsvoll im Internet",
        subskills: ["Passwörter", "Privatsphäre", "Cybermobbing"]
    },
    { 
        id: 6, 
        name: "📊 Tabellenkalkulation", 
        description: "Mit Daten, Formeln und Diagrammen arbeiten",
        subskills: ["Excel", "Google Sheets", "Diagramme"]
    }
];

// Globale Variablen
let currentUser = null;
let userRatings = {};

// Beim Laden der Seite
window.onload = function() {
    // Prüfen ob bereits eingeloggt
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = savedUser;
        loadUserData();
        showMainArea();
    }
    
    // Enter-Taste für Login
    document.getElementById('username').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
};

function login() {
    const username = document.getElementById('username').value.trim();
    
    if (username === '') {
        showNotification('Bitte gib deinen Namen ein!', 'error');
        return;
    }
    
    currentUser = username;
    localStorage.setItem('currentUser', username);
    loadUserData();
    showMainArea();
    showNotification(`Willkommen zurück, ${username}!`, 'success');
}

function logout() {
    if (confirm('Möchtest du dich wirklich ausloggen? Dein Fortschritt wurde gespeichert.')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        document.getElementById('loginArea').classList.remove('hidden');
        document.getElementById('mainArea').classList.add('hidden');
        document.getElementById('username').value = '';
    }
}

function showMainArea() {
    document.getElementById('loginArea').classList.add('hidden');
    document.getElementById('mainArea').classList.remove('hidden');
    document.getElementById('welcomeMessage').innerHTML = 
        `Hallo <strong>${currentUser}</strong>! Bewerte deine digitalen Kompetenzen mit 1-5 Sternen.`;
    
    renderCompetencies();
    updateOverallProgress();
}

function loadUserData() {
    const saved = localStorage.getItem(`ratings_${currentUser}`);
    if (saved) {
        userRatings = JSON.parse(saved);
    } else {
        userRatings = {};
    }
}

function renderCompetencies() {
    const container = document.getElementById('competencies');
    container.innerHTML = '';
    
    // Gesamtfortschritt anzeigen
    const overallDiv = document.createElement('div');
    overallDiv.className = 'overall-progress';
    overallDiv.innerHTML = `
        <h3>📈 Gesamtfortschritt</h3>
        <div class="big-progress-bar">
            <div class="big-progress-fill" id="overallProgressFill">
                <span class="progress-text" id="overallProgressText">0%</span>
            </div>
        </div>
    `;
    container.appendChild(overallDiv);
    
    // Einzelne Kompetenzen
    competencies.forEach(comp => {
        const rating = userRatings[comp.id] || 0;
        
        const card = document.createElement('div');
        card.className = 'competency-card';
        
        card.innerHTML = `
            <div class="competency-header">
                <div class="competency-info">
                    <div class="competency-title">${comp.name}</div>
                    <div class="competency-description">${comp.description}</div>
                </div>
                <div class="stars" data-competency="${comp.id}">
                    ${createStars(comp.id, rating)}
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${rating * 20}%"></div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Event Listener für Sterne hinzufügen
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', function() {
            const competencyId = parseInt(this.parentElement.dataset.competency);
            const rating = parseInt(this.dataset.rating);
            updateRating(competencyId, rating);
        });
        
        // Hover-Effekt für alle Sterne bis zum gehover-ten
        star.addEventListener('mouseenter', function() {
            const stars = this.parentElement.querySelectorAll('.star');
            const rating = parseInt(this.dataset.rating);
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.style.color = '#ffd700';
                } else {
                    s.style.color = '#ddd';
                }
            });
        });
        
        star.addEventListener('mouseleave', function() {
            const competencyId = parseInt(this.parentElement.dataset.competency);
            const currentRating = userRatings[competencyId] || 0;
            const stars = this.parentElement.querySelectorAll('.star');
            stars.forEach((s, index) => {
                if (index < currentRating) {
                    s.classList.add('filled');
                } else {
                    s.classList.remove('filled');
                }
            });
        });
    });
}

function createStars(competencyId, currentRating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= currentRating ? 'filled' : '';
        starsHTML += `<span class="star ${filled}" data-rating="${i}">★</span>`;
    }
    return starsHTML;
}

function updateRating(competencyId, rating) {
    const oldRating = userRatings[competencyId] || 0;
    userRatings[competencyId] = rating;
    
    // Animation für Änderung
    if (rating > oldRating) {
        showNotification('Super! Du hast dich verbessert! 🎉', 'success');
    }
    
    renderCompetencies();
    updateOverallProgress();
    
    // Automatisch speichern
    saveProgress(false);
}

function updateOverallProgress() {
    const totalPossible = competencies.length * 5;
    const currentTotal = Object.values(userRatings).reduce((sum, rating) => sum + rating, 0);
    const percentage = Math.round((currentTotal / totalPossible) * 100);
    
    setTimeout(() => {
        const fillElement = document.getElementById('overallProgressFill');
        const textElement = document.getElementById('overallProgressText');
        if (fillElement && textElement) {
            fillElement.style.width = `${percentage}%`;
            textElement.textContent = `${percentage}%`;
            
            // Spezielle Nachrichten bei Meilensteinen
            if (percentage === 100) {
                showNotification('🏆 Wow! Du hast alle Kompetenzen gemeistert!', 'success');
            } else if (percentage >= 80 && percentage < 100) {
                showNotification('🌟 Fantastisch! Du bist fast am Ziel!', 'success');
            } else if (percentage >= 50 && percentage < 55) {
                showNotification('💪 Halbzeit! Weiter so!', 'success');
            }
        }
    }, 100);
}

function saveProgress(showFeedback = true) {
    localStorage.setItem(`ratings_${currentUser}`, JSON.stringify(userRatings));
    
    if (showFeedback) {
        showNotification('✅ Fortschritt gespeichert!', 'success');
        
        // Button Animation
        const button = event.target;
        button.style.background = '#48bb78';
        button.textContent = '✓ Gespeichert!';
        
        setTimeout(() => {
            button.textContent = '💾 Fortschritt speichern';
            button.style.background = '#667eea';
        }, 2000);
    }
}

function exportProgress() {
    // Einfache Text-Export Funktion (später können wir PDF hinzufügen)
    let exportText = `DIGITALER KOMPETENZPASS\n`;
    exportText += `========================\n\n`;
    exportText += `Name: ${currentUser}\n`;
    exportText += `Datum: ${new Date().toLocaleDateString('de-CH')}\n\n`;
    exportText += `BEWERTUNGEN:\n`;
    exportText += `------------\n\n`;
    
    competencies.forEach(comp => {
        const rating = userRatings[comp.id] || 0;
        const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        exportText += `${comp.name.replace(/[^\w\s]/gi, '')}: ${stars} (${rating}/5)\n`;
        exportText += `  ${comp.description}\n\n`;
    });
    
    const totalPossible = competencies.length * 5;
    const currentTotal = Object.values(userRatings).reduce((sum, rating) => sum + rating, 0);
    const percentage = Math.round((currentTotal / totalPossible) * 100);
    
    exportText += `\nGESAMTFORTSCHRITT: ${percentage}%\n`;
    exportText += `========================\n`;
    
    // Als Datei herunterladen
    const blob = new Blob([exportText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kompetenzpass_${currentUser}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('📄 Kompetenzpass wurde exportiert!', 'success');
}

// Hilfsfunktion für Benachrichtigungen
function showNotification(message, type = 'info') {
    // Erstelle Notification-Element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#f56565' : '#667eea'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    // CSS für Animation hinzufügen
    if (!document.querySelector('#notificationStyles')) {
        const style = document.createElement('style');
        style.id = 'notificationStyles';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Automatisch entfernen nach 3 Sekunden
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}