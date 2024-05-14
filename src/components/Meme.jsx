import { useState, useRef, useEffect } from "react";

import bin from "../assets/icon/bin.png";
import camera from "../assets/icon/camera.png";
import addTextIcon from "../assets/icon/text.png";
import hrLine from "../assets/icon/hrline.png";
import vrLine from "../assets/icon/vrline.png";

import meme from "../assets/icon/meme.png";
import inserImage from "../assets/icon/image.png";
import fillColor from "../assets/icon/bg-color.png";

import ColorPicker from "./BackgroundColor";
import MemeImage from "./MemeImage";
import AddText from "./AddText";

const Meme = () => {
  let canvas = useRef(null);

  let [objects, setObjects] = useState([]);

  let handleDelete = (e) => {
    e.preventDefault();
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    window.location.reload();
  };

  let handleSave = (e) => {
    e.preventDefault();

    const canvas = document.getElementById("canvas");

    let image = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");

    var link = document.createElement("a");

    link.href = image;

    link.download = `image.png`;

    link.click();
  };

  const [isOpen, setIsOpen] = useState(false);

  let toggleBackgroundColor = () => {
    setIsOpen(!isOpen);
  };

  const [openMeme, setOpenMeme] = useState(true);
  const [openAddText, setOpenAddText] = useState(false);

  let togglePopup = () => {
    setOpenMeme(!openMeme);
    setOpenAddText(false);
  };

  const inputPopUp = () => {
    setOpenAddText(!openAddText);
    setOpenMeme(false);
  };

  const clickInsertImage = (e) => {
    e.preventDefault();
    document.getElementById("insertImage").click();
  };

  let addHrLine = (e) => {
    e.preventDefault();
    setObjects([
      ...objects,
      {
        type: "hrline",
        x: 0,
        y: canvas.current.height / 2,
        w: canvas.current.width,
        h: 5,
        dragging: false,
      },
    ]);
  };

  let addVrLine = (e) => {
    e.preventDefault();
    setObjects([
      ...objects,
      {
        type: "vrline",
        x: canvas.current.width / 2,
        y: 0,
        w: 5,
        h: canvas.current.height,
        dragging: false,
      },
    ]);
  };

  let addImage = (e) => {
    e.preventDefault();

    setObjects([
      ...objects,
      {
        type: "image",
        image: URL.createObjectURL(e.target.files[0]),
        x: 50,
        y: 50,
        w: 200,
        h: 210,
        dragging: false,
      },
    ]);
  };

  let addText = (e) => {
    e.preventDefault();

    setObjects([
      ...objects,
      {
        type: "text",
        text: e.target.memetext.value,
        x: 100,
        y: 150,
        w: 100,
        h: 100,
        dragging: false,
        style: "",
        color: "black",
        fontSize: 36,
        fontFamily: "serif",
      },
    ]);
  };

  let [dragok, setDragok] = useState(false);

  let [startX, setStartX] = useState(0);
  let [startY, setStartY] = useState(0);

  let handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let mx = parseInt(e.pageX - e.target.offsetLeft);
    let my = parseInt(e.pageY - e.target.offsetTop);

    setDragok(false);

    for (let i = 0; i < objects.length; i++) {
      let r = objects[i];

      if (r.type === "text") {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");

        let textWidth = ctx.measureText(r.text).width;
        let textHeight = r.fontSize;

        if (
          mx >= r.x &&
          mx <= r.x + textWidth &&
          my >= r.y - textHeight &&
          my <= r.y
        ) {
          setDragok(true);
          r.dragging = true;
        }
      } else if (r.type === "image") {
        if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
          setDragok(true);
          r.dragging = true;
        }
      } else if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
        setDragok(true);
        r.dragging = true;
      }
    }

    setStartX(mx);
    setStartY(my);
  };

  let handleMouseUp = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragok(false);

    for (let i = 0; i < objects.length; i++) {
      objects[i].dragging = false;
    }
  };

  let handleMouseMove = (e) => {
    if (dragok) {
      e.preventDefault();
      e.stopPropagation();

      let mx = parseInt(e.pageX - e.target.offsetLeft);
      let my = parseInt(e.pageY - e.target.offsetTop);

      let dx = mx - startX;
      let dy = my - startY;

      for (let i = 0; i < objects.length; i++) {
        let r = objects[i];

        if (r.dragging && r.type === "image") {
          r.x = mx - r.w / 2;
          r.y = my - r.h / 2;
        }
        if (r.dragging) {
          r.x += dx;
          r.y += dy;
        }

        draw();
      }

      setStartX(mx);
      setStartY(my);
    }
  };

  let [selectedColor, setSelectedColor] = useState("#ffffff");

  // Change Backgound Color from the color palette 
  let handleBgColor = (color) => {
    setSelectedColor(color);
  };

  useEffect(() => {
    draw();
  }, [objects, selectedColor]);

  console.log(objects);

  let clearCanvas = () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  let draw = () => {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    clearCanvas();

    for (let i = 0; i < objects.length; i++) {
      let obj = objects[i];

      if (obj.type === "text") {
        ctx.font = `${obj.style} ${obj.fontSize}px ${obj.fontFamily}`;

        ctx.fillStyle = obj.color;
        ctx.fillText(obj.text, obj.x, obj.y);
      }

      if (obj.type === "image") {
        let image = new Image();

        image.src = obj.image;

        obj.w = image.width; // update current image width to objects
        obj.h = image.height; // update current image height to objects

        image.onload = () => {
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(image, obj.x, obj.y, obj.w, obj.h);
        };
      }

      if (obj.type === "hrline") {
        ctx.fillStyle = "black";
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      }

      if (obj.type === "vrline") {
        ctx.fillStyle = "black";
        ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      }
    }

    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = selectedColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  let [height, setHeight] = useState(window.innerHeight);
  let [width, setWidth] = useState(window.innerWidth);

  let reSizeHandle = () => {
    setHeight(window.innerHeight);
    setWidth(window.innerWidth);
  };

  window.onresize = reSizeHandle;

  return (
    <>
      <div className="container1">
        <div className="wrapper1">
          <div className="leftside">
            <div className="sidebar">
              <ul>
                <li
                  className={
                    openAddText === true ? "feature active" : "feature"
                  }
                  onClick={inputPopUp}
                >
                  <img src={addTextIcon} alt="addtext" />
                  <span>Add Text</span>
                </li>

                <li id="addhrline" className="feature" onClick={addHrLine}>
                  <img src={hrLine} alt="hrline" />
                  <span>Add Horizontal Line</span>
                </li>

                <li id="addvrline" className="feature" onClick={addVrLine}>
                  <img src={vrLine} alt="vrline" />
                  <span>Add Vertical Line</span>
                </li>

                <li
                  id="inserimage"
                  className="feature"
                  onClick={clickInsertImage}
                >
                  <img src={inserImage} alt="insertimage" />
                  <span>Insert Image</span>
                </li>

                <input
                  type="file"
                  id="insertImage"
                  className="feature"
                  style={{ display: "none" }}
                  name="image"
                  onChange={(e) => addImage(e)}
                />

                <li
                  className={openMeme === true ? "feature active" : "feature"}
                  onClick={togglePopup}
                >
                  <img src={meme} alt="meme" />
                  <span>Insert Meme</span>
                </li>

                <li
                  className={isOpen === true ? "feature active" : "feature"}
                  onClick={toggleBackgroundColor}
                >
                  <img src={fillColor} alt="" />
                  <span>Background Color</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="middleside">
            {openAddText && (
              <AddText
                inputPopUp={inputPopUp}
                addText={addText}
                objects={objects}
                draw={draw}
              />
            )}

            {openMeme && (
              <MemeImage
                togglePopup={togglePopup}
                addImage={addImage}
                setObjects={setObjects}
                objects={objects}
                draw={draw}
              />
            )}

            <div style={{ position: "absolute", bottom: 150 }}>
              {isOpen && (
                <ColorPicker
                  defaultColor={selectedColor}
                  onChange={handleBgColor}
                />
              )}
            </div>
          </div>
          <div className="rightside mt-5">
            <div className="upperside">
              <div className="delete">
                <img onClick={handleDelete} src={bin} alt="bin" />
              </div>
              <div className="save">
                <img
                  onClick={handleSave}
                  src={camera}
                  alt="camera"
                  id="captureButton"
                />
              </div>
            </div>
            <div>
              <canvas
                ref={canvas}
                height={height * 0.8}
                width={width * 0.6}
             
                id="canvas"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Meme;
