// src/main.jsx
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './app.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <>
    <App />
    <div id="cursor-sparkle"></div>
  </>
);

document.addEventListener('mousemove', (e) => {
  const sparkle = document.getElementById('cursor-sparkle');
  sparkle.style.left = `${e.clientX - 10}px`;
  sparkle.style.top = `${e.clientY - 10}px`;
});