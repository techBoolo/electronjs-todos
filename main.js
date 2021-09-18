const electron = require('electron');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  mainWindow.loadURL(`file://${__dirname}/main.html`)

  mainWindow.on('closed', () => app.quit());

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu);
})

const createAddWindow = () => {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo',
    parent: mainWindow,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  addWindow.loadURL(`file://${__dirname}/add.html`)
  addWindow.on('closed', () => addWindow = null)
}

ipcMain.on('todo:add', (ev, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
})

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { 
        label: "New Todo",
        click() {
          createAddWindow()
        }
      },
      {
        label: 'Clear Todos', 
        click() {
          mainWindow.webContents.send('todo:clear');
        }
      },
      {
        label: 'Quit',
        accelerator: (() => {
          if(process.platform === 'darwin'){
            return 'Command+Q' 
          } else {
            return 'Ctrl+Q' 
          } 
        })(),
        click() {
          app.quit()
        }
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { 
        role: 'copy',
        accelerator: 'Ctrl+c' 
      }
    ]
  }
];

// for macOs
if(process.platform === 'darwin') {
  menuTemplate.unshift({})
}

if(process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'toggle devloper tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools() 
        }
      }
    ]
  })
}
