import React, { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const StyledIdContainer = styled.div`
  /* width: 80vw; */
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 25vh;
  /* background-color: var(--primary-color); */
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    width: 80vw;
    height: 30vh;
  }
`;

const StyledFriendIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* height: 20%;
  background-color: var(--secondary-color); */

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    /* width: 80vw; */
    /* height: 30vh; */
    justify-content: flex-start;
  }
`;

const StyledInput = styled.input`
  /* TODO: Calculate width according to things */
  border: none;
  font-size: 3em;
  text-align: ${(props) => props.align};
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  @media only screen and (max-width: 768px) {
    text-align: center;
    width: 80%;
  }
`;

const StyledLabel = styled.label`
  color: #ffffff;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: white 0px 0px 2px;
`;

const StartPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40em;
  margin: auto;
  width: 60vw;
  background-color: var(--primary-color);
  -webkit-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.75);
  @media only screen and (max-width: 768px) {
    height: 100vh;
    width: 100vw;
  }
  /* background: linear-gradient(
    to right,
    transparent 0%,
    transparent 10%,
    var(--primary-color) 10%,
    var(--primary-color) 90%,
    transparent 90%,
    transparent 100%
  ); */
`;

const StyledCallContainer = styled.div`
  margin: auto;
  font-weight: bold;
`;

const StyledCallButton = styled.button`
  padding: 1em;
  background-color: var(--secondary-color);
  margin: 0.1em;
`;

const StartGamePage = ({ startCall, clientId }) => {
  const [friendID, setFriendID] = useState("");

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  const greetings = [
    "Hi grandma!",
    "Hei mormor!",
    "Hei bestemor!",
    "Hei farmor!",
    "Hola abuela",
    "Hé grand-mère!",
    "Hey Oma!",
    "Obaasan!",
    "Hej bedstemor!",
  ];

  return (
    <div className="container main-window">
      <h1 style={{ fontSize: "3em" }}>
        {greetings[Math.floor(Math.random() * greetings.length)]}
      </h1>
      <StartPageContainer>
        <StyledIdContainer>
          <StyledLabel>Din identifikator</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            value={clientId}
            readOnly
            align={"center"}
            // width={clientId.toString().length}
          />
        </StyledIdContainer>

        <StyledFriendIdContainer>
          <StyledLabel>Hvem skal du ringe?</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            spellCheck={false}
            placeholder="Bestemors id"
            // width={friendID.toString().length}
            onChange={(event) => {
              setFriendID(event.target.value);
            }}
          />
        </StyledFriendIdContainer>
        <StyledCallContainer>
          <StyledCallButton
            type="button"
            className=" fa fa-video-camera fa-3x"
            onClick={callWithVideo(true)}
          >
            <FontAwesomeIcon icon={faVideo} />
          </StyledCallButton>
          <StyledCallButton
            type="button"
            className=" fa fa-phone fa-3x"
            onClick={callWithVideo(false)}
          >
            <FontAwesomeIcon icon={faPhone} />
          </StyledCallButton>
        </StyledCallContainer>
      </StartPageContainer>
    </div>
  );
};

StartGamePage.propTypes = {
  clientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  startCall: PropTypes.func.isRequired,
};

export default StartGamePage;
