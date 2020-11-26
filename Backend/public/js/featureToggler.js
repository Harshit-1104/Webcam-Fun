var greenScreenToggled = false,
    rgbFilterToggled = false,
    rgbSplitterToggled = false,
    defaultPanelToggled = true;

var featuresNeeded = {
  greenScreenNeeded: false,
  rgbFilterNeeded: false,
  rgbSplitterNeeded: false
}

let prevButtonClicked = '';

var featuresToggled = {
  greenScreenToggler: greenScreenToggled, 
  rgbFilterToggler: rgbFilterToggled,
  rgbSplitterToggler: rgbSplitterToggled
};

function toggleFeature(buttonClicked, features) {
  if (featuresToggled[buttonClicked]) {
    features[buttonClicked].style.display = 'none';
  } else {
    features[buttonClicked].style.display = 'flex';  
  }

  Object.keys(featuresToggled).forEach((key) => {
    if(key !== buttonClicked) {
      featuresToggled[key] = false;
      features[key].style.display = 'none';
    }
  })

  featuresToggled[buttonClicked] = !featuresToggled[buttonClicked];
  return 1;
}

function toggleHandler(event, defaultPanel, features) {
  let buttonClicked = event.target.getAttribute('name');
  
  if (toggleFeature(buttonClicked, features) == 1) {
    defaultPanelToggled = false;
    defaultPanel.style.display = 'none';
  }

  if (prevButtonClicked == buttonClicked) {
    defaultPanelToggled = true;
    defaultPanel.style.display = 'flex';
  }

  if (defaultPanelToggled)
    prevButtonClicked = '';
  else 
    prevButtonClicked = buttonClicked;
}

function neededFeatureToggler(event) {
  let featureEnabled = event.target.getAttribute('name');

  if (featuresNeeded[featureEnabled]) {
    featuresNeeded[featureEnabled] = false;
    document.getElementsByName(`${featureEnabled}`)[0].querySelector('.enabler').innerHTML = '<b>Disabled</b>';
  } else {

    featuresNeeded[featureEnabled] = true;
    document.getElementsByName(`${featureEnabled}`)[0].querySelector('.enabler').innerHTML = '<b>Enabled</b>';
  }
}

export {
  toggleFeature,
  toggleHandler,
  neededFeatureToggler,
  featuresToggled,
  featuresNeeded
}