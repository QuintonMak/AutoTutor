import logo from './logo.svg';
import './App.css';

import AiWindow from './aiWindow.js';

function App() {
  

  return (
    <div className="App">
      <h1 className="title">AutoTutor</h1>
      <h5>Please upload a pdf file of your course content, and the AI assistant will be ready to assist you!</h5>
      <AiWindow/>      
    </div>
  );
}

export default App;
