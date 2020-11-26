import React from 'react'
import { FEATURES } from '../shared/features'

const RenderControlButtons = ({props}) => {
  return (
    FEATURES.map((feature) => {
      return (
        <i name={feature.name.split(" ").join("")} className={"fa fa-square-o fa-3x " + feature.name.split(" ").join("") + "Toggler"} 
            key={feature.id} onClick={props.toggleHandler}></i>
      )
    })
  )
}

const ControlsPanel = (props) => {
  return(
    <div className="controlsPanel row">
      <RenderControlButtons props = {props}/>
    </div>
  )
};

export default ControlsPanel;
