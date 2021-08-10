import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import join from 'lodash/join';
import values from "lodash/values";
import {findIndex, has} from "lodash";
import Winwheel from "./Winwheel";
import {Button, Col, Form, Modal, Nav, Row} from "react-bootstrap";
import {useWindowSize} from "react-use";
import Confetti from 'react-confetti';
import {IDS, MATCHES} from "./constants";

const COLOURS = [
    '#ffff99', '#ffdb99', '#f3c6a5', '#ff9999', '#ffb3bf', '#ff99ff', '#cda5f3', '#9999ff', '#99ff99',
];

const SEGMENTS = MATCHES.map((mapping, idx) => {
    const names = values(mapping);
    return {'strokeStyle': 'rgba(0,0,0,0)', 'fillStyle': COLOURS[idx % COLOURS.length], 'text': join(names, ', ')};
});


function AuthenticatedHome({name}) {
    const {width, height} = useWindowSize();
    const wheel = useRef();
    const [personMatch, setPersonMatch] = useState(null);
    const [show, setShow] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [hasSpun, setHasSpun] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 10);
    }, [name]);

    const onSpinFinished = useCallback(() => {
        const matchIndex = findIndex(MATCHES, mapping => has(mapping, name));
        wheel.current.segments[matchIndex + 1].fillStyle = "red";
        wheel.current.draw();
        setShow(true);
        setShowConfetti(true);
    }, [wheel, name]);

    const drawTriangle = useCallback(() => {
        let tcanvas = document.getElementById('canvas');
        let tx = tcanvas.getContext('2d');

        tx.strokeStyle = '#000000';     // Set line colour.
        tx.fillStyle = 'aqua';        // Set fill colour.
        tx.lineWidth = 1;
        tx.beginPath();                 // Begin path.
        tx.moveTo(410, 0);             // Move to initial position.
        tx.lineTo(470, 0);             // Draw lines to make the shape.
        tx.lineTo(440, 60);
        tx.lineTo(411, 0);
        tx.stroke();                    // Complete the path by stroking (draw lines).
        tx.fill();                      // Then fill with colour.

    }, []);

    useEffect(() => {
        const winwheel = new Winwheel(
            {
                'numSegments': MATCHES.length,
                'segments': SEGMENTS,
                'responsive': true,
                'animation':
                    {
                        'type': 'spinToStop',
                        'duration': 5,
                        'callbackAfter': drawTriangle,
                        'spins': 8,
                        'callbackFinished': onSpinFinished,
                    },
                'canvasId': 'canvas',
                // 'outerRadius' : 155,
                // 'centerX'     : 400,
                // 'centerY'     : 201,
            }
        );
        wheel.current = winwheel;

        drawTriangle();

    }, [drawTriangle, onSpinFinished]);

    const onSpin = () => {
        setHasSpun(true);
        const matchIndex = findIndex(MATCHES, mapping => has(mapping, name));
        const match = MATCHES[matchIndex];
        setPersonMatch(values(match)[0]);

        const angleRange = 360 / MATCHES.length;
        const targetStartAngle = Math.floor(matchIndex * angleRange) + 1;
        const targetAngleRange = Math.floor(angleRange - 1 - 1); // -1 from the start and -1 from the end
        const targetAngle = targetStartAngle + Math.floor(Math.random() * targetAngleRange);

        wheel.current.animation.stopAngle = targetAngle;
        wheel.current.startAnimation();
    };

    const sendAMessage = useMemo(() => {
        if (!personMatch) {
            return;
        }
        console.log({personMatch, length: personMatch.length});
        if (personMatch.length === 1) {
            const userId = IDS[personMatch[0]];
            return (
                <p className="text">How about sending them a <a
                    href={`slack://user?team=T12PYA736&id=${userId}`}>message</a> now?</p>
            );
        }
        // 2 persons
        const firstName = personMatch[0];
        const firstId = IDS[firstName];
        const secondName = personMatch[1];
        const secondId = IDS[secondName];
        return (
            <p className="text">How about sending{" "}
                <a href={`slack://user?team=T12PYA736&id=${firstId}`}>{firstName}</a> and{" "}
                <a href={`slack://user?team=T12PYA736&id=${secondId}`}>{secondName}</a> a message now?
            </p>
        );


    }, [personMatch]);

    return (
        <>
            <Row style={{marginTop: 20}}>
                <Col lg>
                    <h1>Welcome, {name}!</h1>
                    <div style={{marginBottom: 20}} className="text">Ready to spin the wheel?</div>
                    <div id="canvasContainer">
                        <canvas id="canvas" width={880} height={440} data-responsiveminwidth="180"
                                data-responsivescaleheight="true"
                                data-responsivemargin="20"
                        >Canvas not supported, try another browser.
                        </canvas>
                    </div>
                    <Form style={{marginTop: 20}}>
                        <Button disabled={hasSpun} variant="primary" onClick={onSpin}>Spin!</Button>
                    </Form>
                    <Modal
                        show={show}
                        onHide={() => setShow(false)}
                        aria-labelledby="example-custom-modal-styling-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-custom-modal-styling-title">
                                Congratulations
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body style={{fontSize: "1.1rem"}}>
                            {personMatch && (
                                <>
                                    <p className="text">
                                        You got: <strong>{join(personMatch, ' and ')}</strong>!
                                    </p>
                                    {sendAMessage}
                                </>
                            )}
                        </Modal.Body>
                    </Modal>
                    {showConfetti && (
                        <Confetti
                            width={width}
                            height={height}
                        />
                    )}
                </Col>
            </Row>
        </>);
}

export default AuthenticatedHome;
