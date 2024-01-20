// preload.js
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronApi", {
  requestMediaPermissions: async () => {
    return await ipcRenderer.invoke("request-media-permissions");
  },
});

// Expose desktopCapturer to the renderer process
contextBridge.exposeInMainWorld("electron", {
  desktopCapturer: {
    getSources: (opts) => {
      return ipcRenderer.invoke("DESKTOP_CAPTURER_GET_SOURCES", opts);
    },
  },
});
// contextBridge.exposeInMainWorld("electron", {
//   requestMediaPermissions: async () => {
//     const constraints = { video: true };
//     try {
//       const screenshare = await navigator.mediaDevices.getDisplayMedia(
//         constraints
//       );
//       const webcam = await navigator.mediaDevices.getUserMedia(constraints);
//       return { screenshare, webcam };
//     } catch (error) {
//       console.error("Error accessing media devices:", error);
//       return { error: error.message };
//     }
//   },
// });
window.addEventListener("storage", function (event) {
  console.log("LocalStorage event:", event);

  // Check the event properties
  if (event.key === "test") {
    console.log('Value of "test" changed in localStorage:', event.newValue);
    ipcRenderer.send("set-fullscreen");
  }
  if (event.key === "test1") {
    console.log('Value of "test" changed in localStorage:', event.newValue);
    ipcRenderer.send("unset-fullscreen");
  }
});
