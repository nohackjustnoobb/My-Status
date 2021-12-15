import "./App.css";
import React from "react";
import ProgressBar from "progressbar.js";
import "../node_modules/@mdi/font/css/materialdesignicons.min.css";
import * as serviceWorker from "./serviceWorkerRegistration";

import icons from "./icons";

var roundX = function (val, precision) {
  return (
    Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
    Math.pow(10, precision || 0)
  );
};

function upperLetter(str) {
  const arr = str.split(" ");
  for (var i = 0; i < arr.length; i++) {
    arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }
  return arr.join(" ");
}

function Icon({ name, size = 1, color, onClick, style = {} }) {
  return (
    <span
      className={`mdi ${name}`}
      onClick={onClick}
      style={{
        ...{
          fontSize: 24 * size,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
        ...(color ? { color: color } : {}),
        ...style,
      }}
    />
  );
}

class Status {
  constructor(
    id,
    progress = roundX(Math.random(), 2),
    color = "#" + (((1 << 24) * Math.random()) | 0).toString(16),
    name = "New Status",
    icon = icons[Math.floor(Math.random() * icons.length)]
  ) {
    this.id = id;
    this.progress = progress;
    this.name = name;
    this.icon = icon;
    this.color = color;
  }

  updateBar() {
    document.getElementById(`s${this.id}`).innerHTML = "";

    this.line = new ProgressBar.Line(`#s${this.id}`, {
      strokeWidth: 4,
      color: this.color,
      trailColor: "#eee",
      trailWidth: 0,
      svgStyle: { width: "100%", height: 12 },
    });
    this.line.set(this.progress);
  }
}

class StatusList {
  constructor(forceUpdate) {
    this.forceUpdate = forceUpdate;
    this.statusList = [];

    var statusJSON = JSON.parse(window.localStorage.getItem("status"));
    if (statusJSON) {
      statusJSON.forEach((v, i) =>
        this.statusList.push(new Status(i, v.progress, v.color, v.name, v.icon))
      );
    }
  }

  save() {
    var statusJSON = [];
    this.statusList.forEach((v) =>
      statusJSON.push({
        progress: v.progress,
        name: v.name,
        icon: v.icon,
        color: v.color,
      })
    );
    window.localStorage.setItem("status", JSON.stringify(statusJSON));
  }

  addStatus(status) {
    if (!this.statusList.find((v) => v.id === status.id)) {
      this.statusList.push(status);
    }
  }

  removeStatus(ID) {
    this.statusList = this.statusList.filter((v) => v.id !== ID);
    this.save();
  }

  createStatus() {
    var id = this.statusList.length;
    // eslint-disable-next-line no-loop-func
    while (this.statusList.find((v) => v.id === id)) {
      id++;
    }
    var newStatus = new Status(id);
    this.addStatus(newStatus);
    this.forceUpdate(() => newStatus.updateBar());
    this.save();
  }

  clearStatus() {
    this.statusList = [];
    this.forceUpdate();
  }

  getDiv() {
    return this.statusList.map((v) => (
      <li style={{ display: "flex" }}>
        <Icon
          name={v.icon}
          size={1.5}
          color={v.color}
          style={{ opacity: 0.8 }}
        />
        <div style={{ marginLeft: 10 }}>
          <h4 style={{ color: v.color }}>{v.name}</h4>
          <div id={`s${v.id}`} style={{ opacity: 0.6 }} />
        </div>
      </li>
    ));
  }

  update() {
    this.statusList.forEach((v) => v.updateBar());
  }

  getOptionsDiv() {
    return this.statusList.map((v) => (
      <li style={{ width: "100%" }}>
        <div className={"inputGroup"} style={{ fontWeight: "bold" }}>
          #{v.id}
          <input
            type={"text"}
            value={v.name}
            onChange={(e) => {
              v.name = e.target.value;
              this.save();
              this.forceUpdate();
            }}
          />
        </div>
        <div style={{ fontSize: 16 }}>
          <div className={"inputGroup"}>
            Percentage:
            <div className={"inputGroup"}>
              <input
                type={"range"}
                min={0}
                max={100}
                value={v.progress * 100}
                onChange={(e) => {
                  v.progress = Number(e.target.value) / 100;
                  this.save();
                  this.forceUpdate();
                }}
              />
              <input
                type={"number"}
                min={0}
                max={100}
                value={v.progress * 100}
                onChange={(e) => {
                  var value = Number(e.target.value);
                  v.progress =
                    (value > 100 ? 100 : value < 0 ? 0 : value) / 100;
                  this.save();
                  this.forceUpdate();
                }}
              />
            </div>
          </div>
          <div className={"inputGroup"}>
            Color:
            <input
              type={"color"}
              value={v.color}
              onChange={(e) => {
                v.color = e.target.value;
                this.save();
                this.forceUpdate();
              }}
            />
          </div>
          <div className={"inputGroup"}>
            <div className={"inputGroup"}>
              Icon: <Icon name={v.icon} size={1.5} style={{ marginRight: 5 }} />
            </div>
            <div className={"inputGroup"}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <input
                  value={v.icon}
                  onChange={(e) => {
                    v.icon = e.target.value;
                    this.save();
                    this.forceUpdate();
                  }}
                />
                <select
                  value={icons.find((e) => e === v.icon) ? v.icon : "other"}
                  onChange={(e) => {
                    var value = e.target.value;

                    if (value !== "other") {
                      v.icon = value;
                      this.save();
                      this.forceUpdate();
                    } else {
                      alert(
                        'Visit https://pictogrammers.github.io/@mdi/font/6.5.95/ for more icon.\n\nPaste the icon name at the above input.\n(Icon name should like "mdi-icon-name")'
                      );
                    }
                  }}
                >
                  {icons.map((v) => (
                    <option value={v}>
                      {upperLetter(v.replaceAll("-", " ")).slice(4)}
                    </option>
                  ))}
                  <option value={"other"}>Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button
          style={{
            position: "relative",
            left: "50%",
            transform: "translateX(-50%)",
          }}
          onClick={() => {
            this.removeStatus(v.id);
            this.forceUpdate();
          }}
        >
          Remove
        </button>
      </li>
    ));
  }
}

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
    document.getElementsByTagName("body")[0].onmousemove =
      this.resetTimeout.bind(this);
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
          <div
            style={{
              position: "relative",
              backgroundColor: "#fff",
              maxWidth: 500,
              maxHeight: 700,
              width: "80%",
              height: "80%",
              borderRadius: 20,
              padding: 20,
            }}
          >
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
                    <b>Size: x{this.props.scale}</b>
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
    this.statusList = new StatusList(this.forceUpdate.bind(this));
    var scale = Number(window.localStorage.getItem("scale"));
    var horizontal = Number(window.localStorage.getItem("horizontal"));
    var vertical = Number(window.localStorage.getItem("vertical"));
    var backgroundColor = window.localStorage.getItem("backgroundColor");
    var backgroundTransparency = Number(
      window.localStorage.getItem("backgroundTransparency")
    );

    this.state = {
      useCamera: false,
      scale: scale ? scale : window.innerHeight > window.innerWidth ? 0.75 : 1,
      // horizontal
      // 0: Left
      // 1: Center
      // 2: Right
      horizontal: horizontal ? horizontal : 0,
      // vertical
      // 0: Top
      // 1: Center
      // 2: Bottom
      vertical: vertical ? vertical : 0,
      backgroundColor: backgroundColor ? backgroundColor : "#000000",
      backgroundTransparency: backgroundTransparency
        ? backgroundTransparency
        : 33,
      waitingWorker: {},
      newVersionAvailable: false,
    };
  }

  componentDidUpdate() {
    this.statusList.update();
  }

  componentDidMount() {
    this.statusList.update();
  }

  async useCamera() {
    if (navigator.mediaDevices.getUserMedia) {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.faceEnv ? "environment" : "user" },
      });
      this.video.style.display = "block";
      this.setState({ useCamera: true });
      if ("srcObject" in this.video) {
        this.video.srcObject = this.stream;
      } else {
        this.video.src = URL.createObjectURL(this.stream);
      }
    }
  }

  async closeCamera() {
    this.video.style.display = "none";
    this.setState({ useCamera: false });
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
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

    var horizontalStyle, verticalStyle, transformOriginStyle;

    switch (this.state.horizontal) {
      case 0:
        horizontalStyle = { left: 20 };
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
        horizontalStyle = { right: 20 };
        transformOriginStyle = "100%";
        break;
      default:
        horizontalStyle = {};
        break;
    }

    transformOriginStyle += " ";

    switch (this.state.vertical) {
      case 0:
        verticalStyle = { top: "env(safe-area-inset-top)" };
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
        verticalStyle = { bottom: 20 };
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
        <img alt="" style={{ height: "100%" }} />
        <video
          ref={(video) => {
            this.video = video;
          }}
          controls={false}
          autoPlay
          playsInline
          style={isHorizontal ? { height: "100%" } : { width: "100%" }}
        />
        <ul
          id="statusList"
          style={{
            ...positionStyle,
            ...{
              display:
                this.statusList.statusList.length === 0 ? "none" : "block",
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
          {this.statusList.getDiv()}
        </ul>
        <Controller
          useCamera={this.state.useCamera}
          toggleCamera={this.toggleCamera.bind(this)}
          switchCamera={this.switchCamera.bind(this)}
          statusList={this.statusList}
          setState={this.setState.bind(this)}
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
