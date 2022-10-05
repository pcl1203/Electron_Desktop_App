const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

const { app, BrowserWindow, ipcMain } = electron;
let mainWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          }
    });
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (event, path) => {
    // mainWindow.webContents.send('video:metadata', 3); /// sample data
    ffmpeg.ffprobe(path, (err, metadata) =>{     // install ffmpeg by >brew install ffmpeg
         
        mainWindow.webContents.send('video:metadata', metadata.format.duration);
    });
});
