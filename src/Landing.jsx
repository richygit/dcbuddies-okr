import React, {useState} from 'react';
import { useHistory } from "react-router-dom";

function Landing({setName}) {

    const history = useHistory();

    const onSignInClick = () => {
        const name = document.getElementById("name").value;
        setName(name);
        history.push("/home");
    };

    return (
    <div className="App">
        <h1>Who is your buddy?</h1>
        <div>Sign in below to find out:</div>
        <input type="text" name="name" id="name" />
        <button onClick={onSignInClick}>
            Sign In
        </button>
    </div>
    );
}

export default Landing;
