import React from "react";
import { Route, Switch } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import MusicsPage from "./pages/MusicsPage";
import RecordPage from "./pages/RecordPage";

const Routes = () => {
    return (
        <Switch>
            <Route exact path="/">
                <EditorPage />
            </Route>
            <Route exact path="/musics">
                <MusicsPage />
            </Route>
            <Route exact path="/record">
                <RecordPage />
            </Route>
        </Switch>
    );
};

export default Routes;
