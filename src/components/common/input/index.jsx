import './style.css'

function InputComponent({state,setState,placeholder,type,required}) {
  return (
    <div className='custom__input'>
      <input 
        type={type} 
        placeholder={placeholder} 
        onChange={(e) => setState(e.target.value)} 
        value={state}
        required={required}
     />
    </div>
  )
}

export default InputComponent