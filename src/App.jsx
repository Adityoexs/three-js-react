import React from 'react';
import Scene from './components/Scene';

export default function App() {
  return (
    <>
      {/* Main 3D Scene */}
      <Scene />

      {/* HUD Text Overlay */}
      <div className="hud">
        <span>McLaren P1</span> — React Three Fiber
      </div>
    </>
  );
}
