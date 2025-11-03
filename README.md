# 🎓 Digitaler Kompetenzpass

Ein einfaches Web-Tool für Schülerinnen und Schüler zur Selbsteinschätzung ihrer digitalen Kompetenzen.

## 🚀 Schnellstart mit GitHub Pages

### Schritt 1: Repository erstellen
1. Gehe zu [GitHub.com](https://github.com)
2. Klicke auf das **+** Symbol oben rechts → **New repository**
3. Name: `kompetenzpass`
4. Beschreibung: "Digitaler Kompetenzpass für Informatische Bildung"
5. **Public** auswählen (wichtig für GitHub Pages!)
6. Klicke auf **Create repository**

### Schritt 2: Dateien hochladen
1. Klicke auf **uploading an existing file**
2. Ziehe alle 4 Dateien in das Upload-Fenster:
   - `index.html`
   - `style.css`
   - `app.js`
   - `README.md`
3. Commit message: "Erste Version des Kompetenzpasses"
4. Klicke auf **Commit changes**

### Schritt 3: GitHub Pages aktivieren
1. Gehe zu **Settings** (im Repository)
2. Scrolle zu **Pages** (linkes Menü)
3. Source: **Deploy from a branch**
4. Branch: **main** / **root**
5. Klicke auf **Save**

### Schritt 4: Zugriff auf die App
Nach 2-3 Minuten ist deine App online unter:
```
https://[dein-github-username].github.io/kompetenzpass
```

## 📱 Features

- ✅ Einfache Anmeldung mit Namen
- ⭐ Sterne-Bewertung (1-5) für 6 Kompetenzbereiche
- 📊 Automatische Fortschrittsanzeige
- 💾 Lokale Speicherung im Browser
- 📄 Export-Funktion als Textdatei
- 📱 Responsive Design (funktioniert auf Tablets/Handys)

## 🎯 Kompetenzbereiche

1. **Programmieren** - Grundlagen der Programmierung
2. **Textverarbeitung** - Dokumente erstellen und formatieren
3. **Internet-Recherche** - Informationen finden und bewerten
4. **Digitale Medien** - Bilder und Videos bearbeiten
5. **Digitale Sicherheit** - Sicher im Internet unterwegs
6. **Tabellenkalkulation** - Mit Daten und Formeln arbeiten

## 🔧 Anpassungen

### Kompetenzen ändern
Bearbeite in `app.js` das Array `competencies`:
```javascript
const competencies = [
    { 
        id: 1, 
        name: "👨‍💻 Dein Bereich", 
        description: "Deine Beschreibung"
    },
    // weitere Bereiche...
];
```

### Farben ändern
In `style.css` die Hauptfarben anpassen:
```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🚀 Nächste Schritte / Erweiterungen

- [ ] PDF-Export hinzufügen
- [ ] Lehrkräfte-Ansicht mit Passwortschutz
- [ ] Detailseiten für jede Kompetenz
- [ ] Badge-System bei erreichten Zielen
- [ ] Datenbank-Anbindung für zentrale Speicherung
- [ ] Zertifikat-Generierung

## 📝 Lizenz

Frei verwendbar für Bildungszwecke. Gerne anpassen und weiterverwenden!

## 🤝 Mitwirken

Verbesserungsvorschläge sind willkommen! Erstelle einfach ein Issue oder einen Pull Request.

---

**Entwickelt für den Unterricht in Informatischer Bildung**