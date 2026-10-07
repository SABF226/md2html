const { app, BrowserWindow } = require("electron");
const path = require("path");
const fs = require("fs");

const OK_EXT = /\.(md|markdown|mdown|txt)$/i;
const MAX_BYTES = 5 * 1024 * 1024;
let win = null;

// Fichier passé en argument (ex. double-clic depuis le gestionnaire de fichiers)
const fileFromArgv = (argv) =>
  argv.slice(app.isPackaged ? 1 : 2).find((a) => OK_EXT.test(a) && fs.existsSync(a));

function sendFile(file) {
  try {
    if (!file || !win || fs.statSync(file).size > MAX_BYTES) return;
    win.webContents.send("open-file", { name: path.basename(file), text: fs.readFileSync(file, "utf8") });
  } catch { /* fichier illisible : on ignore */ }
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 480,
    minHeight: 480,
    title: "md2html",
    icon: path.join(__dirname, "build", "icon.png"),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.removeMenu();
  win.loadFile("index.html");

  // L'app ne navigue jamais ailleurs et n'ouvre aucune fenêtre
  win.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  win.webContents.on("will-navigate", (e) => e.preventDefault());

  // Confirmation de fin de téléchargement renvoyée à la page (boîte « Enregistrer sous » native)
  win.webContents.session.on("will-download", (_e, item) => {
    item.once("done", (_ev, state) => {
      const name = path.basename(item.getSavePath() || item.getFilename());
      if (win) win.webContents.send("download-done", { name, state });
    });
  });

  const initial = fileFromArgv(process.argv);
  win.webContents.once("did-finish-load", () => sendFile(initial));
  win.on("closed", () => { win = null; });
}

// Une seule instance : un second lancement avec un fichier l'ouvre dans la fenêtre existante
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", (_e, argv) => {
    if (!win) return;
    if (win.isMinimized()) win.restore();
    win.focus();
    sendFile(fileFromArgv(argv));
  });
  app.whenReady().then(createWindow);
  app.on("window-all-closed", () => app.quit());
}
