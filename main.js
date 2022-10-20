// main.js

// Modules to control application life and create native browser window
const { exec } = require('child_process');
const { writeFile } = require('fs');
const { dialog } = require('electron');

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    frame: false,
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  /*-----------------------------------------------------------------*/
//Minimizar, maximizar tela e deixar com tamanho pequeno de novo
    ipcMain.on('maximize', () => {
        //mainWindow is the reference to your window
        mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()
    })


    ipcMain.on('minimize', () => {
        mainWindow.minimize();
    })
//-----------------------------------------------------------------

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. Você também pode colocar eles em arquivos separados e requeridos-as aqui.

ipcMain.on("async-ipcmain", (event, args)=>{
  console.log(args);
  event.sender.send("async-ipcrender","ooi ipcmain");
});


ipcMain.on('renderer/salvar_arquivo', async function(event, args) {
  const codeBtnRun = args;

    const { filePath, canceled } = await dialog.showSaveDialog();
    /*Parâmetro filePath é o caminho inteiro do arquivo desde o disco C, canceled é se ele foi salvo ou não, caso cancelado filePath recebe o valor null*/
    if(canceled){
        return false;
        //Se canceled for falso quer dizer que não é pra salvar, já que o segundo parâmetro mostra está ligado à decisão de salvar ou não
    }
    
    writeFile(filePath, codeBtnRun, function(err, result){});

    var fileName = path.basename(filePath)
    
    exec('dir');

    exec('gcc '+fileName+' -o '+fileName+'.exe');

  var msg;
  console.log("----------------")
  console.log(fileName)
  
  
  
});