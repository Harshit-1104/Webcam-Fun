function rgbSplitter(pixels) {
  const levels = {};
  const inputs = document.querySelectorAll('.slidersRGBSplitter .rgb_input')

  inputs.forEach(input => { 
    levels[input.name] = input.value;
  });

  var red = parseInt(levels['red']), green = parseInt(levels['green']), blue = parseInt(levels['blue']);
  var size = pixels.data.length;
  for (let i = 0; i < size; i+=4) {
    var idx_red = ((i + red) % size + size) % size, idx_green = ((i + green) % size + size) % size, idx_blue = ((i + blue) % size + size) % size;
    pixels.data[idx_red] = pixels.data[i + 0];
    pixels.data[idx_green] = pixels.data[i + 1];
    pixels.data[idx_blue] = pixels.data[i + 2];
  }

  return pixels;
}

function rgbFilter(pixels) {
  const levels = {};
  const inputs = document.querySelectorAll('.slidersRGBFilter .rgb_input')

  inputs.forEach(input => { 
    levels[input.name] = input.value;
  });

  var red = +levels['red'], green = +levels['green'], blue = +levels['blue'];
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + red;
    pixels.data[i + 1] = pixels.data[i + 1] + green;
    pixels.data[i + 2] = pixels.data[i + 2] + blue;
  }

  return pixels;
}

function greenScreen(pixels) {
  const levels = {};
  const inputs = document.querySelectorAll('.slidersGreenScreen .rgb_input');

  inputs.forEach(input => {
    levels[input.name] = input.value;

    for (var i = 0; i < pixels.data.length; i+= 4) {
      var red = pixels.data[i + 0];
      var green = pixels.data[i + 1];
      var blue = pixels.data[i + 2];

    if (red >= levels.rmin && green >= levels.gmin && blue >= levels.bmin
      && red <= levels.rmax && green <= levels.gmax && blue <= levels.bmax) {
        pixels.data[i + 3] = 0;
      }
    }
  });

  return pixels;
}

export {
  rgbSplitter,
  rgbFilter,
  greenScreen
}