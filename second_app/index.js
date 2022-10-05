const electron = require('electron');

const { app, BrowserWindow, ipcMain, Menu } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          }
    });
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    // Close all windows including todos windows
    mainWindow.on('closed', () => app.quit());

    // Add menu
    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);

});

function createAddWindow() {
    addWindow = new BrowserWindow({
        height: 200,
        width: 300,
        title: 'Add New Todo',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
          }
    });

    addWindow.loadURL(`file://${__dirname}/add.html`);
    addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
    mainWindow.webContents.send('todo:add', todo);
    addWindow.close();
});

const menuTemplate = [
    {
      label: 'File',
      submenu: [
        { 
            label: 'New Todo',
            click() {
                createAddWindow();
            }
        },        
        { 
            label: 'Clear Todos',
            click() {
                mainWindow.webContents.send('todo:clear');
            }
        },
        { 
            label: 'Quit' , 
            accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }
        ]
    }
  ];

// Add blank menu on MacOS
if (process.platform === 'darwin') {
    menuTemplate.unshift({ label: '' });
}

if (process.env.NODE !== 'production') {
    menuTemplate.push(
        { 
            label: 'Developer!!!',
            submenu: [
                { role: 'reload' },
                {
                    label: 'Toggle Dev Tools',
                    accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow ) {
                        focusedWindow.toggleDevTools();

                    }
                }
            ]
        });
}