import { useState } from 'react';
import pdftotext from 'react-pdftotext'
import { setContext } from './genai.js';

function PdfSubmit(props) {
  
  function set_pdf_text(event) {
    const file = event.target.files[0];
    pdftotext(file)
      .then(text => {
        props.set_pdf(text);
        return text;
      })
      .then(text => setContext(text))
      .catch(error => console.error(error + "Failed to extract text from pdf"));
  }
    return (
      <div className='pdfSubmit'>
          <input type="file"
              accept=".pdf"
              onChange={set_pdf_text} />
      </div>
        
    )
}

export default PdfSubmit;