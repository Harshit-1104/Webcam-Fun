import React, { Component } from 'react';
import { FEATURES } from '../shared/features';

class DefaultPanel extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      features: FEATURES
    }

    this.RenderFeatures = this.RenderFeatures.bind(this);
  }

  RenderFeatures() {
    const features = this.state.features.map((feature) => {
      if (this.props.featuresNeeded[feature.name.split(" ").join("") + 'Needed'])
        feature.state = 'Enabled'
      else
        feature.state = 'Disabled'

      return(
        <button className="greenBtn" name = {(feature.name).split(" ").join("") + 'Needed'} key={feature.id} onClick={this.props.neededFeatureToggler}>
          {feature.name}:
          <span className="enabler">
            <b>{feature.state}</b>
          </span>
        </button>     
      )
    });

    return features;
  }

  render() {
    let display = '';
    if (this.props.defaultPanelToggled)
      display = 'flex'
    else
      display = 'none'

    return (
      <div className = "defaultPanel" style={{display: display}}>
        <this.RenderFeatures />
      </div>
    )
  }
}

export default DefaultPanel;