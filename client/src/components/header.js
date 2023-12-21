import React from "react";
import { NavLink as Link } from "react-router-dom";

// CSS
import "./header.css"

function Navblock(props) {
    return (
        <Link to={props.link}>
            <div className={props.active ? "navblock active" : "navblock"}>{props.content}</div>
        </Link>
    );
}

function Header(props) {
    let navbar = props.navblocks.map((block, index) => {
        return (
            <Navblock
                key={index.toString()}
                link={block.link}
                content={block.content}
                active={index === props.current}
            />
        );
    });

    return (
        <section id="header">
            <div className="logo">
                <Link to="/"><img src={process.env.PUBLIC_URL + "/images/logo.png"} alt="logo"></img></Link>
            </div>
            <div id="navbar">{navbar}</div>
        </section>
    );
}

export default Header;
