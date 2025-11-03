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
    // jsPDF verwenden für echten PDF-Export
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Farben definieren
    const primaryColor = [102, 126, 234]; // RGB für #667eea
    const goldColor = [255, 215, 0]; // Gold für Sterne
    const grayColor = [200, 200, 200]; // Grau für leere Sterne
    
    // Titel und Header
    doc.setFontSize(24);
    doc.setTextColor(...primaryColor);
    doc.text('DIGITALER KOMPETENZPASS', 105, 25, { align: 'center' });
    
    // Linie unter Titel
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(1);
    doc.line(20, 32, 190, 32);
    
    // Persönliche Informationen
    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Name: ${currentUser}`, 20, 45);
    doc.text(`Datum: ${new Date().toLocaleDateString('de-CH')}`, 20, 52);
    doc.text(`Schule: _______________________`, 20, 59);
    
    // Gesamtfortschritt berechnen
    const totalPossible = competencies.length * 5;
    const currentTotal = Object.values(userRatings).reduce((sum, rating) => sum + rating, 0);
    const percentage = Math.round((currentTotal / totalPossible) * 100);
    
    // Gesamtfortschritt Box
    doc.setFillColor(240, 244, 255);
    doc.roundedRect(20, 70, 170, 25, 3, 3, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(...primaryColor);
    doc.text('GESAMTFORTSCHRITT', 105, 80, { align: 'center' });
    
    // Fortschrittsbalken
    doc.setFillColor(230, 230, 230);
    doc.roundedRect(25, 85, 160, 6, 2, 2, 'F');
    
    // Gefüllter Teil des Fortschrittsbalkens
    if (percentage > 0) {
        doc.setFillColor(72, 187, 120); // Grün
        doc.roundedRect(25, 85, 160 * (percentage / 100), 6, 2, 2, 'F');
    }
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`${percentage}%`, 105, 89, { align: 'center' });
    
    // Kompetenzen Überschrift
    doc.setFontSize(16);
    doc.setTextColor(...primaryColor);
    doc.text('BEWERTUNGEN', 20, 110);
    
    // Kompetenzen einzeln
    let yPosition = 120;
    
    competencies.forEach((comp, index) => {
        const rating = userRatings[comp.id] || 0;
        
        // Prüfen ob Platz auf Seite, sonst neue Seite
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 30;
        }
        
        // Kompetenz-Box
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(20, yPosition, 170, 28, 3, 3, 'F');
        
        // Icon und Titel (ohne Emoji, da PDFs damit Probleme haben)
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont(undefined, 'bold');
        const cleanName = comp.name.replace(/[^\w\s]/gi, '').trim();
        doc.text(cleanName, 25, yPosition + 8);
        
        // Beschreibung
        doc.setFont(undefined, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(comp.description, 25, yPosition + 14);
        
        // Sterne zeichnen
        const starX = 25;
        const starY = yPosition + 20;
        doc.setFontSize(14);
        
        for (let i = 0; i < 5; i++) {
            if (i < rating) {
                doc.setTextColor(...goldColor);
                doc.text('★', starX + (i * 8), starY);
            } else {
                doc.setTextColor(...grayColor);
                doc.text('☆', starX + (i * 8), starY);
            }
        }
        
        // Bewertungstext
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`${rating}/5`, 70, starY);
        
        // Fortschrittsbalken mini
        doc.setFillColor(230, 230, 230);
        doc.rect(100, starY - 4, 80, 3, 'F');
        
        if (rating > 0) {
            doc.setFillColor(...primaryColor);
            doc.rect(100, starY - 4, 80 * (rating / 5), 3, 'F');
        }
        
        yPosition += 35;
    });
    
    // Unterschrift-Bereich
    if (yPosition > 220) {
        doc.addPage();
        yPosition = 30;
    }
    
    yPosition += 10;
    doc.setDrawColor(150, 150, 150);
    doc.line(20, yPosition + 20, 90, yPosition + 20);
    doc.line(120, yPosition + 20, 190, yPosition + 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Unterschrift Schüler/in', 55, yPosition + 28, { align: 'center' });
    doc.text('Unterschrift Lehrperson', 155, yPosition + 28, { align: 'center' });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Digitaler Kompetenzpass - Informatische Bildung', 105, 285, { align: 'center' });
    
    // PDF speichern
    const filename = `Kompetenzpass_${currentUser}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    showNotification('📄 PDF wurde erfolgreich erstellt!', 'success');
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