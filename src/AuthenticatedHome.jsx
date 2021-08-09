import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import join from 'lodash/join';
import values from "lodash/values";
import {findIndex, has} from "lodash";
import Winwheel from "./Winwheel";
import {Button, Modal} from "react-bootstrap";

const MATCHES = [
    {'Ben': ['Caitlin',]},
    {'Caitlin': ['Ben',]},
    {'Daragh': ['Rich',]},
    {'Gillian': ['Jonathan',]},
    {'Jess': ['Poppy',]},
    {'Johanna': ['Katherine', 'Jordan']},
    {'Jonathan': ['Gillian',]},
    {'Katherine': ['Johanna', 'Jordan',]},
    {'Liam': ['Marco',]},
    {'Marco': ['Liam',]},
    {'Poppy': ['Jess',]},
    {'Rich': ['Daragh',]},
    {'Dan': ['Ali',]},
    {'Ali': ['Dan',]},
    {'Jordan': ['Poppy', 'Johanna',]},
];

const COLOURS = [
    '#ffff99', '#ffdb99', '#f3c6a5', '#ff9999', '#ffb3bf', '#ff99ff', '#cda5f3', '#9999ff', '#99ff99',
];

const SEGMENTS = MATCHES.map((mapping, idx) => {
    const names = values(mapping);
    return {'strokeStyle': 'rgba(0,0,0,0)', 'fillStyle': COLOURS[idx % COLOURS.length], 'text': join(names, ', ')};
});


function AuthenticatedHome({name}) {
    const wheel = useRef();
    const [personMatch, setPersonMatch] = useState(null);
    const [show, setShow] = useState(false);

    const onSpinFinished = useCallback(() => {
        setShow(true);
    }, []);

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

    }, [drawTriangle]);

    const onSpin = () => {
        const matchIndex = findIndex(MATCHES, mapping => has(mapping, name));
        const match = MATCHES[matchIndex];
        setPersonMatch(values(match).join(' and '));

        const angleRange = 360 / MATCHES.length;
        const targetStartAngle = Math.floor(matchIndex * angleRange) + 1;
        const targetAngleRange = Math.floor(angleRange - 1 - 1); // -1 from the start and -1 from the end
        const targetAngle = targetStartAngle + Math.floor(Math.random() * targetAngleRange);

        wheel.current.animation.stopAngle = targetAngle;
        wheel.current.startAnimation();
    };

    return (<><h1>Authenticated home, {name}!</h1>
        <div id="canvasContainer">
            <canvas id="canvas" width={880} height={440} data-responsiveMinWidth="180"
                    data-responsiveScaleHeight="true"
                    data-responsiveMargin="50"
            >Canvas not supported, try another browser.
            </canvas>
        </div>
        <Button variant="primary" onClick={onSpin}>Spin!</Button>

        <Modal
            show={show}
            onHide={() => setShow(false)}
            aria-labelledby="example-custom-modal-styling-title"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-custom-modal-styling-title">
                    Congratulations!
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    You got {personMatch}!
                </p>
            </Modal.Body>
        </Modal>
    </>);
}

export default AuthenticatedHome;
