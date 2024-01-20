const {
  app,
  BrowserWindow,
  dialog,
  globalShortcut,
  webContents,
  Menu,
  MenuItem,
  ipcMain,
  ipcRenderer,
  session,
  desktopCapturer,
  
} = require("electron");
const child_process = require("child_process");
const path = require("path");
const fs = require("fs");
const url = require("url");
const { exec, spawn } = require("child_process");
const {
  // desktopCapturer,
  MediaRecorder,
  MediaStream,
} = require("electron-webrtc");
const { electron } = require("process");
// require("./lock_touchpad.js"); // Adjust the path as needed
let isFullscreen = false;

let mainWindow;
let runner;
// let pythonRunner;
// let pythonProcess;
// app.setPath("userData", __dirname + "/saved_recordings");
function createWindow() {
  const psScriptPath2 = path.join(__dirname, "closingScreenSharingApps.ps1");
  const psCommand2 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath2}"`;

  console.log("Closing screen sharing apps...");

  child_process.exec(psCommand2, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing PowerShell script: ${error}`);
    } else {
      console.log("PowerShell script executed successfully.");
      mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        minimizable: false,
        maximizable: false,
        fullscreen: true,
        webPreferences: {
          nodeIntegration: true,
          preload: path.join(__dirname, "preload.js"),
          contextIsolation: false,
        },
      });
    
      mainWindow.loadFile('index.html');
    
      // Prevent Alt+Tab
   
    
      mainWindow.on('closed', function () {
        mainWindow = null;
      });
      // mainWindow = new BrowserWindow({ width: 800, height: 600 });

      // Preload the polyfill script
      // mainWindow.webContents.session.setPreloads([
      //   path.join(__dirname, "preload-get-display-media-polyfill.js"),
      // ]);

      // // Set permission handlers to allow all permissions (for simplicity)
      // mainWindow.webContents.session.setPermissionCheckHandler(
      //   async (webContents, permission, details) => {
      //     return true;
      //   }
      // );

      // mainWindow.webContents.session.setPermissionRequestHandler(
      //   async (webContents, permission, callback, details) => {
      //     callback(true);
      //   }
      // );

      const menu = Menu.buildFromTemplate([]);
      Menu.setApplicationMenu(menu);

      mainWindow.loadURL("http://localhost:3001/");
      ipcMain.on("set-fullscreen", () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          setTimeout(() => {
            mainWindow.setFullScreen(true);
            console.log("Window set to fullscreen");
          }, 1000); // Adjust the delay as needed
        }
      });
      ipcMain.on("unset-fullscreen", () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.setFullScreen(false);
          console.log("Window unset from fullscreen");
        }
      });
      // mainWindow.loadURL("http://127.0.0.1:5500/index.html");

      // mainWindow.loadFile("C:/Users/hetvr/Downloads/index.html");
      // mainWindow.loadURL("file://" + __dirname + "/index.html");
      // mainWindow.loadFile("C:/Users/hetvr/Downloads/index.html");
      ipcMain.handle("request-media-permissions", async (event) => {
        try {
          const stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
          });

          return true; // Permissions granted
        } catch (error) {
          console.error("Error requesting media permissions:", error);
          return false; // Permissions denied or error occurred
        }
      });
      ipcMain.handle("DESKTOP_CAPTURER_GET_SOURCES", async (event, opts) => {
        try {
          const sources = await desktopCapturer.getSources(opts);
          return sources;
        } catch (error) {
          console.error("Error getting sources:", error);
          throw error;
        }
      });

      // ipcMain.on("start-media-sharing", async (event, mediaType) => {
      //   try {
      //     const displayMediaStream =
      //       await navigator.mediaDevices.getDisplayMedia({ video: true });
      //     mainWindow.webContents.send("media-sharing-started", {
      //       mediaType,
      //       stream: displayMediaStream,
      //     });
      //   } catch (error) {
      //     console.error("Error starting media sharing:", error);
      //   }
      // });

      // // Handle stopping media sharing
      // ipcMain.on("stop-media-sharing", () => {
      //   mainWindow.webContents.send("media-sharing-stopped");
      // });
      //     mainWindow.loadURL(`data:text/html,
      //   <!DOCTYPE html>
      //   <html>
      //   <head>
      //     <title>Electron Media Sharing</title>
      //   </head>
      //   <body>
      //     <h1>Electron Media Sharing Example</h1>
      //     <button id="startMedia">Start Video & Audio</button>
      //     <button id="startScreenSharing">Start Screen Sharing</button>
      //     <video id="videoElement" autoplay></video>
      //     <script>
      //       const startMediaButton = document.getElementById('startMedia');
      //       const startScreenSharingButton = document.getElementById('startScreenSharing');
      //       const videoElement = document.getElementById('videoElement');

      //       startMediaButton.addEventListener('click', async () => {
      //         try {
      //           const stream = await navigator.mediaDevices.getUserMedia({
      //             video: true,
      //             audio: true,
      //           });
      //           videoElement.srcObject = stream;
      //         } catch (error) {
      //           console.error('Error accessing media devices:', error);
      //         }
      //       });

      //       startScreenSharingButton.addEventListener('click', async () => {
      //         try {
      //           const stream = await navigator.mediaDevices.getDisplayMedia({
      //             video: {
      //               cursor: 'always',
      //             },
      //             audio: true,
      //           });
      //           videoElement.srcObject = stream;
      //         } catch (error) {
      //           console.error('Error accessing screen sharing:', error);
      //         }
      //       });
      //     </script>
      //   </body>
      //   </html>
      // `);

      // mainWindow.loadURL("http://127.0.0.1:5500/test.html");
      // mainWindow.loadFile("C:/Users/hetvr/Desktop/index.html");
      // ipcMain.on("set-fullscreen", () => {
      //   // if (mainWindow && !mainWindow.isDestroyed() && !isFullscreen) {
      //   const psScriptPath = path.join(__dirname, "disabletouchfinger.ps1");
      //   const psCommand = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`;

      //   child_process.exec(psCommand, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Error executing PowerShell script: ${error}`);
      //     }
      //     // Continue with window closing logic
      //     mainWindow = null;
      //   });
      //   mainWindow.setFullScreen(true);
      //   // isFullscreen = true;

      //   console.log("Window set to fullscreen");
      //   // }
      // });

      // // Listen for the "unset-fullscreen" event
      // ipcMain.on("unset-fullscreen", () => {
      //   // if (mainWindow && !mainWindow.isDestroyed() && isFullscreen) {
      //   const psScriptPath1 = path.join(__dirname, "enabletouchfinger.ps1");
      //   const psCommand1 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath1}"`;

      //   child_process.exec(psCommand1, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Error executing PowerShell script: ${error}`);
      //     }
      //     // Continue with window closing logic
      //     mainWindow = null;
      //   });
      //   // mainWindow.setFullScreen(false);
      //   // isFullscreen = false;
      //   console.log("Window unset from fullscreen");
      //   // }
      // });

      // ipcMain.on("set-fullscreen", () => {
      //   // Run the PowerShell script to disable touchpad gestures
      //   const psScriptPath = path.join(__dirname, "disabletouchfinger.ps1");
      //   const psCommand = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`;

      //   child_process.exec(psCommand, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Error executing PowerShell script: ${error}`);
      //     } else {
      //       // Set the window to fullscreen after PowerShell script execution
      //       if (mainWindow && !mainWindow.isDestroyed()) {
      //         // mainWindow.setFullScreen(true);
      //         // console.log("Window set to fullscreen");
      //         setTimeout(() => {
      //           mainWindow.setFullScreen(true);
      //           console.log("Window set to fullscreen");
      //         }, 5000); // Adjust the delay as needed
      //       }
      //     }
      //   });
      // });
      // ipcMain.on("set-fullscreen", () => {
      //   const psScriptPath = path.join(__dirname, "disabletouchfinger.ps1");
      //   const psCommand = `powershell -ExecutionPolicy Bypass -File "${psScriptPath}"`;

      //   console.log(
      //     "Executing PowerShell script to disable touchpad gestures..."
      //   );

      //   child_process.exec(psCommand, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Error executing PowerShell scripts: ${error}`);
      //       console.error(`stderr: ${stderr}`);
      //     } else {
      //       console.log("PowerShell script executed successfully.");

      //       // Add a delay before setting to fullscreen
      //       setTimeout(() => {
      //         if (mainWindow && !mainWindow.isDestroyed()) {
      //           console.log("Setting window to fullscreen...");
      //           mainWindow.setFullScreen(true);
      //           console.log("Window set to fullscreen");
      //         }
      //       }, 1000); // Adjust the delay as needed
      //     }
      //   });
      // });

      // ipcMain.on("unset-fullscreen", () => {
      //   // Run the PowerShell script to enable touchpad gestures
      //   const psScriptPath1 = path.join(__dirname, "enabletouchfinger.ps1");
      //   const psCommand1 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath1}"`;

      //   child_process.exec(psCommand1, (error, stdout, stderr) => {
      //     if (error) {
      //       console.error(`Error executing PowerShell script: ${error}`);
      //     } else {
      //       // Unset fullscreen mode after PowerShell script execution
      //       if (mainWindow && !mainWindow.isDestroyed()) {
      //         mainWindow.setFullScreen(false);
      //         console.log("Window unset from fullscreen");
      //       }
      //     }
      //   });
      // });
      // mainWindow.webContents.openDevTools();
      mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.session.setPermissionRequestHandler(
          (webContents, permission, callback) => {
            if (permission === "media") {
              callback(true); // Allow access to media devices (camera and microphone)
            }
            if (permission === "desktop-capture") {
              callback(true); // Allow screen sharing
            }
          }
        );
      });

      exec("python detect_hdmi.py", (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return;
        }
        console.log(`Python script output:\n${stdout}`);
      });

     

      mainWindow.on("close", () => {
        // const psScriptPath1 = path.join(__dirname, "enabletouchfinger.ps1");
        // const psCommand1 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath1}"`;

        // child_process.exec(psCommand1, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`Error executing PowerShell script: ${error}`);
        //   }
        //   // Continue with window closing logic
        //   mainWindow = null;
        // });

        const psScriptPath3 = path.join(__dirname, "closepythonprocess.ps1");
        const psCommand3 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath3}"`;

        child_process.exec(psCommand3, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing PowerShell script: ${error}`);
          }
          // Continue with window closing logic
          mainWindow = null;
        });
        const choice = dialog.showMessageBoxSync(mainWindow, {
          type: "question",
          buttons: ["Yes", "No"],
          title: "Confirm",
          message: "Do you really want to close this window?",
        });
        // If the user chooses "No," prevent the window from closing
        if (choice === 1) {
          e.preventDefault();
        }
        mainWindow = null;
      });

      if (process.platform === "win32" || process.platform === "darwin") {
        // const psScriptPath2 = path.join(__dirname, "closingScreenSharingApps.ps1");
        // const psCommand2 = `powershell -ExecutionPolicy Bypass -File "${psScriptPath2}"`;
        // console.log("done");
        // child_process.exec(psCommand2, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`Error executing PowerShell script: ${error}`);
        //   }
        //   // Continue with window closing logic
        //   mainWindow = null;
        // });
    
        const pythonExecutable =
          "C:/Users/hetvr/AppData/Local/Programs/Python/Python311/python.exe";
       // console.log(pythonScriptPath);
        runner = child_process.spawn(pythonExecutable, [pythonScriptPath], {
          shell: true,
        });

        runner.on("exit", (code) => {
          console.log(`Python script exited with code ${code}`);
        });
      }
    }
  });
}


app.on("ready", () => {
  createWindow();
  require("./usb_detection.js");
  globalShortcut.register('Super', () => {
    console.log('Windows key pressed');
    // Perform your actions when the Windows key is pressed
  });
}


)






app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    globalShortcut.unregister("CommandOrControl+X");
    globalShortcut.unregisterAll();
    app.quit();
  }
});

app.on("before-quit", () => {});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
