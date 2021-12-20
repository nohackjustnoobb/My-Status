import React from "react";

import "./Instruction.css";

class Instruction extends React.Component {
  render() {
    return (
      <div id="content">
        <img src={require("./pwa_instruction/1.png")} alt="step1" />
        <img src={require("./pwa_instruction/2.png")} alt="step2" />
        <img src={require("./pwa_instruction/3.png")} alt="step3" />
      </div>
    );
  }
}

export default Instruction;
