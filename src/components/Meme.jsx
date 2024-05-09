import { useState, useRef, useEffect } from 'react'



import bin from '../assets/icon/bin.png'
import camera from '../assets/icon/camera.png'
import addTextIcon from '../assets/icon/text.png'
import hrLine from '../assets/icon/hrline.png'
import vrLine from '../assets/icon/vrline.png'
import close from '../assets/icon/close.png'
import meme from '../assets/icon/meme.png'
import inserImage from '../assets/icon/image.png'


import a from '../assets/images/alone/0.png'
import b from '../assets/images/alone/1.png'
import c from '../assets/images/alone/2.png'
import d from '../assets/images/alone/3.png'
import e from '../assets/images/alone/4.png'
import f from '../assets/images/alone/5.png'



const Meme = () => {

  

  let canvas = useRef(null)
  
  let [objects, setObjects] = useState([])


  let handleDelete = (e) => {
    e.preventDefault()
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    window.location.reload()
  

  }


  let handleSave = (e) => {
    e.preventDefault()
    console.log('save')

    const canvas = document.getElementById('canvas')
    
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"); 
    window.location.href=image; // it will save locally
  }


   
  

  const togglePopup = (e) => {
    e.preventDefault()
      let popup = document.getElementById("popup");
      
      if (popup.style.display === "none") {
          popup.style.display = "block";
      } else {
          popup.style.display = "none";
      }
  }

  const inputPopUp = (e) => {
    e.preventDefault()
      let popup = document.getElementById("addtext");
      
      if (popup.style.display === "none") {
          popup.style.display = "block";
      } else {
          popup.style.display = "none";
      }
  }


  const clickInsertImage = (e) => {
    e.preventDefault()
    document.getElementById('insertImage').click()
  }


  function showCategory(category) {
      // Hide all items
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
          item.classList.remove('active');
      });

      // Show the selected category
      const selectedCategory = document.getElementById(category.toLowerCase());
      selectedCategory.classList.add('active');
  }




  let addHrLine = (e) => {
    e.preventDefault()
    setObjects([...objects, {'type': 'hrline', 'x': 0, 'y': 300, 'w': 800, 'h':5, 'dragging': false}])
  }


  let addVrLine = (e) => {
    e.preventDefault()
    setObjects([ ...objects, {'type': 'vrline', 'x':400 , 'y': 0, 'w': 5, 'h': 600, 'dragging': false}])
  }


  let addImage = (e) => {
      e.preventDefault()

      setObjects([...objects, {'type': 'image', 'image': URL.createObjectURL(e.target.files[0]), 'x': 50, 'y': 50, 'w': 100, 'h': 100, 'dragging': false}])

  }


  let addText = (e) => {
    e.preventDefault()
    console.log(e.target.memetext.value, "====")
    
    setObjects([...objects, {'type': 'text', 'text': e.target.memetext.value, 'x': 50, 'y': 50, 'w': 100, 'h': 100, 'dragging': false}])

  }



  let [dragok, setDragok] = useState(false);

  let [startX, setStartX] = useState(0)
  let [startY, setStartY] = useState(0)

  let handleMouseDown = (e) => {

    e.preventDefault();
    e.stopPropagation();


    let mx = parseInt(e.pageX - e.target.offsetLeft);
    let my = parseInt(e.pageY - e.target.offsetTop);

    setDragok(false)

    for(let i=0;i<objects.length;i++){
        let r=objects[i];

        if(mx >= r.x && mx <= r.x+r.w && my >= r.y && my<= r.y+r.h){
            
            setDragok(true);
            r.dragging=true;
        }
    }

    setStartX(mx);
    setStartY(my);
}


let handleMouseUp = (e) => {

  e.preventDefault();
  e.stopPropagation();


  setDragok(false);

  for(let i=0;i<objects.length;i++){
      objects[i].dragging=false;
  }
}



  let handleMouseMove = (e) => {

    if (dragok){
      e.preventDefault();
      e.stopPropagation();

      let mx = parseInt(e.pageX - e.target.offsetLeft);
      let my = parseInt(e.pageY - e.target.offsetTop);

      
    
      let dx=mx-startX;
      let dy=my-startY;


      for(let i=0;i<objects.length;i++){
          let r=objects[i];
          if(r.dragging){
              r.x+=dx;
              r.y+=dy;
            
          }
      }
      
      draw();

      setStartX(mx);
      setStartY(my);

    }
}






  useEffect(()=>{
    draw()

  }, [objects])



  let clearCanvas = () => {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height);
   
  }



  let draw = () => {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')

    clearCanvas()



    for(let i=0;i<objects.length;i++){
        let obj=objects[i];

        if (obj.type === 'text') {
      
          ctx.font = "36px serif"
          ctx.fillText(obj.text, obj.x, obj.y)
  
        } 
        
        if (obj.type === "image") {
          let image = new Image();
          
          image.src = obj.image;
  
          image.onload = () => {
            ctx.drawImage(image, 70, 60, 100, 100);
          };
        } 
        
        if (obj.type === "hrline") {
          
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h)
  
        } 
        
        if (obj.type === "vrline") {
          
          ctx.fillRect(obj.x, obj.y, obj.w, obj.h)
        }
    }
  
  }

  
 
  return (

  <>
    <div className='container'>
        <div className='wrapper'>
          <div className='leftside'>
          <div className='sidebar'>
          <ul>
            <li onClick={inputPopUp}><img src={addTextIcon} alt='addtext'/><span>Add Text</span></li>
            <li id='addhrline' onClick={addHrLine}><img src={hrLine} alt='hrline' /><span>Add Horizontal Line</span></li>
            <li id='addvrline' onClick={addVrLine}><img src={vrLine} alt='vrline' /><span>Add Vertical Line</span></li>
            <li id='inserimage' onClick={clickInsertImage}>
              <img src={inserImage} alt='insertimage'/>
              <span>Insert Image</span> 
            </li>

            <input 
              type='file' 
              id='insertImage' 
              style={{display: 'none'}} 
              name='image'
              onChange={(e)=>addImage(e)}
            />

      
            <li onClick={togglePopup}><img src={meme} alt='meme' /><span>Insert Meme</span></li>
           
            <div id="addtext" className="addtext">
                <img src={close} alt='close' onClick={inputPopUp} style={{position:'absolute', right:20}} />

            <form onSubmit={(e)=>addText(e)} id='addtext'>
                  <input type='text' name='memetext' placeholder='Add text' id='memetext' />
                  <input type='submit' id='submit' value='Add'  />
            </form>
                
            </div>

            <div id="popup" className="popup">
                <img src={close} alt='close' onClick={togglePopup} style={{position:'absolute', right:20}} />
                <div className='memepopup'>
                  <div className='sidebar2'>
                      <ul>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Alone</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Cereal</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Boy</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Girl</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Computer</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Yao Ming</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Troll</li>
                          <li onClick={(e)=>showCategory(e.target.innerText)}>Other</li>
                      </ul>
                  </div>
                  <div id='alone' className='item active' >
                        <img src={a} alt='' />
                        <img src={b} alt='' />
                        <img src={c} alt='' />
                        <img src={d} alt='' />
                        <img src={e} alt='' />
                        <img src={f} alt=''/>
                  </div>
                  <div id='cereal' className='item' >
                        <img src={d} alt='' />
                        <img src={e} alt='' />
                        <img src={f} alt=''/>
                  </div>
                  <div id='boy' className='item' >
                        <img src={b} alt='' />
                        <img src={c} alt='' />
                        <img src={d} alt='' />
                  </div>
                  <div id='girl' className='item' >
                        <img src={a} alt='' />
                        <img src={b} alt='' />
                  </div>
                  <div id='computer' className='item' >
                  <img src={e} alt='' />
                    <img src={f} alt=''/>
                  </div>
                  <div id='yaoming' className='item' >
                    <img src={a} alt='' />
                    <img src={c} alt='' />
                    <img src={d} alt='' />
                  </div>
                  <div id='troll' className='item' >
                  <img src={a} alt='' />
                    <img src={b} alt='' />
                    <img src={c} alt='' />
                    <img src={d} alt='' />
                  </div>
                  <div id='other' className='item' >
                  <img src={b} alt='' />
                    <img src={c} alt='' />
                    <img src={d} alt='' />
                    <img src={e} alt='' />
                    <img src={f} alt=''/>
                  </div>
                  

                </div>
            </div>
        </ul>
 </div>


 

  
        </div>
          <div className='rightside'>
            <div className='upperside'>
              <img onClick={handleDelete} src={bin} alt='bin'/>
              <img 
              onClick={handleSave} 
              src={camera} alt='camera'
              id='captureButton'
              />
            </div>
            <div>
              <canvas 
                ref={canvas} 
                height={600} 
                width={800} 
                style={{border: '1px solid gray'}} id='canvas'
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                />


            </div>
            </div>
            
          </div>
        </div>

  </>
  )
}

export default Meme