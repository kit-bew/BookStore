import React, { useEffect } from 'react';
import './SparkleEffect.css';

const SparkleEffect = () => {
  useEffect(() => {
    const colors = ['#ff4d4d', '#4d94ff', '#ffd700', '#cc33ff']; // Red, blue, yellow, purple
    const shapes = ['\u2726', '\u2665', '\u2736', '\u2747']; // Star, heart, hexagon, sparkle

    const handleMouseMove = (e) => {
      const arr = [1, 0.9, 0.8, 0.5, 0.2];

      arr.forEach((i) => {
        const x = (1 - i) * 100;
        const star = document.createElement('div');

        star.className = 'star';
        star.style.top = e.pageY + Math.round(Math.random() * x - x / 2) + 'px';
        star.style.left = e.pageX + Math.round(Math.random() * x - x / 2) + 'px';

        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        star.style.setProperty('--sparkle-color', color);
        star.style.setProperty('--sparkle-shape', `"${shape}"`);

        const rotation = Math.random() * 360;
        const scale = 0.8 + Math.random() * 0.4;
        star.style.transform = `rotate(${rotation}deg) scale(${scale})`;

        document.body.appendChild(star);

        star.animate(
          [
            { transform: `rotate(${rotation}deg) scale(${scale})`, opacity: 1 },
            { transform: `rotate(${rotation + 180}deg) scale(${scale * 0.5})`, opacity: 0 },
          ],
          {
            duration: Math.round(Math.random() * i * 800) + 200,
            easing: 'ease-out',
          }
        ).onfinish = () => {
          if (star.parentNode) {
            star.parentNode.removeChild(star);
          }
        };
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default SparkleEffect;