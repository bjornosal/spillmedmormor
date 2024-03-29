import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faPhone } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { InformationPopup } from "./InformationPopup";
import { cookieExists } from "../util/CookieUtil";

const StyledIdContainer = styled.div`
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media only screen and (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    font-size: 1em;
  }
`;

const StyledFriendIdContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    justify-content: flex-start;
  }
`;

const StyledInput = styled.input`
  border: none;
  border-radius: 10px;
  font-size: 3em;
  text-align: ${(props) => props.align};
  -webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
  @media only screen and (max-width: 768px) {
    text-align: center;
    width: 80%;
    font-size: 2em;
  }
`;

const StyledLabel = styled.label`
  color: #000;
  font-size: 3rem;
  font-weight: bold;
  @media only screen and (max-width: 768px) {
    font-size: 2.1em;
  }
`;

const StartPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 40em;
  margin: auto;
  width: 60vw;
  border-radius: 24px;
  background-color: var(--primary-color);
  -webkit-box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  box-shadow: 0 1px 2px 1px rgba(0, 0, 0, 0.4);
  @media only screen and (max-width: 768px) {
    height: 70vh;
    width: 90vw;
  }
`;

const StyledCallContainer = styled.div`
  margin: auto;
  font-weight: bold;
`;

const StyledCallButton = styled.button`
  padding: 1em;
  background-color: var(--secondary-color);
  margin: 0.1em;
  border: 2px solid rgba(0, 0, 0, 0.4);
  border-radius: 24px;
  box-shadow: 0px 1px 1px 2px rgba(0, 0, 0, 0.6);
  transition: 0.5s ease;

  p {
    color: #fff;
    font-weight: bold;
    font-size: 2em;
    padding: 0;
  }

  :hover {
    border: 2px solid var(--main-bg-color);
    cursor: pointer;
    box-shadow: 0px 1px 2px 2px rgba(0, 0, 0, 0.4);
    transition: 0.5s ease;
  }

  @media only screen and (max-width: 768px) {
    p {
      font-size: 1.5em;
    }
  }

  @media only screen and (min-width: 768px) {
    svg {
      font-size: 3em;
    }
  }
`;

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

const CallPage = ({ startCall, clientId }) => {
  const [friendID, setFriendID] = useState("");
  const [title, setTitle] = useState("");

  useEffect(() => {
    setTitle(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="container main-window">
      {!cookieExists("informationUnderstood") && (
        <InformationPopup open={true} />
      )}
      <h1 style={{ fontSize: "3em" }}>{title}</h1>
      <StartPageContainer>
        <StyledIdContainer>
          <StyledLabel>Din identifikator</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            value={clientId}
            readOnly
            align={"center"}
          />
        </StyledIdContainer>

        <StyledFriendIdContainer>
          <StyledLabel>Hvem skal du ringe?</StyledLabel>
          <StyledInput
            type="text"
            className="clientId"
            spellCheck={false}
            placeholder="Skriv din mormors id"
            autoCapitalize="off"
            onChange={(event) => {
              setFriendID(event.target.value);
            }}
          />
        </StyledFriendIdContainer>
        <StyledCallContainer>
          <StyledCallButton type="button" onClick={callWithVideo(true)}>
            <FontAwesomeIcon icon={faVideo} size="2x" />
            <p>Ring med video</p>
          </StyledCallButton>
          <StyledCallButton type="button" onClick={callWithVideo(false)}>
            <FontAwesomeIcon icon={faPhone} size="2x" />
            <p>Ring uten video</p>
          </StyledCallButton>
        </StyledCallContainer>
      </StartPageContainer>
    </div>
  );
};

CallPage.propTypes = {
  clientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  startCall: PropTypes.func.isRequired,
};

export default CallPage;
