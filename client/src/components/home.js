import React from "react";
import { NavLink as Link } from "react-router-dom";

import Header from "./header";

function Home(props) {
    return (
        <div id="home" style={{ backgroundColor: "#f5f5f5", padding: "20px" }}>
            <Header navblocks={props.navblocks} current={0} />
            <section style={{ marginTop: "20px" }}>
                <h2 style={{ fontSize: "24px", marginBottom: "10px" }}>Home</h2>
            </section>
        </div>
    );
}

export default Home;
