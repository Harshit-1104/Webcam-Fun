var numberOfImages = 0;
const numberOfImagesFittable = 10;

function takePhoto(snap, images, counter, canvas) {
  numberOfImages++;

  // plays the sound
  snap.currentTime = 0;
  snap.play().then(function() {

  }).catch((err) => {
    console.log(err);
  });

  // take the data out of the canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'Me/You');
  
  insertImage(link, data, images, counter);
}

function insertImage(link, data, images, counter) {
  if (numberOfImages <= numberOfImagesFittable) {
    link.innerHTML = `<img class="image" src="${data}" alt="Me/You" />`;
    images.insertBefore(link, images.firstChild);
  } else {
    link.innerHTML = `<img class="image" src="${data}" alt="Me/You" />`;
    images.insertBefore(link, images.firstChild);
    
    images.children[numberOfImagesFittable+1].style.backgroundImage = `url("${images.children[numberOfImagesFittable].getAttribute('href')}")`;
    images.children[numberOfImagesFittable+1].style.display = 'flex';

    images.removeChild(images.childNodes[numberOfImagesFittable]);

    counter.style.display = 'flex';
    counter.innerHTML = `<span>+${numberOfImages - numberOfImagesFittable}</span>`;
  }
}

function toggleGallery(isGalleryVisible, imagesContainer) {
  isGalleryVisible = !isGalleryVisible;

  if (isGalleryVisible) 
    imagesContainer.style.display = 'none'
  else 
    imagesContainer.style.display = 'flex'
}

export {
  takePhoto,
  toggleGallery
}

