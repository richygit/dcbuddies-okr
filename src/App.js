import './App.css';
import {Route, Switch} from "react-router-dom";
import Landing from "./Landing";
import Home from "./AuthenticatedHome";
import {useState} from "react";
import {Container} from "react-bootstrap";

function App() {
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);

    return (
        <Container>
            <Switch>
                <Route exact path="/">
                    <Landing setName={setName} setEmail={setEmail}/>
                </Route>
                <Route path="/home">
                    <Home name={name} email={email}/>
                </Route>
            </Switch>
        </Container>
    );
}

export default App;
