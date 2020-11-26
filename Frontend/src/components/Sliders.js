import React, { Component } from 'react';
import DefaultPanel from './DefaultPanel';
import FeaturePanels from './FeaturePanel';

class Sliders extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    
    return (
      <div className="col-3 sliders">
        <DefaultPanel neededFeatureToggler={this.props.neededFeatureToggler} defaultPanelToggled={this.props.defaultPanelToggled}
                   featuresNeeded={this.props.featuresNeeded}/>
        <FeaturePanels featuresToggled={this.props.featuresToggled}/>
      </div>
    )
  }
}

export default Sliders