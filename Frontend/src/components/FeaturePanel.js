import React, { Component } from 'react';
import { RGB } from '../shared/rgb'
import { FEATURES } from '../shared/features'

class FeaturePanels extends Component {

  constructor(props) {
    super(props);

    this.state = {
      rgb: RGB,
      features: FEATURES
    }

    this.SlidersGreenScreen = this.SlidersGreenScreen.bind(this);
    this.SliderRGBSplitter = this.SliderRGBSplitter.bind(this);
    this.SliderRGBFilter = this.SliderRGBFilter.bind(this);
  }

  SlidersGreenScreen() {
    const sliders = this.state.rgb.map((color) => {
      return(
        <div className={color + '_sliders'} key={color}>
          <div className = 'slider rgb_max'>
            <label>{color + " Max:"}</label>
            <input type= "range" step={1} defaultValue={0+255/2} min={0} max={255} name={color[0] + "max"} className="rgb_input"></input>
          </div>
          <div className = 'slider rgb_min'>
            <label>{color + " Min:"}</label>
            <input type= "range" step={1} defaultValue={0+255/2} min={0} max={255} name={color[0] + "min"} className="rgb_input"></input>
          </div>
        </div>
      )
    });

    return sliders;
  }

  SliderRGBFilter() {
    const sliders = this.state.rgb.map((color) => {
      return(
        <div className={color + '_sliders'} key={color}>
          <div className = 'slider'>
            <label>{color+":"}</label>
            <input type= "range" step={1} defaultValue={0} min='-127' max="128" name={color} className="rgb_input"></input>
          </div>
        </div>
      )
    });

    return sliders;
  }

  SliderRGBSplitter() {
    const sliders = this.state.rgb.map((color) => {
      return(
        <div className={color + '_sliders'} key={color}>
          <div className = 'slider'>
            <label>{color+":"}</label>
            <input type= "range" step={1} defaultValue={0} min='-127' max="128" name={color} className="rgb_input"></input>
          </div>
        </div>
      )
    });

    return sliders;
  }

  render() {
    let featureDisplay = {};
    Object.keys(this.props.featuresToggled).forEach((key) => {
      if(this.props.featuresToggled[key]) {
        featureDisplay[key] = 'flex'
      }
      else
        featureDisplay[key] = 'none'
    });
    
    return (
      <React.Fragment>
        <div className="slidersGreenScreen" style={{display: featureDisplay['GreenScreen']}}>
          <this.SlidersGreenScreen />
        </div>
        <div className="slidersRGBFilter" style={{display: featureDisplay['RGBFilter']}}>
          <this.SliderRGBFilter />
        </div>
        <div className = "slidersRGBSplitter" style={{display: featureDisplay['RGBSplitter']}}>
          <this.SliderRGBSplitter />
        </div>
      </React.Fragment>
    )
  }
}

export default FeaturePanels;
