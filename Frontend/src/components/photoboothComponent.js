import React, { Component } from 'react';
import Sliders from './Sliders';
import GreenScreen from './GreenScreen';
import RightPanel from './RightPanel';
import * as Features from '../../public/js/features';

class Photobooth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      video: null,
      ctx: null
    }

    this.getVideo = this.getVideo.bind(this);
    this.paintToCanvas = this.paintToCanvas.bind(this);
    this.getCanvas = this.getCanvas.bind(this);
  }

  getVideo(video) {
    this.setState({
      video: video
    }, () => {
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(localMediaStream => {
        video.srcObject = localMediaStream;
        video.play();
      })
      .catch(err => {
        console.log(err);
      });
    })
  }

  getCanvas(canvas) {
    this.setState({
      canvas: canvas,
      ctx: canvas.getContext('2d')
    })
  }

  paintToCanvas() {
    const width = this.state.video.videoWidth;
    const height = this.state.video.videoHeight;
    const canvas = this.state.canvas;

    canvas.width = width;
    canvas.height = height;
    
    return setInterval(() => {
      let ctx = this.state.ctx;
      ctx.drawImage(this.state.video, 0, 0, width, height);   // 0, 0 defines the origin
      // take the pixels out
      let pixels = ctx.getImageData(0, 0, width, height);
      
      // messing 
      if (this.props.featuresToggled['RGBFilter'] || this.props.featuresNeeded['RGBFilterNeeded']) {
        pixels = Features.rgbFilter(pixels);
      }
  
      if (this.props.featuresToggled['RGBSplitter'] || this.props.featuresNeeded['RGBSplitterNeeded']) {
        pixels = Features.rgbSplitter(pixels);
      }
  
      if (this.props.featuresToggled['GreenScreen'] || this.props.featuresNeeded['GreenScreenNeeded']) {
        pixels = Features.greenScreen(pixels);
      }
      ctx.putImageData(pixels, 0, 0);

      this.setState({
        ctx: ctx
      })
    }, 10);
  }

  render() {
    return (
      <div className ="photobooth row">
        <Sliders neededFeatureToggler={this.props.neededFeatureToggler} defaultPanelToggled={this.props.defaultPanelToggled} 
                  featuresNeeded={this.props.featuresNeeded}  featuresToggled={this.props.featuresToggled}/>
        <GreenScreen getCanvas ={this.getCanvas}/>
        <RightPanel getVideo ={this.getVideo} paintToCanvas ={this.paintToCanvas} takePhoto ={this.props.takePhoto}/>
      </div>
    )
  }
}

export default Photobooth