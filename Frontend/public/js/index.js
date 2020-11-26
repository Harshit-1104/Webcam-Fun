const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const images = document.querySelector('.images');
const galleryToggler = document.getElementById('galleryToggler');
const imagesContainer = document.querySelector('.imagesContainer');
const snap = document.querySelector('.snap');
const counter = document.getElementById('counter');
const photoButton = document.querySelector('.sayCheese');
const controlsPanel = document.querySelector('.controlsPanel');
const defaultPanel = document.querySelector('.defaultPanel');
const slidersGreenScreen = document.querySelector('.slidersGreenScreen');
const slidersRGBFilter = document.querySelector('.slidersRGBFilter');
const slidersRGBSplitter = document.querySelector('.slidersRGBSplitter');


var isGalleryVisible = false;

var features = {
  greenScreenToggler: slidersGreenScreen, 
  rgbFilterToggler: slidersRGBFilter,
  rgbSplitterToggler: slidersRGBSplitter
};

import * as Player from "./video_and_canvas.js";
import * as Gallery from "./gallery.js";
import * as Toggler from "./featureToggler.js";

Player.getVideo(video);
video.addEventListener('canplay', () => Player.paintToCanvas(video, canvas, ctx, Toggler.featuresNeeded, Toggler.featuresToggled));

galleryToggler.addEventListener('click', () => Gallery.toggleGallery(isGalleryVisible, imagesContainer));

photoButton.addEventListener('click', () => Gallery.takePhoto(snap, images, counter, canvas));

defaultPanel.addEventListener('click', () => Toggler.neededFeatureToggler(event));

controlsPanel.addEventListener('click', () => Toggler.toggleHandler(event, defaultPanel, features));
