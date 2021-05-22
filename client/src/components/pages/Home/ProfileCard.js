import React from "react";
import profileImg from "../../../assets/img/default_profile_pics/others.png";

function ProfileCard(props) {
  return (
    <div className="profileCard">
      <div className="profileImg">{/* <img src={profileImg}/> */}</div>
      <div className="profileName">
        <h3>Priyanshu Tiwari</h3>
      </div>
    </div>
  );
}

export default ProfileCard;
