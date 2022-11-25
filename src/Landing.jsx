import React from 'react';
import {useHistory} from "react-router-dom";
import {Col, Dropdown, Row} from "react-bootstrap";
import {MATCHES} from "./constants";
import {keys} from "lodash";
import video from "./images/buddies.webm";


const NAMES = MATCHES.map(mapping => keys(mapping)[0]);

function Landing({setName, setEmail}) {

    const history = useHistory();

    const onSignInClick = (name) => {
        setName(name);
        history.push("/home");
    };

    return (
        <>
            <Row style={{marginTop: 20}}>
                <Col lg>
                    <div className="App">
                        <h1>Looking for a buddy?</h1>
                        <video src={video} width="480" autoPlay playsInline controls>
                            Sorry, your browser doesn't support embedded videos.
                        </video>
                        <div className="text" style={{marginBottom: 20}}>Tell us who you are to get started.</div>
                        <Dropdown style={{marginBottom: 30}}>
                            <Dropdown.Toggle variant="success" id="dropdown-basic">
                                Select name
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {NAMES.map(name => (
                                    <Dropdown.Item key={name} onClick={() => onSignInClick(name)}>{name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </Col>
            </Row>
        </>
    );
}

export default Landing;
