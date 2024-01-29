import { useState } from 'react'
import './style.css'

function FileInput({ accept, id, label, fileHandle}) {

    const [fileSelected, setfileSelected] = useState('')

    const onChange= (e) => {
        setfileSelected(e.target.value)
        fileHandle(e.target.files[0])
    }

  return (
    <>
        <label htmlFor={id} className='label'>{fileSelected ? `${fileSelected}`: `${label}` }</label>
        <input type='file' accept={accept} id={id} style={{display:'none'}} onChange={onChange}/>
    </>
  )
}

export default FileInput