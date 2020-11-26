import React, { Component } from 'react'

class RightPanel extends Component {
  constructor(props) {
    super(props);

    this.componentDidMount = this.componentDidMount.bind(this);
  }
  
  componentDidMount() {
    const video = document.querySelector('.player')
    this.props.getVideo(video);
  }
  
  render() {
    return(
      <div className="col-3 right-panel">
        <div className="video">
          <video className="player" onCanPlay={this.props.paintToCanvas}></video>
        </div>
        <div className="art">
          <img alt="" src={require("./../../public/assets/svgs/wire.svg")} className="wire" />
          <button className="sayCheese" onClick={this.props.takePhoto}></button>
        </div>
      </div>
    )
  }
}

export default RightPanel