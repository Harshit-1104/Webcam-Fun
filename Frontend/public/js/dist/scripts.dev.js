"use strict";

var video = document.querySelector('.player');
var canvas = document.querySelector('.photo');
var ctx = canvas.getContext('2d');
var strip = document.querySelector('.strip');
var snap = document.querySelector('.snap');
var controlsPanel = document.querySelector('.controlsPanel');
var slidersGreenScreen = document.querySelector('.slidersGreenScreen');
var slidersRGBFilter = document.querySelector('.slidersRGBFilter');
var slidersRGBSplitter = document.querySelector('.slidersRGBSplitter');
var greenScreenToggled = false;
var rgbFilterToggled = false;
var rgbSplitterToggled = false;
var featuresToggled = {
  greenScreenToggler: greenScreenToggled,
  rgbFilterToggler: rgbFilterToggled,
  rgbSplitterToggler: rgbSplitterToggled
};
var features = {
  greenScreenToggler: slidersGreenScreen,
  rgbFilterToggler: slidersRGBFilter,
  rgbSplitterToggler: slidersRGBSplitter
};

function getVideo() {
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(function (localMediaStream) {
    video.srcObject = localMediaStream;
    video.play();
  })["catch"](function (err) {
    console.error('OH NO!!!', err);
  });
}

function paintToCanvas() {
  var width = video.videoWidth;
  var height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;
  return setInterval(function () {
    ctx.drawImage(video, 0, 0, width, height); // 0, 0 defines the origin
    // take the pixels out

    var pixels = ctx.getImageData(0, 0, width, height); // messing

    if (featuresToggled['rgbFilterToggler']) pixels = rgbFilter(pixels);
    if (featuresToggled['rgbSplitterToggler']) pixels = rgbSplitter(pixels); //    ctx.globalAlpha = 0.05;

    if (featuresToggled['greenScreenToggler']) pixels = greenScreen(pixels);
    ctx.putImageData(pixels, 0, 0);
  }, 10);
}

function takePhoto() {
  // plays the sound
  snap.currentTime = 0;
  snap.play(); // take the data out of the canvas

  var data = canvas.toDataURL('image/jpeg');
  var link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'Me/You');
  link.innerHTML = "<img src=\"".concat(data, "\" alt=\"Me/You\" />");
  strip.insertBefore(link, strip.firstChild);
}

function rgbSplitter(pixels) {
  var levels = {};
  var inputs = document.querySelectorAll('.slidersRGBSplitter .rgb_input');
  inputs.forEach(function (input) {
    levels[input.name] = input.value;
  });
  console.log(pixels.data);
  var red = parseInt(levels['red']),
      green = parseInt(levels['green']),
      blue = parseInt(levels['blue']);
  var size = pixels.data.length;

  for (var _i = 0; _i < size; _i += 4) {
    var idx_red = ((_i + red) % size + size) % size;
    pixels.data[_i + red] = pixels.data[_i + 0];
    pixels.data[_i + green] = pixels.data[_i + 1];
    pixels.data[_i + blue] = pixels.data[_i + 2];
  }

  console.log(pixels.data);
  return pixels;
}

function rgbFilter(pixels) {
  var levels = {};
  var inputs = document.querySelectorAll('.slidersRGBFilter .rgb_input');
  inputs.forEach(function (input) {
    levels[input.name] = input.value;
  });
  var red = parseInt(levels['red']),
      green = parseInt(levels['green']),
      blue = parseInt(levels['blue']);

  for (var _i2 = 0; _i2 < pixels.data.length; _i2 += 4) {
    pixels.data[_i2 + 0] = pixels.data[_i2 + 0] + red;
    pixels.data[_i2 + 1] = pixels.data[_i2 + 1] + green;
    pixels.data[_i2 + 2] = pixels.data[_i2 + 2] + blue;
  }

  return pixels;
}

function greenScreen(pixels) {
  var levels = {};
  var inputs = document.querySelectorAll('.slidersGreenScreen .rgb_input');
  inputs.forEach(function (input) {
    levels[input.name] = input.value;

    for (i = 0; i < pixels.data.length; i += 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];

      if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;
      }
    }
  });
  return pixels;
}

function toggleFeature(buttonClicked) {
  if (featuresToggled[buttonClicked]) {
    features[buttonClicked].style.display = 'none';
  } else {
    features[buttonClicked].style.display = 'block';
  }

  Object.keys(featuresToggled).forEach(function (key) {
    if (key !== buttonClicked) {
      featuresToggled[key] = false;
      features[key].style.display = 'none';
    }
  });
  featuresToggled[buttonClicked] = !featuresToggled[buttonClicked];
}

getVideo();
video.addEventListener('canplay', paintToCanvas);
controlsPanel.addEventListener('click', function (event) {
  var buttonClicked = '';
  console.log(event.target.getAttribute('name'));
  toggleFeature(event.target.getAttribute('name'));
});