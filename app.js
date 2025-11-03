// Standard-Kompetenzen als Backup
const defaultCompetencies = [
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

// Kompetenzen laden (entweder custom oder default)
let competencies = [];
function loadCompetencies() {
    const saved = localStorage.getItem('customCompetencies');
    if (saved) {
        competencies = JSON.parse(saved);
    } else {
        competencies = [...defaultCompetencies];
    }
}

// Globale Variablen
let currentUser = null;
let userRatings = {};

// Beim Laden der Seite
window.onload = function() {
    // Kompetenzen laden
    loadCompetencies();
    
    // Prüfen ob bereits eingeloggt
    const savedUser = localStorage.getItem('currentUser');
    const isTeacher = localStorage.getItem('isTeacher') === 'true';
    
    if (isTeacher) {
        showTeacherDashboard();
    } else if (savedUser) {
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
    
    document.getElementById('teacherPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginTeacher();
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

// ============= LEHRER-FUNKTIONEN =============

// Standard-Passwort (kann geändert werden)
const DEFAULT_TEACHER_PASSWORD = 'admin123';

// Login-Ansichten wechseln
function showTeacherLogin() {
    document.querySelector('.login-box').classList.add('hidden');
    document.getElementById('teacherLoginBox').classList.remove('hidden');
    document.getElementById('teacherPassword').focus();
}

function showStudentLogin() {
    document.getElementById('teacherLoginBox').classList.add('hidden');
    document.querySelector('.login-box').classList.remove('hidden');
    document.getElementById('username').focus();
}

// Lehrer Login
function loginTeacher() {
    const password = document.getElementById('teacherPassword').value;
    const savedPassword = localStorage.getItem('teacherPassword') || DEFAULT_TEACHER_PASSWORD;
    
    if (password === savedPassword) {
        localStorage.setItem('isTeacher', 'true');
        showTeacherDashboard();
        showNotification('Willkommen im Lehrer-Dashboard!', 'success');
    } else {
        showNotification('Falsches Passwort!', 'error');
        document.getElementById('teacherPassword').value = '';
    }
}

// Lehrer Dashboard anzeigen
function showTeacherDashboard() {
    document.getElementById('loginArea').classList.add('hidden');
    document.getElementById('mainArea').classList.add('hidden');
    document.getElementById('teacherArea').classList.remove('hidden');
    
    loadCompetencyManager();
    loadStudentsOverview();
}

// Lehrer abmelden
function logoutTeacher() {
    if (confirm('Möchtest du dich wirklich abmelden?')) {
        localStorage.removeItem('isTeacher');
        document.getElementById('teacherArea').classList.add('hidden');
        document.getElementById('loginArea').classList.remove('hidden');
        document.getElementById('teacherPassword').value = '';
        showStudentLogin();
    }
}

// Tab-Wechsel
function switchTab(tabId) {
    // Alle Tabs verstecken
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    // Alle Tab-Buttons deaktivieren
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Gewählten Tab anzeigen
    document.getElementById(tabId).classList.remove('hidden');
    
    // Aktiven Button markieren
    event.target.classList.add('active');
    
    // Inhalt laden je nach Tab
    if (tabId === 'students-tab') {
        loadStudentsOverview();
    }
}

// ============= KOMPETENZEN VERWALTEN =============

// Kompetenzen-Manager laden
function loadCompetencyManager() {
    const container = document.getElementById('competencyList');
    container.innerHTML = '';
    
    competencies.forEach((comp, index) => {
        const item = document.createElement('div');
        item.className = 'competency-item';
        item.id = `comp-item-${comp.id}`;
        
        item.innerHTML = `
            <div class="competency-content">
                <div class="competency-name">${comp.name}</div>
                <div class="competency-desc">${comp.description}</div>
            </div>
            <div class="competency-actions">
                <button class="btn-icon" onclick="editCompetency(${comp.id})" title="Bearbeiten">
                    ✏️
                </button>
                <button class="btn-icon delete" onclick="deleteCompetency(${comp.id})" title="Löschen">
                    🗑️
                </button>
            </div>
        `;
        
        container.appendChild(item);
    });
}

// Neue Kompetenz hinzufügen
function addNewCompetency() {
    const newId = Math.max(...competencies.map(c => c.id), 0) + 1;
    const newCompetency = {
        id: newId,
        name: "📚 Neue Kompetenz",
        description: "Beschreibung hier eingeben",
        subskills: []
    };
    
    competencies.push(newCompetency);
    saveCompetencies();
    loadCompetencyManager();
    
    // Direkt in Bearbeitungsmodus
    setTimeout(() => editCompetency(newId), 100);
    
    showNotification('Neue Kompetenz hinzugefügt!', 'success');
}

// Kompetenz bearbeiten
function editCompetency(id) {
    const comp = competencies.find(c => c.id === id);
    const item = document.getElementById(`comp-item-${id}`);
    
    item.classList.add('editing');
    item.innerHTML = `
        <div class="edit-form">
            <input type="text" id="edit-name-${id}" value="${comp.name}" placeholder="Name (mit Emoji)">
            <input type="text" id="edit-desc-${id}" value="${comp.description}" placeholder="Beschreibung">
            <div class="edit-form-buttons">
                <button onclick="saveCompetencyEdit(${id})" class="btn-add">💾 Speichern</button>
                <button onclick="cancelEdit(${id})" class="secondary">❌ Abbrechen</button>
            </div>
        </div>
    `;
    
    document.getElementById(`edit-name-${id}`).focus();
}

// Bearbeitung speichern
function saveCompetencyEdit(id) {
    const comp = competencies.find(c => c.id === id);
    const newName = document.getElementById(`edit-name-${id}`).value.trim();
    const newDesc = document.getElementById(`edit-desc-${id}`).value.trim();
    
    if (newName === '' || newDesc === '') {
        showNotification('Bitte alle Felder ausfüllen!', 'error');
        return;
    }
    
    comp.name = newName;
    comp.description = newDesc;
    
    saveCompetencies();
    loadCompetencyManager();
    showNotification('Kompetenz aktualisiert!', 'success');
}

// Bearbeitung abbrechen
function cancelEdit(id) {
    loadCompetencyManager();
}

// Kompetenz löschen
function deleteCompetency(id) {
    if (competencies.length <= 1) {
        showNotification('Mindestens eine Kompetenz muss vorhanden sein!', 'error');
        return;
    }
    
    if (confirm('Diese Kompetenz wirklich löschen? Alle Schülerbewertungen für diese Kompetenz gehen verloren!')) {
        competencies = competencies.filter(c => c.id !== id);
        saveCompetencies();
        loadCompetencyManager();
        
        // Lösche auch alle Bewertungen für diese Kompetenz
        cleanupRatings(id);
        
        showNotification('Kompetenz gelöscht!', 'success');
    }
}

// Auf Standard zurücksetzen
function resetToDefaults() {
    if (confirm('Alle Kompetenzen auf Standard zurücksetzen? Deine Anpassungen gehen verloren!')) {
        competencies = [...defaultCompetencies];
        saveCompetencies();
        loadCompetencyManager();
        showNotification('Kompetenzen zurückgesetzt!', 'success');
    }
}

// Kompetenzen speichern
function saveCompetencies() {
    localStorage.setItem('customCompetencies', JSON.stringify(competencies));
}

// Bewertungen aufräumen nach Löschen
function cleanupRatings(competencyId) {
    // Hole alle Schüler
    const allStudents = getAllStudents();
    
    allStudents.forEach(student => {
        const ratingsKey = `ratings_${student}`;
        const ratings = JSON.parse(localStorage.getItem(ratingsKey) || '{}');
        delete ratings[competencyId];
        localStorage.setItem(ratingsKey, JSON.stringify(ratings));
    });
}

// ============= SCHÜLERÜBERSICHT =============

// Alle Schüler abrufen
function getAllStudents() {
    const students = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('ratings_')) {
            students.push(key.replace('ratings_', ''));
        }
    }
    return students;
}

// Schülerübersicht laden
function loadStudentsOverview() {
    const students = getAllStudents();
    const container = document.getElementById('studentsList');
    container.innerHTML = '';
    
    if (students.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Noch keine Schüler haben sich angemeldet.</p>';
        document.getElementById('totalStudents').textContent = '0';
        document.getElementById('avgProgress').textContent = '0%';
        return;
    }
    
    let totalProgress = 0;
    
    students.forEach(studentName => {
        const ratings = JSON.parse(localStorage.getItem(`ratings_${studentName}`) || '{}');
        const progress = calculateStudentProgress(ratings);
        totalProgress += progress;
        
        const card = document.createElement('div');
        card.className = 'student-card';
        card.onclick = () => viewStudentDetails(studentName);
        
        card.innerHTML = `
            <div class="student-name">${studentName}</div>
            <div class="student-info">Bewertete Kompetenzen: ${Object.keys(ratings).length}/${competencies.length}</div>
            <div class="student-info">Letzter Zugriff: ${getLastAccess(studentName)}</div>
            <div class="student-progress">
                <div class="mini-progress-bar">
                    <div class="mini-progress-fill" style="width: ${progress}%"></div>
                </div>
                <div style="text-align: center; margin-top: 5px; font-size: 12px; color: #666;">${progress}%</div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Statistiken aktualisieren
    document.getElementById('totalStudents').textContent = students.length;
    document.getElementById('avgProgress').textContent = Math.round(totalProgress / students.length) + '%';
}

// Schülerfortschritt berechnen
function calculateStudentProgress(ratings) {
    const totalPossible = competencies.length * 5;
    const currentTotal = Object.values(ratings).reduce((sum, rating) => sum + rating, 0);
    return Math.round((currentTotal / totalPossible) * 100);
}

// Letzter Zugriff (simuliert)
function getLastAccess(studentName) {
    const lastAccess = localStorage.getItem(`lastAccess_${studentName}`);
    if (lastAccess) {
        return new Date(lastAccess).toLocaleDateString('de-CH');
    }
    return 'Unbekannt';
}

// Schülerdetails anzeigen
function viewStudentDetails(studentName) {
    alert(`Detailansicht für ${studentName} wird in der nächsten Version verfügbar sein!`);
    // Hier könnte man später eine detaillierte Ansicht implementieren
}

// Schüler filtern
function filterStudents() {
    const searchTerm = document.getElementById('studentSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.student-card');
    
    cards.forEach(card => {
        const name = card.querySelector('.student-name').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============= EINSTELLUNGEN =============

// Passwort ändern
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (newPassword === '' || confirmPassword === '') {
        showNotification('Bitte beide Passwortfelder ausfüllen!', 'error');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwörter stimmen nicht überein!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Passwort muss mindestens 6 Zeichen lang sein!', 'error');
        return;
    }
    
    localStorage.setItem('teacherPassword', newPassword);
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    showNotification('Passwort erfolgreich geändert!', 'success');
}

// Alle Daten exportieren (CSV)
function exportAllData() {
    const students = getAllStudents();
    
    if (students.length === 0) {
        showNotification('Keine Schülerdaten vorhanden!', 'error');
        return;
    }
    
    let csv = 'Schülername';
    competencies.forEach(comp => {
        csv += `,${comp.name.replace(/[^\w\s]/gi, '')}`;
    });
    csv += ',Gesamtfortschritt\n';
    
    students.forEach(studentName => {
        const ratings = JSON.parse(localStorage.getItem(`ratings_${studentName}`) || '{}');
        csv += studentName;
        
        competencies.forEach(comp => {
            const rating = ratings[comp.id] || 0;
            csv += `,${rating}`;
        });
        
        const progress = calculateStudentProgress(ratings);
        csv += `,${progress}%\n`;
    });
    
    // CSV herunterladen
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Kompetenzpass_Klasse_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    showNotification('Daten exportiert!', 'success');
}

// Klassenbericht als PDF
function exportClassReport() {
    showNotification('PDF-Klassenbericht wird in der nächsten Version verfügbar sein!', 'info');
    // Hier könnte man später einen detaillierten PDF-Bericht implementieren
}

// Schülerdaten löschen
function clearStudentData() {
    if (confirm('ACHTUNG: Alle Schülerdaten werden unwiderruflich gelöscht! Wirklich fortfahren?')) {
        if (confirm('Bist du dir wirklich sicher? Diese Aktion kann nicht rückgängig gemacht werden!')) {
            const students = getAllStudents();
            students.forEach(student => {
                localStorage.removeItem(`ratings_${student}`);
                localStorage.removeItem(`lastAccess_${student}`);
            });
            
            loadStudentsOverview();
            showNotification('Alle Schülerdaten wurden gelöscht!', 'success');
        }
    }
}

// Beim Login Zeitstempel speichern (für letzten Zugriff)
const originalLogin = login;
login = function() {
    originalLogin();
    if (currentUser) {
        localStorage.setItem(`lastAccess_${currentUser}`, new Date().toISOString());
    }
};