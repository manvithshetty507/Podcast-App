import React from 'react'
import './style.css'

function Button({ handleClick, text, disabled, width}) {
  return (
    <button type='submit' className='custom__btn' onClick={handleClick} disabled={disabled} style={width ? { width: width } : {}}>
      {text}
    </button>
  );
}

export default Button;
