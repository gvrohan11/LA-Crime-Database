import React from "react";

import Header from "./header";

// CSS
import "./report-crime.css"

class ReportCrime extends React.Component {
  constructor(props) {
    super(props);
    this.infoRefs = {
      dateocc: React.createRef(),
      location: React.createRef(),
      crime: React.createRef(),
      description: React.createRef(),
      fname: React.createRef(),
      lname: React.createRef(),
      phone: React.createRef(),
      email: React.createRef(),
    };
  }

  state = {
    character: {}
  }

  componentDidMount() {
    fetch("http://localhost:3001/reportCrime").then(res => console.log(res.json()))
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log("HEY");
    let info = {};
    Object.entries(this.infoRefs).forEach(([key, ref]) => {
      info[key] = ref.current.value;
    });
    console.log(JSON.stringify(info));
    fetch("http://localhost:3001/report", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(info),
    });
  }

  render() {
    return (
      <div id="report-crime">
        <Header navblocks={this.props.navblocks} current={3} />
        <form className="report-form" onSubmit={e => this.handleSubmit(e)} >
          <label className="form-title">Crime Report Form</label>
          <div>
            <label className="form-subtitle">Crime information</label>
            <input
              className="input" name="dateocc"
              ref={this.infoRefs.dateocc} placeholder="Date occurred"
            />
            <input
              className="input" name="location"
              ref={this.infoRefs.location} placeholder="Location"
            />
            <input
              className="input" name="crime"
              ref={this.infoRefs.crime} placeholder="Crime type"
            />
            <textarea
              className="description" name="description"
              ref={this.infoRefs.description} placeholder="Detailed description"
            ></textarea>
            <label className="form-subtitle">Contact information</label>
            <input
              className="input" name="fname"
              ref={this.infoRefs.fname} placeholder="First name"
            ></input>
            <input
              className="input" name="lname"
              ref={this.infoRefs.lname} placeholder="Last name"
            ></input>
            <input
              className="input" name="phone"
              ref={this.infoRefs.phone} placeholder="Phone number"
            ></input>
            <input
              className="input" name="email"
              ref={this.infoRefs.email} placeholder="Email"
            ></input>
          </div>
          <button type="submit">submit</button>
        </form>
      </div>
    );
  }
}

export default ReportCrime;
