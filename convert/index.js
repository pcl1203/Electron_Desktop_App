const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');
const _ = require("lodash");

const { app, BrowserWindow, ipcMain, shell } = electron;

let mainWindow;

app.on('ready', () => {

    mainWindow = new BrowserWindow(
        {
            height: 600,
            width: 800,
            title: 'Converter',
            webPreferences: { 
              backgroundThrottling: false, // running full speed even at background
              nodeIntegration: true,
              contextIsolation: false
            }
        }
    );

    mainWindow.loadURL(`file://${__dirname}/src/index.html`);
});

ipcMain.on('video:added', (event, videos) => {
    const promises =_.map (videos, video => {
        return new Promise((resolve, reject) => {

            ffmpeg.ffprobe(video.path, (err, metadata) => {// install ffmpeg
                
                video.duration = 3;//metadata.format.duration;
                video.format = 'avi';
                resolve(video);
            
                });
            });
        });

    Promise.all(promises)
    .then((results) => {
        mainWindow.webContents.send('metadata:complete', results);
    });
});


ipcMain.on('conversion:start', (event, videos) => {
    _.each(videos, video => {
        const outputDir = video.path.split(video.name)[0];
        const outputName = video.path.split('.')[0];
        const outputPath = `${outputDir}${outputName}.${video.format}`;
        ffmpeg(video.path)// install ffmpeg
            .output(outputPath)
            .on('progress', ({timemark}) => mainWindow.webContents.send('conversion:progress', {video, timemark}))
            .on('end', () => mainWindow.webContents.send('conversion:end', {video, outputPath}))
            .run();
    });
});

ipcMain.on('folder:open', (event, outputPath) => {
    shell.showItemInFolder(outputPath);
});

