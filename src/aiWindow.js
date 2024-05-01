import {generate, generateStream } from "./genai.js";
import React, { useState } from 'react';
import './aiWindow.css'
import PdfSubmit from "./pdfSubmit.js";
import Markdown from 'react-markdown'

function AiWindow() {
    let [text, set_text] = useState('')
    let [pdf, set_pdf] = useState('')
    const NL = '$newline$';
    let keynum = 0;
    function getKey() {
      keynum++;
      return `unique_key_${keynum}`;
    }

    function newTextbox(t) {
      return (<div className='textBox' key={getKey()}>
                <Markdown>
                  {t}
                </Markdown></div>)
    }


    async function handleSubmit(e) {

      // Prevent the browser from reloading the page
      e.preventDefault();

      // Read the form data
      const form = e.target;
      const formData = new FormData(form);

      // reset the text input
      e.target.reset();
      
      // append the prompt to the current text
      const formJson = Object.fromEntries(formData.entries());
      console.log(formJson);
      const prompt = "You: " + formJson.userInput;
      let new_text = text + NL + prompt + NL;
      set_text(new_text);


      if (pdf === '') {
        new_text +='Please submit a pdf file first.';
        set_text(new_text);
        return;
      }

      // generate completion
      new_text += "Gemini: ";
      const outputStream = await generateStream(prompt);
      for await (const chunk of outputStream) {
        try {
          new_text += chunk.text();
          set_text(new_text);
        } catch (e) {
          console.log(e);
          new_text += " Sorry, the requested response violated safety settings. Please try asking again.";
          set_text(new_text);
          break;
        }
      }
      new_text += NL;
      set_text(new_text);
    }


    return (
      <div className="aiBox">
        <PdfSubmit set_pdf={set_pdf}/>
          <div className="aiWindow">
            {text.split(NL).map(t => newTextbox(t))}
            <div id="anchor"></div>
          </div>
        <form className="submitBox" onSubmit={handleSubmit}>
            <input className="submitChild" name="userInput" defaultValue=""
            placeholder="Ask me anything!" />
            <button className="submitChild" type="submit">SUBMIT</button>
        </form>
      </div>
        
    );
}

export default AiWindow;