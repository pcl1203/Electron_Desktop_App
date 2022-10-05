const electron = require('electron');
const { BrowserWindow } = electron;

class MainWindow extends BrowserWindow {
  constructor(url) {
    super({
      height: 500,
      width: 300,
      frame: false,
      resizable: false,
      show: false,
      skipTaskbar: true,
      webPreferences: { 
        backgroundThrottling: false, // running full speed even at background
        nodeIntegration: true,
        contextIsolation: false,
      }
    });

    this.loadURL(url);
    this.on('blur', this.onBlur);
  }

  onBlur = () => {
    this.hide();
  }
}

module.exports = MainWindow;
