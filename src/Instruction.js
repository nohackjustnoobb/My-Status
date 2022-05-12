import React from "react";

import "./Instruction.css";

const instructionContent = [
  { img: require("./pwa_instruction/1.png"), text: "Click Share Icon" },
  { img: require("./pwa_instruction/2.png"), text: "Click Add To Home Screen" },
  { img: require("./pwa_instruction/3.png"), text: "Clcik Add Button" },
];

class Instruction extends React.Component {
  constructor(props) {
    super(props);
    this.state = { step: 0 };
  }

  render() {
    return (
      <div id="content">
        <h2>Turn this website to an app!</h2>{" "}
        <img
          id="instruction"
          src={instructionContent[this.state.step].img}
          alt={`step${this.state.step + 1}`}
        />
        <div>
          <h2>Step {this.state.step + 1}</h2>

          <h4>{instructionContent[this.state.step].text}</h4>
        </div>
      </div>
    );
  }
}

export default Instruction;
