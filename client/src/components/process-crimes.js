import React from "react";
import { Link } from "react-router-dom";
import Header from "./header";

class ProcessCrimes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      crimes: [],
    }
    /* Each crime object should have the following format:
     * {
     *   reportid: int
     *   daterpt: string
     *   dateocc: string
     *   location: string
     *   crime: string
     *   description: string
     *   fname: string
     *   lname: string
     *   phone: string
     *   email: string
     * }
     */
  }

  componentDidMount() {
    fetch(process.env.REACT_APP_SERVER_URL + "/reportCrime")
      .then(data => data.json())
      .then(data => { console.log(data); this.setState({ crimes: data, });});
  }

  render() {
    let crimes = this.state.crimes.map((crime, index) => {
      return (
        <tr key={index}>
          <td><Link to={`/admin/process-crime/${crime.ReportID}`}>{crime.ReportID}</Link></td>
          <td>{crime.DATE_OCC}</td>
          <td>{crime.LOCATION}</td>
          <td>{crime.Crime}</td>
          <td>{crime.Description}</td>
          <td>{crime.Fname}</td>
          <td>{crime.Lname}</td>
          <td>{crime.Phone}</td>
          <td>{crime.Email}</td>
        </tr>
      )
    });
    return (
      <div id="process-crimes">
        <Header navblocks={this.props.navblocks} current={1} />
        <section>List of crimes reported</section>
        <div>
          <table>
            <thead>
              <tr>
                <td>Report ID</td>
                <td>Date reported</td>
                <td>Location</td>
                <td>Crime type</td>
                <td>Description</td>{/* This should be a short description within one line. Use '...' if content too long */}
                <td>Fname</td>
                <td>Lname</td>
                <td>Phone</td>
                <td>Email</td>
              </tr>
            </thead>
            <tbody>
              {crimes}           
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ProcessCrimes;

/*
{
  this.state.crimes.map((crime) => {
    console.log(crime)
    return (
      <div style={{ display: "flex"}}>
        <td>{crime.ReportID}</td>
        <td>{crime.DATE_OCC}</td>
        <td>{crime.LOCATION}</td>
        <td>{crime.Crime}</td>
        <td>{crime.description}</td>
        <td>{crime.Fname}</td>
        <td>{crime.Lname}</td>
        <td>{crime.Phone}</td>
        <td>{crime.Email}</td>
        <td>{crime.User}</td>
      </div>
    )
  })
}
*/