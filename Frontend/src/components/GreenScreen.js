import React, { Component } from 'react'

class GreenScreen extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const canvas = document.querySelector('.photo');
    this.props.getCanvas(canvas);
  }
  
  render() {
    return (
      <div className="col-6 forGreenScreen">
        <canvas className="photo"></canvas>
      </div>
    )
  }
}


export default GreenScreen;