import React from "react";

function ProfileCard(props) {
  return (
    <div className="profileCard" onClick={() => props.handleSignInRequest({email: props.profile.information.email})}>
      <div className="profileImg"><img src={props.profile.information.avatar} className="img-fluid"/></div>
      <div className="profileName">
        <h3>{props.profile.information.fullName}</h3>
      </div>
    </div>
  );
}

export default ProfileCard;
