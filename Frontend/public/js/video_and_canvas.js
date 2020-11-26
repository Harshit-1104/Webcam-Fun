import * as features from "./features.js";

function getVideo(video) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false})
    .then(localMediaStream => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch(err => {
      console.error('OH NO!!!', err);
    });
}

function paintToCanvas(video, canvas, ctx, featuresNeeded, featuresToggled) {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);   // 0, 0 defines the origin
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
    
    // messing
    if (featuresToggled['rgbFilterToggler'] || featuresNeeded['rgbFilterNeeded'])
      pixels = features.rgbFilter(pixels);

    if (featuresToggled['rgbSplitterToggler'] || featuresNeeded['rgbSplitterNeeded'])  
      pixels = features.rgbSplitter(pixels);

    if (featuresToggled['greenScreenToggler'] || featuresNeeded['greenScreenNeeded'])
      pixels = features.greenScreen(pixels);
    
    ctx.putImageData(pixels, 0, 0);
  }, 10);
}

export {
  getVideo,
  paintToCanvas
}