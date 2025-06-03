# Ping Pong Electron

## English

A classic 2-player Ping Pong game built with Electron, rendered entirely with JavaScript on canvas using the "PressStart" font.  
- Full game logic with scoring  
- Keyboard controls: Player 1 (W/S), Player 2 (Arrow Up/Down)  
- 3-second countdown before game starts  
- 10 point win condition with animated end screen and field destruction effect  
- Integrated 8-bit style sounds generated programmatically  
- Background music with smooth crossfade between menu and gameplay  
- Fullscreen by default, shows title bar when windowed  
- Menu with start button and instructions (in German)  
- Copyright message in menu  

## Installation (Run from Source)

1. Clone the repo  
2. Run `npm install`  
3. Run `npm start`  

## Controls

- Player 1: W (up), S (down)  
- Player 2: Arrow Up (up), Arrow Down (down)  
- Start game: Press "Spiel Starten" button or hold W + Arrow Up together  

## Compile to Standalone EXE

To build a **standalone `.exe`** (no installer, no other files required):

1. Make sure `electron-builder` is installed:
   ```bash
   npm install --save-dev electron-builder

    Update your package.json with a build section like this:

"build": {
  "appId": "com.example.pingpong",
  "productName": "pingpongv1",
  "win": {
    "target": "portable"
  },
  "directories": {
    "output": "C:/Users/JoJo/Documents/Code/Ping Pong/exe"
  }
}

Add a build script:

"scripts": {
  "start": "electron .",
  "build": "electron-builder"
}

Run the build:

    npm run build

This will generate a single pingpongv1.exe file in:

C:\Users\JoJo\Documents\Code\Ping Pong\exe

No installer or extra files required — just the .exe.
Future

Will support sticks controllers for players, translating movements to buttons.
Deutsch

Ein klassisches 2-Spieler Ping Pong Spiel, erstellt mit Electron, komplett in JavaScript auf Canvas gerendert und mit der Schriftart "PressStart".

    Vollständige Spiellogik mit Punktestand

    Tastatursteuerung: Spieler 1 (W/S), Spieler 2 (Pfeil hoch/runter)

    3 Sekunden Countdown vor Spielstart

    Sieg bei 10 Punkten, mit animiertem Endbildschirm und "Zerstörung" des Spielfelds

    8-Bit Sounds direkt per Code generiert

    Hintergrundmusik mit sanftem Crossfade zwischen Menü und Spiel

    Standardmäßig Vollbild, Titelleiste im Fenstermodus sichtbar

    Menü mit Startknopf und Anweisungen (auf Deutsch)

    Copyright-Hinweis im Menü

Installation (Ausführen aus dem Quellcode)

    Repo klonen

    npm install ausführen

    npm start starten

Steuerung

    Spieler 1: W (hoch), S (runter)

    Spieler 2: Pfeil hoch (hoch), Pfeil runter (runter)

    Spiel starten: Klick auf "Spiel Starten" oder W + Pfeil hoch gleichzeitig drücken

Kompilieren zu einer Standalone-EXE

Um eine eigenständige .exe-Datei zu erzeugen (ohne Installer, ohne weitere Dateien):

    Stelle sicher, dass electron-builder installiert ist:

npm install --save-dev electron-builder

Füge dies in dein package.json ein:

"build": {
  "appId": "com.example.pingpong",
  "productName": "pingpongv1",
  "win": {
    "target": "portable"
  },
  "directories": {
    "output": "C:/Users/JoJo/Documents/Code/Ping Pong/exe"
  }
}

Baue das Spiel:

    npm run build

Ergebnis: eine einzige pingpongv1.exe im Ordner:

C:\Users\JoJo\Documents\Code\Ping Pong\exe

License

MIT License
