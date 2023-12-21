import React from "react";
import { NavLink as Link } from "react-router-dom";

import Header from "./header";

function NotFound(props) {
    return (
        <div id="not-found">
            <Header navblocks={props.navblocks} />
            <section>404 Not Found</section>
        </div>
    );
}

export default NotFound;
