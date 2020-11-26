import React from 'react';

const Heading = (props) => {
  return (
    <div className = "row heading">
      <div className="profile">
        <img alt="" src={require("./../../public/assets/svgs/profile.svg")} className="profileIcon" />
      </div>
      <h1>
        Webcam Fun!  
      </h1>
    </div>
  )
}

export default Heading;