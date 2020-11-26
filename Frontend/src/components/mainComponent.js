import React, { Component } from 'react';
import Heading from './headingComponent';
import PhotoBooth from './photoboothComponent';
import ControlsPanel from './ControlsPanel';
import Gallery from './GalleryComponent';
import fetch from 'cross-fetch';
import { baseUrl } from '../shared/baseUrl';

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      featuresToggled: {
        'GreenScreen': false,
        'RGBFilter': false,
        'RGBSplitter': false
      },
      featuresNeeded: {
        'GreenScreenNeeded': false,
        'RGBFilterNeeded': false,
        'RGBSplitterNeeded': false
      },
      prevButtonClicked: '',
      defaultPanelToggled: true,
      snap: null,
      images: null,
      counter: null,
      canvas: null,
      isGalleryVisible: false,
      imagesContainer: null,
      numberOfImagesFittable: 10,
      numberOfImages: 0,
      imagesFetched: false,
      addToModal: false,
      linkToAddToModal: null
    };

    this.toggleFeature = this.toggleFeature.bind(this);
    this.toggleHandler = this.toggleHandler.bind(this);
    this.neededFeatureToggler = this.neededFeatureToggler.bind(this);
    this.configPrevButton = this.configPrevButton.bind(this);
    this.takePhoto = this.takePhoto.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.insertImage = this.insertImage.bind(this);
    this.restoreDefault = this.restoreDefault.bind(this);
  }

  componentDidMount() {
    this.setState({
      snap: document.querySelector('.snap'),
      images: document.querySelector('.images'),
      counter: document.getElementById('counter'),
      canvas: document.querySelector('.photo'),
      imagesContainer: document.querySelector('.imagesContainer')
    }, () => {
      if (!this.state.imagesFetched) {
        fetch(baseUrl + 'album', {
          method: 'GET',
          headers: {
            'Authorization': `bearer ${this.props.user.token}`
          },
          credentials: 'same-origin',
          mode: 'cors'
        })
        .then((res) => res.json())
        .then((album) => {
          album.photos.forEach((photo) => {
            this.setState({
              numberOfImages: this.state.numberOfImages+1
            }, () => {
              const img = document.createElement('a');
              img.href = photo.link;
              img.setAttribute('download', `${this.props.user.username}`);
  
              this.insertImage(photo.link, img);
            })
          })

          this.setState({
            imagesFetched: true
          })
        })
        .catch((err) => console.log(err))
      }
    })
  }

  toggleFeature(buttonClicked) {
    let featuresToggled = { ...this.state.featuresToggled };

    Object.keys(this.state.featuresToggled).forEach((key) => {
      if(key !== buttonClicked) {
        featuresToggled[key] = false;
      }
    })
    featuresToggled[buttonClicked] = !featuresToggled[buttonClicked];
    
    this.setState({
      featuresToggled: featuresToggled
    });

    return 1;
  }

  configPrevButton(buttonClicked) {
    if (this.state.defaultPanelToggled) {
      this.setState({
        prevButtonClicked: ''
      });
    }
    else {
      this.setState({
        prevButtonClicked: buttonClicked
      });
    }
  }

  toggleHandler(e) {
    let buttonClicked = e.target.getAttribute('name');

    if (this.toggleFeature(buttonClicked) == 1) {
      this.setState({
        defaultPanelToggled: false
      }, () => {
        if (this.state.prevButtonClicked == buttonClicked) {
          this.setState({
            defaultPanelToggled: true
          }, () => this.configPrevButton(buttonClicked))
        } else {
          this.configPrevButton(buttonClicked);
        }
      });
    }
  }

  neededFeatureToggler(event) {
    let featureEnabled = event.target.getAttribute('name');

    if (this.state.featuresNeeded[featureEnabled]) {
      const tmp = {...this.state.featuresNeeded}
      tmp[featureEnabled] = false;
      this.setState({
        featuresNeeded: tmp
      })
    } else {
      const tmp = {...this.state.featuresNeeded}
      tmp[featureEnabled] = true;
      this.setState({
        featuresNeeded: tmp
      })
    }
  }

  takePhoto() {
    this.setState({
      numberOfImages: (this.state.numberOfImages + 1)
    }, () => {  
      // plays the sound
      this.state.snap.currentTime = 0;
      this.state.snap.play().then(function() {
      }).catch((err) => {
        console.log(err);
      });
    
      // take the data out of the canvas
      const link = this.state.canvas.toDataURL('image/jpeg');
      const img = document.createElement('a');
      img.href = link;
      img.setAttribute('download', `${this.props.user.username}`);

      this.insertImage(link, img);

      const body = {
        photo: {
          "link": link,
          },
        "noOfImages": (this.state.numberOfImages),
        "username": this.props.user.username
      }

      fetch(baseUrl + 'album', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `bearer ${this.props.user.token}`
        },
        body: JSON.stringify(body),
        credentials: 'same-origin',
        mode: 'cors'
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        this.setState({
          addToModal: true,
          linkToAddToModal: link
        })
      })
      .catch((err) => console.log(err))
    })
  }

  insertImage(link, img) {
    let images = this.state.images;
    let counter = this.state.counter;
    let numberOfImagesFittable = this.state.numberOfImagesFittable;

    if (this.state.numberOfImages <= numberOfImagesFittable) {
      img.innerHTML = `<img class="image" src="${link}" alt="Me/You" />`;
      images.insertBefore(img, images.firstChild);
    } else {
      img.innerHTML = `<img class="image" src="${link}" alt="Me/You" />`;
      images.insertBefore(img, images.firstChild);
      
      images.children[numberOfImagesFittable+1].style.backgroundImage = `url("${images.children[numberOfImagesFittable].getAttribute('href')}")`;
      images.children[numberOfImagesFittable+1].style.display = 'flex';
  
      images.removeChild(images.childNodes[numberOfImagesFittable]);
  
      counter.style.display = 'flex';
      counter.innerHTML = `<span>+${this.state.numberOfImages - numberOfImagesFittable}</span>`;
  
      this.setState({
        images: images,
        counter: counter
      })
    }
  }

  restoreDefault() {
    this.setState({
      linkToAddToModal: null,
      addToModal: false
    })
  }

  render() {
    return (
      <div className="container__">
        <Heading user= {this.props.user}/>
        <PhotoBooth neededFeatureToggler={this.neededFeatureToggler} defaultPanelToggled={this.state.defaultPanelToggled}
                  featuresNeeded={this.state.featuresNeeded} featuresToggled={this.state.featuresToggled} 
                  takePhoto={this.takePhoto}/>
        <ControlsPanel toggleHandler={this.toggleHandler}/>
        <Gallery user={this.props.user} addToModal={this.state.addToModal} link={this.state.linkToAddToModal} restoreDefault={this.restoreDefault}/>
      </div>
    );
  }
}

export default Main;