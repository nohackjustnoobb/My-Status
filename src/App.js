import "./App.css";
import React from "react";
import Icon from "@mdi/react";
import {
  mdiMenu,
  mdiCloseCircleOutline,
  mdiCameraFlipOutline,
  mdiHeart,
  mdiLightningBolt,
  mdiFoodDrumstick,
  mdiSleep,
  mdiSkullCrossbones,
  mdiWater,
  mdiCash,
  mdiAccountGroup,
  mdiEmoticon,
} from "@mdi/js";
import ProgressBar from "progressbar.js";

const icons = {
  Heart: mdiHeart,
  "Lightning Bolt": mdiLightningBolt,
  "Food Drumstick": mdiFoodDrumstick,
  Sleep: mdiSleep,
  "Skull Crossbones": mdiSkullCrossbones,
  Water: mdiWater,
  Cash: mdiCash,
  "Account Group": mdiAccountGroup,
  Emoticon: mdiEmoticon,
};

var roundX = function (val, precision) {
  return (
    Math.round(Math.round(val * Math.pow(10, (precision || 0) + 1)) / 10) /
    Math.pow(10, precision || 0)
  );
};

class Status {
  constructor(
    id,
    progress = roundX(Math.random(), 2),
    color = "#" + (((1 << 24) * Math.random()) | 0).toString(16),
    name = "New Status",
    icon = Object.keys(icons)[
      Math.floor(Math.random() * Object.keys(icons).length)
    ]
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
          path={icons[v.icon]}
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
            Icon:
            <div className={"inputGroup"}>
              <Icon
                path={icons[v.icon]}
                size={1.5}
                style={{ marginRight: 5 }}
              />
              <select
                onChange={(e) => {
                  v.icon = e.target.value;
                  this.save();
                  this.forceUpdate();
                }}
              >
                {Object.keys(icons).map((v) => (
                  <option value={v}>{v}</option>
                ))}
              </select>
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
          <Icon path={mdiMenu} size={2.25} color="white" />
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
              path={mdiCloseCircleOutline}
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
                  Background Image:
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
                    Use Camera:{" "}
                    <input
                      type="checkbox"
                      onChange={() => this.props.toggleCamera()}
                      checked={this.props.useCamera}
                    />
                  </div>
                  <Icon
                    path={mdiCameraFlipOutline}
                    size={1}
                    color="plum"
                    onClick={this.props.switchCamera}
                  />
                </li>
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
                      My-Status Ver 0.1.1
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
    this.state = {
      useCamera: false,
    };
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

  componentDidUpdate() {
    this.statusList.update();
  }

  componentDidMount() {
    this.statusList.update();
  }

  render() {
    var isHorizontal = window.innerHeight > window.innerWidth;

    return (
      <div>
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
            display: this.statusList.statusList.length === 0 ? "none" : "block",
            transform: `scale(${isHorizontal ? 0.7 : 1})`,
          }}
        >
          {this.statusList.getDiv()}
        </ul>
        <Controller
          useCamera={this.state.useCamera}
          toggleCamera={this.toggleCamera.bind(this)}
          switchCamera={this.switchCamera.bind(this)}
          statusList={this.statusList}
        />
      </div>
    );
  }
}

export default App;
