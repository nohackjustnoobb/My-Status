import React from "react";

import "../node_modules/@mdi/font/css/materialdesignicons.min.css";
import "./App.css";

import { StatusList, Icon } from "./classes";

class Controller extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeout: 0,
      isShow: false,
    };
  }

  componentDidMount() {
    setInterval(() => {
      if (this.state.timeout < 3) {
        this.setState({ timeout: this.state.timeout + 1 });
      }
    }, 1000);
    document.body.onmousemove = this.resetTimeout.bind(this);
  }

  resetTimeout() {
    if (!this.state.isShow && this.state.timeout >= 3)
      this.setState({ timeout: 0 });
  }

  toggleController = () => this.setState({ isShow: !this.state.isShow });

  updateBG() {
    var file = this.bgImage.files[0];
    var element = document.getElementsByTagName("img")[0];
    if (file) {
      element.style.display = "block";
      element.src = URL.createObjectURL(file);
    } else {
      element.style.display = "none";
      this.props.forceUpdate();
    }
  }

  splitLine() {
    return (
      <li>
        <div
          style={{
            height: 2,
            borderRadius: 1,
            width: "90%",
            backgroundColor: "plum",
            opacity: 0.4,
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </li>
    );
  }

  render() {
    return (
      <React.Fragment>
        <div
          id="toggleButton"
          style={{ opacity: this.state.timeout >= 3 ? 0 : 1 }}
          onClick={() => {
            if (this.state.timeout < 3) this.toggleController();
          }}
        >
          <Icon name="mdi-menu" size={2.25} color="white" />
        </div>
        <div
          id="controller"
          style={{ display: this.state.isShow ? "flex" : "none" }}
        >
          <div
            style={{
              zIndex: -1,
              position: "fixed",
              width: "100%",
              height: "100%",
              backgroundColor: "#000",
              opacity: 0.2,
            }}
            onClick={this.toggleController.bind(this)}
          />
          <div id="options">
            <Icon
              name={"mdi-close-circle-outline"}
              size={1.5}
              color="plum"
              style={{ position: "absolute", right: 10, top: 10 }}
              onClick={this.toggleController.bind(this)}
            />
            <h3>Options</h3>
            <div
              style={{
                backgroundColor: "plum",
                height: 3,
                width: 60,
                borderRadius: 1.5,
                position: "relative",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />
            <div id="optionsContent">
              <ul>
                <li>
                  <b>Use Image:</b>
                  <br />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <input
                      ref={(bgImage) => {
                        this.bgImage = bgImage;
                      }}
                      type="file"
                      accept="image/*"
                      onChange={this.updateBG.bind(this)}
                    />
                    <button
                      onClick={() => {
                        this.bgImage.value = "";
                        this.updateBG();
                      }}
                    >
                      clear
                    </button>
                  </div>
                </li>
                <li
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <b>Use Camera: </b>
                    <input
                      type="checkbox"
                      onChange={() => this.props.toggleCamera()}
                      checked={this.props.useCamera}
                    />
                  </div>
                  <Icon
                    name="mdi-camera-flip-outline"
                    size={1}
                    style={{ marginRight: 10 }}
                    color="plum"
                    onClick={this.props.switchCamera}
                  />
                </li>
                <li>
                  <b>Fit To Srceen: </b>
                  <input
                    type="checkbox"
                    onChange={() =>
                      this.props.setState({ isFit: !this.props.isFit }, () =>
                        setTimeout(() => this.props.forceUpdate(), 100)
                      )
                    }
                    checked={this.props.isFit}
                  />
                </li>
                {this.splitLine()}
                <li>
                  <b>Position:</b>
                  <br />
                  <div
                    style={{ display: "flex", justifyContent: "space-around" }}
                  >
                    <div>
                      horizontal:{" "}
                      <select
                        value={this.props.horizontal}
                        onChange={(e) => {
                          this.props.setState({
                            horizontal: Number(e.target.value),
                          });
                          window.localStorage.setItem(
                            "horizontal",
                            e.target.value
                          );
                        }}
                      >
                        <option value={0}>Left</option>
                        <option value={1}>Center</option>
                        <option value={2}>Right</option>
                      </select>
                    </div>
                    <div>
                      vertical:{" "}
                      <select
                        value={this.props.vertical}
                        onChange={(e) => {
                          this.props.setState({
                            vertical: Number(e.target.value),
                          });
                          window.localStorage.setItem(
                            "vertical",
                            e.target.value
                          );
                        }}
                      >
                        <option value={0}>Top</option>
                        <option value={1}>Center</option>
                        <option value={2}>Bottom</option>
                      </select>
                    </div>
                  </div>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <b>
                      Size: <i>x{this.props.scale}</i>
                    </b>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Icon
                      name="mdi-magnify-minus-outline"
                      size={1.25}
                      style={{ marginRight: 5 }}
                      color={this.props.scale > 0.5 ? "plum" : "Grey"}
                      onClick={() => {
                        if (this.props.scale > 0.5) {
                          this.props.setState({
                            scale: this.props.scale - 0.25,
                          });
                          window.localStorage.setItem(
                            "scale",
                            this.props.scale - 0.25
                          );
                        }
                      }}
                    />
                    <Icon
                      name="mdi-backup-restore"
                      size={1.25}
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        var defaultScale =
                          window.innerHeight > window.innerWidth ? 0.75 : 1;
                        this.props.setState({
                          scale: defaultScale,
                        });
                        window.localStorage.setItem("scale", defaultScale);
                      }}
                    />
                    <Icon
                      name="mdi-magnify-plus-outline"
                      size={1.25}
                      color={this.props.scale < 2 ? "plum" : "Grey"}
                      onClick={() => {
                        if (this.props.scale < 2) {
                          this.props.setState({
                            scale: this.props.scale + 0.25,
                          });
                          window.localStorage.setItem(
                            "scale",
                            this.props.scale + 0.25
                          );
                        }
                      }}
                    />
                  </div>
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b>Background Color:</b>
                  <input
                    type={"color"}
                    value={this.props.backgroundColor}
                    onChange={(e) => {
                      this.props.setState({ backgroundColor: e.target.value });
                      window.localStorage.setItem(
                        "backgroundColor",
                        e.target.value
                      );
                    }}
                  />
                </li>
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <b>Background Transparency:</b>
                  <div className={"inputGroup"}>
                    <input
                      type={"range"}
                      min={0}
                      max={100}
                      value={this.props.backgroundTransparency}
                      onChange={(e) => {
                        var value = Number(e.target.value);
                        this.props.setState({
                          backgroundTransparency: value,
                        });
                        window.localStorage.setItem(
                          "backgroundTransparency",
                          value
                        );
                      }}
                    />
                    <input
                      type={"number"}
                      min={0}
                      max={100}
                      value={this.props.backgroundTransparency}
                      onChange={(e) => {
                        var value = Number(e.target.value);
                        if (value <= 100 && value >= 0) {
                          this.props.setState({
                            backgroundTransparency: value,
                          });
                          window.localStorage.setItem(
                            "backgroundTransparency",
                            value
                          );
                        }
                      }}
                    />
                  </div>
                </li>
                {this.splitLine()}
                <li
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <b>Profile:</b>{" "}
                    <input
                      value={this.props.statusList.name}
                      onChange={(e) => {
                        var newName = e.target.value;
                        if (
                          !this.props.profileName.find((v) => v === newName) &&
                          newName !== ""
                        ) {
                          this.props.changeProfileName(
                            this.props.statusList.name,
                            newName
                          );
                        }
                      }}
                      type={"text"}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <Icon
                      name={"mdi-plus"}
                      size={1.25}
                      onClick={() => this.props.createProfile()}
                    />
                    <Icon
                      name={"mdi-minus"}
                      size={1.25}
                      color={
                        this.props.profileName.length > 1 ? "plum" : "Grey"
                      }
                      onClick={() => {
                        if (this.props.profileName.length > 1) {
                          this.props.deleteProfile(this.props.statusList.name);
                        }
                      }}
                    />
                    <select
                      value={this.props.statusList.name}
                      onChange={(e) => this.props.changeProfile(e.target.value)}
                    >
                      {this.props.profileName.map((v) => (
                        <option value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </li>
                {this.splitLine()}

                <li>
                  <ul
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    {this.props.statusList.getOptionsDiv()}
                  </ul>
                </li>
                {this.splitLine()}
                <li>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <button
                      onClick={() => this.props.statusList.createStatus()}
                    >
                      New Status
                    </button>
                    <button onClick={() => this.props.statusList.clearStatus()}>
                      Clear Status
                    </button>
                  </div>
                </li>
                <li
                  style={{
                    fontSize: 12,
                    opacity: 0.5,
                    display: "flex",
                    justifyContent: "center",
                    textAlign: "center",
                  }}
                >
                  <p>
                    <a href="https://github.com/nohackjustnoobb/My-Status">
                      {process.env.REACT_APP_NAME} Ver{" "}
                      {process.env.REACT_APP_VERSION}
                    </a>
                    <br />
                    nohackjustnoobb@github.com
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.faceEnv = true;

    var statusListString = window.localStorage.getItem("StatusList");

    if (statusListString) {
      var statusListJSON = JSON.parse(statusListString);
      this.statusList = statusListJSON.map(
        (v) =>
          new StatusList(this.forceUpdate.bind(this), this.save.bind(this), v)
      );
    } else {
      this.statusList = [
        new StatusList(this.forceUpdate.bind(this), this.save.bind(this)),
      ];
    }

    var scale = Number(window.localStorage.getItem("scale"));
    var horizontal = Number(window.localStorage.getItem("horizontal"));
    var vertical = Number(window.localStorage.getItem("vertical"));
    var backgroundColor = window.localStorage.getItem("backgroundColor");
    var backgroundTransparency = Number(
      window.localStorage.getItem("backgroundTransparency")
    );

    this.state = {
      useCamera: false,
      scale: scale || window.innerHeight > window.innerWidth ? 0.75 : 1,
      // horizontal
      // 0: Left
      // 1: Center
      // 2: Right
      horizontal: horizontal || 0,
      // vertical
      // 0: Top
      // 1: Center
      // 2: Bottom
      vertical: vertical || 0,
      backgroundColor: backgroundColor || "#000000",
      backgroundTransparency: backgroundTransparency || 33,
      waitingWorker: {},
      newVersionAvailable: false,
      statusProfile: this.statusList[0],
      isFit: true,
    };
  }

  componentDidUpdate() {
    this.state.statusProfile.update();
  }

  componentDidMount() {
    document.body.onresize = () => this.forceUpdate();
    this.state.statusProfile.update();
    this.forceUpdate();
  }

  save() {
    var statusListJSON = [];
    this.statusList.forEach((v) => {
      var statusJSON = [];
      v.statusList.forEach((_) =>
        statusJSON.push({
          progress: _.progress,
          name: _.name,
          icon: _.icon,
          color: _.color,
        })
      );
      statusListJSON.push({ name: v.name, values: statusJSON });
    });
    window.localStorage.setItem("StatusList", JSON.stringify(statusListJSON));
  }

  createProfile() {
    var nameIndex = 0;

    // eslint-disable-next-line no-loop-func
    while (this.statusList.find((v) => v.name === `New Profile ${nameIndex}`)) {
      nameIndex++;
    }

    var newProfile = new StatusList(
      this.forceUpdate.bind(this),
      this.save.bind(this),
      { name: `New Profile ${nameIndex}` }
    );
    this.statusList.push(newProfile);
    this.setState({ statusProfile: newProfile });
    this.save();
  }

  deleteProfile(name) {
    this.statusList = this.statusList.filter((v) => v.name !== name);
    this.setState({
      statusProfile: this.statusList[this.statusList.length - 1],
    });
    this.save();
  }

  changeProfile(name) {
    this.setState({
      statusProfile: this.statusList.find((v) => {
        return v.name === name;
      }),
    });
  }

  changeProfileName(name, newName) {
    this.statusList.find((v) => v.name === name).name = newName;
    this.forceUpdate();
    this.save();
  }

  async useCamera() {
    if (navigator.mediaDevices.getUserMedia) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.faceEnv ? "environment" : "user" },
      });
      this.video.style.display = "block";
      if ("srcObject" in this.video) {
        this.video.srcObject = this.stream;
      } else {
        this.video.src = URL.createObjectURL(this.stream);
      }
      this.setState({ useCamera: true });
    }
  }

  async closeCamera() {
    this.video.style.display = "none";
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    this.setState({ useCamera: false });
  }

  async toggleCamera() {
    this.state.useCamera ? this.closeCamera() : this.useCamera();
    this.setState({ useCamera: !this.state.useCamera });
  }

  async switchCamera() {
    this.faceEnv = !this.faceEnv;
    this.useCamera();
  }

  render() {
    var isHorizontal = window.innerHeight > window.innerWidth;

    var root = document.getElementById("root");

    var bg = document.getElementsByTagName("img")[0];
    if (bg?.style?.display === "none") {
      bg = document.getElementsByTagName("video")[0];
    }

    var isShow = bg?.style.display !== "none";

    var offsetSize = {
      height: (root.offsetHeight - bg?.offsetHeight) / 2,
      width: (root.offsetWidth - bg?.offsetWidth) / 2,
    };

    var horizontalStyle, verticalStyle, transformOriginStyle;

    switch (this.state.horizontal) {
      case 0:
        horizontalStyle = {
          left: 20 + (this.state.isFit && isShow ? offsetSize.width : 0),
        };
        transformOriginStyle = "0%";
        break;
      case 1:
        horizontalStyle = {
          left: "50%",
          transform: "translateX(-50%)",
        };
        transformOriginStyle = "50%";
        break;
      case 2:
        horizontalStyle = {
          right: 20 + (this.state.isFit && isShow ? offsetSize.width : 0),
        };
        transformOriginStyle = "100%";
        break;
      default:
        horizontalStyle = {};
        break;
    }

    transformOriginStyle += " ";

    switch (this.state.vertical) {
      case 0:
        verticalStyle = {
          top:
            this.state.isFit && isShow
              ? offsetSize.height
              : " env(safe-area-inset-top)",
        };
        transformOriginStyle += "0%";
        break;
      case 1:
        verticalStyle = {
          top: "50%",
          transform: horizontalStyle.transform
            ? `${horizontalStyle.transform} translateY(-50%)`
            : "translateY(-50%)",
        };
        transformOriginStyle += "50%";
        break;
      case 2:
        verticalStyle = {
          bottom: 20 + (this.state.isFit && isShow ? offsetSize.height : 0),
        };
        transformOriginStyle += "100%";
        break;
      default:
        verticalStyle = {};
        break;
    }

    var positionStyle = {
      ...horizontalStyle,
      ...verticalStyle,
      ...{ transformOrigin: transformOriginStyle },
    };

    return (
      <React.Fragment>
        <img
          alt=""
          style={{
            ...(this.state.isFit
              ? { maxHeight: "100%", maxWidth: "100%" }
              : isHorizontal
              ? { height: "100%" }
              : { width: "100%" }),
            ...{ display: "none" },
          }}
          onLoad={() => this.forceUpdate()}
        />
        <video
          ref={(video) => {
            this.video = video;
          }}
          onLoadedData={() => this.forceUpdate()}
          controls={false}
          autoPlay
          playsInline
          style={{
            ...(this.state.isFit
              ? { maxHeight: "100%", maxWidth: "100%" }
              : isHorizontal
              ? { height: "100%" }
              : { width: "100%" }),
            ...{ display: "none" },
          }}
        />
        <ul
          id="statusList"
          style={{
            ...positionStyle,
            ...{
              display:
                this.state.statusProfile.statusList.length === 0
                  ? "none"
                  : "block",
              transform: `${
                positionStyle.transform ? `${positionStyle.transform} ` : ""
              }scale(${this.state.scale})`,
              backgroundColor:
                this.state.backgroundColor +
                Math.floor((255 * this.state.backgroundTransparency) / 100)
                  .toString(16)
                  .padStart(2, "0"),
            },
          }}
        >
          {this.state.statusProfile.getDiv()}
        </ul>
        <Controller
          toggleCamera={this.toggleCamera.bind(this)}
          switchCamera={this.switchCamera.bind(this)}
          setState={this.setState.bind(this)}
          changeProfile={this.changeProfile.bind(this)}
          changeProfileName={this.changeProfileName.bind(this)}
          deleteProfile={this.deleteProfile.bind(this)}
          createProfile={this.createProfile.bind(this)}
          forceUpdate={this.forceUpdate.bind(this)}
          profileName={this.statusList.map((v) => v.name)}
          useCamera={this.state.useCamera}
          isFit={this.state.isFit}
          statusList={this.state.statusProfile}
          scale={this.state.scale}
          vertical={this.state.vertical}
          horizontal={this.state.horizontal}
          backgroundColor={this.state.backgroundColor}
          backgroundTransparency={this.state.backgroundTransparency}
        />
      </React.Fragment>
    );
  }
}

export default App;
export { Icon };
