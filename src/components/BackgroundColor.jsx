import { useState } from 'react';
import { ChromePicker } from 'react-color';

const ColorPicker = ({ defaultColor, onChange }) => {
  const [color, setColor] = useState(defaultColor);

  const handleChange = (newColor) => {
    setColor(newColor.hex);
    onChange(newColor.hex);
  };

  return (
    <div className='color-picker'>
      <ChromePicker color={color} onChange={handleChange} />
    </div>
  );
};

export default ColorPicker
 