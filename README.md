# md2html (bureau, Linux)

Convertisseur Markdown → HTML : glisser-déposer de fichiers `.md`, aperçu en direct, export `.html` ou `.zip`.

## Lancer en développement
```bash
npm install
npm start
```

## Générer les paquets Linux
```bash
npm run dist
```
Résultat dans `dist/` : un `.AppImage` (portable) et un `.deb`.

- AppImage : `chmod +x dist/md2html-*.AppImage && ./dist/md2html-*.AppImage`
- Debian/Ubuntu : `sudo apt install ./dist/md2html_*.deb`

## Ouvrir un fichier depuis le terminal ou le gestionnaire de fichiers
```bash
npm start -- notes.md        # en développement
md2html notes.md             # après installation du .deb
```
Si l'app est déjà ouverte, le fichier s'ajoute dans un nouvel onglet.

## À personnaliser
- `package.json` : `author`, `maintainer` (adresse e-mail), `appId`, `version`.
- `build/icon.png` : icône 512×512.
- `index.html` : interface complète (convertisseur intégré, polices dans `fonts/`).

## Structure
```
main.js       processus principal (fenêtre, fichiers ouverts, téléchargements)
preload.js    pont sécurisé vers la page (contextIsolation activé)
index.html    interface + convertisseur Markdown
fonts/        Instrument Sans et JetBrains Mono (hors ligne)
build/        icône
```
