import React from "react";
import Header from "./header";

class ADQ1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weaponData: [],
      premisData: [],
      premisCount: [],
      inputData: "",
      inputData2: "",
      inputWeapon: "",
      inputMaxAge: "",
    }
    /* Each crime object should have the following format:
     * {
     *   reportid: int
     *   daterpt: string
     *   
     * }
     */
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log(JSON.stringify(this.state.inputData));
    fetch("http://localhost:3001/weaponsData", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({inputValue: this.state.inputData}),
    }).then(data => data.json())
      .then(data => { console.log(data); this.setState({ weaponData: data, });});
  }

  handleSubmit2(event) {
    event.preventDefault();
    console.log(JSON.stringify(this.state.inputData2));
    fetch("http://localhost:3001/premisData", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({inputValue: this.state.inputData2}),
    }).then(data => data.json())
      .then(data => { console.log(data); this.setState({ premisData: data, });});
  }

  handleSubmit3(event) {
    event.preventDefault();
    console.log(this.state.inputWeapon, this.state.inputMaxAge);
    fetch("http://localhost:3001/procpremis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        weapon: parseInt(this.state.inputWeapon),
        maxAge: parseInt(this.state.inputMaxAge),
      }),
    })
      .then(data => data.json())
      .then(data => { console.log(data); this.setState({ premisCount: data, });});
  }

  render() {
    return (
    <div>
      <div id="process-crimes">
        <Header navblocks={this.props.navblocks} current={1} />
        <div style={{display: "flex", justifyContent: "space-around"}}>
          <div>
              <section><h1>Premis Data by Race</h1></section>
              <br/>
              <form onSubmit={ e => this.handleSubmit2(e) }>
                <input type="text" onChange={(e) => {this.setState({ inputData2: e.target.value })}}></input>
                <button>Race</button>
              </form>
              <div>
              <table>
                <thead>
                <tr>
                  <td>Premis</td>
                  <td>Count</td>
                </tr>
                </thead>
                <tbody>
                  {
                    this.state.premisData.map((premis) => {
                      console.log(premis)
                      return (
                      <tr>
                        <td>{premis.Premis_Desc}</td>
                        <td>{premis.count}</td>
                      </tr>
                      )
                    })
                  }
                </tbody>
              </table>
              </div>
          </div>
          <div>
            <section><h1>Weapon Data</h1></section>
            <br/>
            <form onSubmit={ e => this.handleSubmit(e) }>
              <input type="text" onChange={(e) => {this.setState({ inputData: e.target.value })}}></input>
              <button>Enter Area</button>
            </form>
            <div>
            <table>
              <thead>
              <tr>
                <td>Weapon</td>
                <td>Percentage</td>
              </tr>
              </thead>
              <tbody>
                {
                  this.state.weaponData.map((weapon) => {
                    console.log(weapon)
                    return (
                      <tr>
                        <td>{weapon.Weapon_Desc}</td>
                        <td>{weapon.percentage}</td>
                      </tr>
                    )
                  })
                }      
              </tbody>
            </table>
            </div>
          </div>
          <div>
            <section><h1>Premis Data by Weapon</h1></section>
            <br/>
            <form onSubmit={ e => this.handleSubmit3(e) }>
              <input
                type="text" placeholder="Weapon code"
                onChange={(e) => {this.setState({ inputWeapon: e.target.value })}}
              ></input>
              <input
                type="text" placeholder="Max age"
                onChange={(e) => {this.setState({ inputMaxAge: e.target.value })}}
              ></input>
              <button>Submit</button>
            </form>
            <div>
            <table>
              <thead>
              <tr>
                <td>Premis</td>
                <td>Count</td>
              </tr>
              </thead>
              <tbody>
                {
                  this.state.premisCount.map((weapon) => {
                    console.log(weapon)
                    return (
                      <tr>
                        <td>{weapon.Premis_Desc}</td>
                        <td>{weapon.Num_Crimes}</td>
                      </tr>
                    )
                  })
                }      
              </tbody>
            </table>
            </div>
          </div>
        </div>   
      </div>       
    </div>
    );
  }
}

export default ADQ1;

/*
{
    this.state.weaponData.map((weapon) => {
        console.log(weapon)
        return (
        <tr>
            <td>{weapon.Weapon_Desc}</td>
            <td>{weapon.percentage}</td>
        </tr>
        )
    })
} 
*/