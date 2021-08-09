import './App.css';
import {Route, Switch} from "react-router-dom";
import Landing from "./Landing";
import Home from "./AuthenticatedHome";
import {useState} from "react";

function App() {
    const [name, setName] = useState(null);

    return (

        <Switch>
            <Route exact path="/">
                <Landing setName={setName}/>
            </Route>
            <Route path="/home">
                <Home name={name}/>
            </Route>
        </Switch>
    );
}

export default App;
