import { useEffect, useState } from "react";
import "\src\App.css"



const charactersPatterns={
    uppercase:{
        regex:/[A-Z]/g,
        ambiguousRegex:/[IO]/g

    }, 
    lowercase:{
        regex:/[a-z]/g,
        ambiguousRegex:/[lo]/g

    },
    numbers:{
        regex:/[0-9]/g,
        ambiguousRegex:/[01]/g
    },
    symbols:{
        regex:/[!@#$%^&*()_+{}[\]:;<>,.?~/-]/g,
        ambiguousRegex:/[`'"\\]/g
    }
};


const getCharacters=(patternType,excludeAmbiguous)=>{
    const {regex,ambiguous}= charactersPatterns[patternType] // Destructuring
    const allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]:;<>,.?~/-';
    const chars= allChars.match(patternType).join("")
    
    return excludeAmbiguous? chars.replace(ambiguous,"") : chars


};


const generatePassword = (options)=>{ 
 const {length = 12,
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeAmbiguous}= options  // Destructuring

    let allowedChars = ""
    if (uppercase) allowedChars += getCharacters('uppercase', excludeAmbiguous);
    if (lowercase) allowedChars += getCharacters('lowercase', excludeAmbiguous);
    if (numbers) allowedChars += getCharacters('numbers', excludeAmbiguous);
    if (symbols) allowedChars += getCharacters('symbols', excludeAmbiguous);

     //Validations
    if (!allowedChars) throw new Error('Selecciona al menos un tipo de carácter');
    if (length < 8 || length > 64) throw new Error('Longitud inválida debe estar entre (8-64)');
// 3. Generar contraseña segura
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);

  return Array.from(randomValues)
    .map((byte) => allowedChars[byte % allowedChars.length])
    .join('');

};
const PasswordGenerator = () => {
    const [password,setPassword] = useState('');
    const [options, setOptions]= useState({length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: true, // Ejemplo: evitar '1', 'l', 'I', etc.
  });

  const handleGenerate = () =>{
    try{
        const newPassword= generatePassword(options)
        setPassword(newPassword)

    }catch{alert(error.message)}
  }



/*aria-labelledby="main-heading" es para la accesibilidad 
aria-labelledby le indica a los lectores de pantalla (como NVDA o VoiceOver)
qué elemento del DOM describe el contenido del componente actual.
El valor de aria-labelledby debe coincidir exactamente 
con el id del elemento que actúa como etiqueta.
"role" tambien busca mejorar la accesibilidad
*/
return (
   <main className="containerMain" aria-labelledby="main-heading">
 <header className="password-generator-header">
        <h1 id="main-heading" className="password-generator-title">
          Generador de Contraseñas Seguras
        </h1>
        <p className="password-generator-subtitle" role="doc-subtitle">
          Crea contraseñas fuertes y personalizadas
        </p>
      </header>

      <section className="password-section" aria-labelledby="password-heading">
        <h2 id="password-heading" className="sr-only">Contraseña generada</h2>
        <div className="password-display">
          <input
            type="text"
            value={password}
            readOnly
            aria-live="polite"
            className="password-input"
            id="password-output"
          />
          <button
            onClick={handleCopy}
            className="copy-button"
            aria-label="Copiar contraseña"
          >
            📋
          </button>
        </div>
      </section>

      <section className="options-section" aria-labelledby="options-heading">
        <h2 id="options-heading" className="section-title">
          Personaliza tu contraseña
        </h2>

        <fieldset className="option-group">
          <legend className="option-legend">Longitud</legend>
          <input
            type="range"
            min="8"
            max="32"
            value={options.length}
            onChange={(e) => setOptions({...options, length: e.target.value})}
          />
          <span>{options.length} caracteres</span>
        </fieldset>

        <fieldset className="option-group">
          <legend className="option-legend">Caracteres</legend>
          {['uppercase', 'lowercase', 'numbers', 'symbols'].map((type) => (
            <label key={type} className="option-label">
              <input
                type="checkbox"
                className="option-checkbox"
                checked={options[type]}
                onChange={() => setOptions({...options, [type]: !options[type]})}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </fieldset>

        <div className="option-group">
          <label className="option-label">
            <input
              type="checkbox"
              className="option-checkbox"
              checked={options.excludeAmbiguous}
              onChange={() => setOptions({...options, excludeAmbiguous: !options.excludeAmbiguous})}
            />
            Excluir caracteres ambiguos (ej: 1, l, I, O)
          </label>
        </div>
      </section>

      <button
        onClick={generatePassword}
        className="generate-button"
        aria-describedby="generate-help"
      >
        Generar Contraseña
      </button>
      <p id="generate-help" className="sr-only">
        Usa nuestro generador para crear contraseñas seguras y únicas.
      </p>
    
   </main>
)

}
export default PasswordGenerator