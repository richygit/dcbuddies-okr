import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import join from 'lodash/join';
import values from "lodash/values";
import {findIndex, has} from "lodash";
import Winwheel from "./Winwheel";
import "./AuthenticatedHome.jsx.scss";

const MATCHES = [
    {'ben': ['caitlin',]},
    {'caitlin': ['ben',]},
    {'daragh': ['rich',]},
    {'gillian': ['jonathan',]},
    {'jess': ['poppy',]},
    {'johanna': ['katherine', 'jordan']},
    {'jonathan': ['gillian',]},
    {'katherine': ['johanna', 'jordan',]},
    {'liam': ['marco',]},
    {'marco': ['liam',]},
    {'poppy': ['jess',]},
    {'rich': ['daragh',]},
    {'dan': ['ali',]},
    {'ali': ['dan',]},
    {'jordan': ['poppy', 'johanna',]},
];

const SEGMENTS = MATCHES.map(mapping => {
    const names = values(mapping);
    return {'fillStyle': '#eae56f', 'text': join(names, ', ')};
});


function AuthenticatedHome({name}) {
    const wheel = useRef();

    const drawTriangle = useCallback(() => {
        let tcanvas = document.getElementById('canvas');
        let tx = tcanvas.getContext('2d');

        tx.strokeStyle = '#000000';     // Set line colour.
        tx.fillStyle   = 'aqua';        // Set fill colour.
        tx.lineWidth   = 1;
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
        <button onClick={onSpin}>Spin!</button>
    </>);
}

export default AuthenticatedHome;
