import React from "react";
import ProgressBar from "progressbar.js";

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

const icons = [
  "mdi-heart",
  "mdi-lightning-bolt",
  "mdi-food-drumstick",
  "mdi-sleep",
  "mdi-skull-crossbones",
  "mdi-water",
  "mdi-cash",
  "mdi-account-group",
  "mdi-emoticon",
  "mdi-cat",
  "mdi-castle",
  "mdi-coffee",
  "mdi-google-downasaur",
  "mdi-palette",
  "mdi-teddy-bear",
  "mdi-atom",
  "mdi-bacteria-outline",
  "mdi-badminton",
  "mdi-head-flash-outline",
  "mdi-head-heart-outline",
  "mdi-head-lightbulb-outline",
  "mdi-crown",
  "mdi-cupcake",
  "mdi-pig-variant-outline",
  "mdi-face-woman-shimmer-outline",
];

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
  constructor(forceUpdate, save, initData = {}) {
    this.forceUpdate = forceUpdate;
    this.save = save;

    this.statusList = [];
    this.name = initData.name || "Default";

    var statusJSON = initData.values;
    if (statusJSON) {
      statusJSON.forEach((v, i) =>
        this.statusList.push(new Status(i, v.progress, v.color, v.name, v.icon))
      );
    }
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

export { StatusList, Icon };
