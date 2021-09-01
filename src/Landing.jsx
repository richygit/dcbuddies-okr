import React from 'react';
import {useHistory} from "react-router-dom";
import {Button, Col, Dropdown, Nav, Row} from "react-bootstrap";
import {MATCHES} from "./constants";
import {keys} from "lodash";
import main_img from './images/okr-edition.gif';


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
                        <h1>Looking for an OKR buddy?</h1>
                        <img style={{margin: "30px 0", width: "100%", maxWidth: 480}} src={main_img} alt="buddies" />
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
