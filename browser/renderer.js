// In your renderer.js or HTML file
const startSharingButton = document.getElementById("startSharing");

startSharingButton.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    // Display the screen sharing stream (you can customize this part)
    const videoElement = document.createElement("video");
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    document.body.appendChild(videoElement);
  } catch (error) {
    console.error("Error accessing screen sharing:", error);
  }
});
