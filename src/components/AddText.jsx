import { useEffect, useRef, useState } from 'react'
import ColorPicker from './BackgroundColor'




const AddText = ({inputPopUp , addText, objects, draw}) => {

  const textRef = useRef(null)

  const [text, setText] = useState("")

  let onChangeTextHandler = () => {
    let textInsideDiv = textRef.current.innerHTML
    setText(textInsideDiv)
  }

  let handleBold = (e) => {
    e.preventDefault()
    
    for(let i=0; i<objects.length; i++) {
      let r = objects[i]
      
      if (r.text === text && r.style === "bold" || r.style === "bold italic") {
        r.style = ""
      } else if (r.text === text && r.style === "") {
        r.style="bold"
      } else if (r.text === text && r.style === "italic") {
        r.style = "bold italic"
      }
    }
    draw()
  }


  let handleItalic = (e) => {
    e.preventDefault()

    for(let i=0; i<objects.length; i++) {
      let r = objects[i]
      if (r.text === text && r.style === "italic" || r.style === "bold italic") {
        r.style = ""
      } else if (r.text === text && r.style === "") {
        r.style = "italic"
      } else if (r.text === text && r.style === "bold") {
        r.style = "bold italic"
      }
    }
    draw()
  } 



  
  let [selectedColor, setSelectedColor] = useState("#ffffff")

  let handleBgColor = (color) => {
      setSelectedColor(color)
  }


  useEffect(()=>{
    handleFontColorChange()
  }, [selectedColor])

  let handleFontColorChange = () => {
    for (let i = 0; i<objects.length; i++) {
      let r = objects[i]
      if (r.text === text) {
        r.color = selectedColor
      }
    }
    draw()
  }


  let handleFontSize = (e) => {
    e.preventDefault()

    for (let i = 0; i<objects.length; i++) {
        let r = objects[i]
        if (r.text === text) {
          r.fontSize = e.target.value
        }
    }
    draw() 

  }


  let handleFontFamily = (e) => {
    e.preventDefault()

    for (let i = 0; i<objects.length; i++) {
      let r = objects[i]
      if (r.text === text) {
        r.fontFamily = e.target.value
      }
    }
    draw() 
  }




  return (

         <div id="addtext" className="addtext ">
            <button type="button" className="btn-close close" aria-label="Close" onClick={inputPopUp}></button>
            <br/> <br/>
            <strong>Add Text</strong>
            <form onSubmit={(e)=>addText(e)} className='pt-5' >
              {/* <button onClick={handleBold}>Bold</button> */}
                <div role='textbox' contentEditable='true' className='form-control' ref={textRef} value={text} onInput={onChangeTextHandler}>

                </div>
                <textarea type='text' name='memetext' className='d-none' value={text}></textarea>
            
                <input type='submit' id='submit' className="btn btn-primary mt-3" value='Add'  />
            </form>

            <div className='mt-3 mb-3 d-flex gap-2 justify-content-center align-items-center'>
                <button onClick={handleBold} className="btn btn-light">Bold</button>
                <button onClick={handleItalic} className="btn btn-light">Italic</button>
                <label htmlFor="fontSize">Font Size</label>
                <select id="fontSize" className="custom-select" onChange={e => handleFontSize(e)} style={{outline:0}}>
                    <option>12</option>
                    <option>24</option>
                    <option>36</option>
                    <option>48</option>
                    <option>60</option>
                    <option>72</option> 
                    <option>84</option> 
                    <option>108</option> 
                    <option>120</option>
                    <option>132</option> 
                    <option>144</option> 
                    <option>156</option> 
                </select>
            </div>
            <div className='mt-3 mb-3 d-flex gap-2'>
              <label htmlFor='fontFamily'>Font Family</label>
              <select id='fontFamily' className='custom-select' onChange={e => handleFontFamily(e)} style={{outline:0}}>
                <option>Arial</option>
                <option>Brush Script MT</option>
                <option>Chivo Mono</option>
                <option>Courier New </option>
                <option>Nabla</option>
                <option>Poetsen One</option>
                <option>Permanent Marker</option>
                <option>Verdana</option>
                <option>Times New Roman</option>
                <option>Tourney</option>        
              </select>
            </div>

            <div className='font-color'>
              <label>Font Color</label>
              <ColorPicker defaultColor={selectedColor} onChange={handleBgColor}/>
            </div>
            
            

            <div>

            </div>

            
        </div>

  )
}

export default AddText