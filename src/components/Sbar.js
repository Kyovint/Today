import React, {useState} from 'react'

const Sbar = ({Stext}) => {

    const [text,setText]=useState('');

    const submit = (e) =>{
        e.preventDefault()
        Stext(text)
    }

    return (
        <div>
            <form onSubmit={submit}>
                <input type="text" placeholder="Ejemplo: Berlin " className="py-1 px-24 rounded-l-lg"
                onChange={(e) => setText(e.target.value)}/>
                <button type="submit" className="bg-yellow-400 py-1 px-2 rounded-r-lg text-center">Buscar</button>
            </form>
        </div>
    )
}

export default Sbar;
