"use client"
import React, { act, use } from 'react'
import { useState, useEffect, useRef } from 'react'

const WhiteBoard = () => {
  const canvasRef = useRef(null) // Reference to the canvas element
  const [context, setContext] = useState(null); //where we'll store the drawing context
  const [isDrawing, setIsDrawing] = useState(false); //whether the user is currently drawing
  const [currentColor, setCurrentColor] = useState('#000000');//default color black
  const [brushSize, setBrushSize] = useState(3); //default brush size
  const [drawingActions, setDrawingActions] = useState([]); //keep track of drawing history for undo/redo
  const [currentPath, setCurrentPath] = useState([]); //store the current path being drawn
  const [currentStyle, setCurrentStyle] = useState({ color: currentColor, size: brushSize }); //store the style of the current path

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 900; // Set canvas width
      canvas.height = 400; // Set canvas height
      canvas.style.backgroundColor = '#DAD8C9'; // Set canvas background to white
      canvas.style.border = '10px solid #C19A6B';
      const ctx = canvas.getContext('2d'); // return CanvasRenderingContext2D (an object that provides methods and properties for drawing and manipulating graphics on the canvas like ctx = {moveTo(), lineTo(), stroke(),beginPath(),clearRect(), fillRect(), strokeStyle, lineWidth, font, fillText(), ...})
      setContext(ctx);
      reDrawPreviousData(ctx);
    }
  }, []);

  const startDrawing = (e) => {
    if (context) {
      context.beginPath();
      context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      setIsDrawing(true);
    }
  }

  const draw = (e) => {
    if (!isDrawing) return;
    if (context) {
      context.strokeStyle = currentStyle.color;
      context.lineWidth = currentStyle.size;
      context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      context.stroke();
      setCurrentPath([...currentPath], { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    }
  }
  const endDrawing = () => {
    setIsDrawing(false);
    context && context.closePath();
    if (currentPath.length > 0) {
      setDrawingActions([...drawingActions, { path: currentPath, style: currentStyle }]);
    }
    setCurrentPath([]);
  }

  const changeColor = (color) => {
    setCurrentColor(color);
    setCurrentStyle({ ...currentStyle, color });
  }

  const changeBrushSize = (size) => {
    setBrushSize(size);
    setCurrentStyle({ ...currentStyle, size });
  }

  const undoDrawing = () => {
    if (drawingActions.length > 0) {
      drawingActions.pop();
      const newContext = canvasRef.current.getContext('2d');
      newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      drawingActions.forEach(({ path, style }) => {
        newContext.beginPath();
        newContext.strokeStyle = style.color;
        newContext.lineWidth = style.size;
        newContext.moveTo(path[0].x, path[0].y);
        path.forEach(point => {
          newContext.lineTo(point.x, point.y);
        })
        newContext.stroke();
      })
    }
  }

  const clearDrawing = () => {
    setDrawingActions([]);
    setCurrentPath([]);
    const newContext = canvasRef.current.getContext('2d');
    newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  const reDrawPreviousData = (ctx) => {
    drawingActions.forEach(({ path, style }) => {
      ctx.beginPath();
      ctx.strokeStyle = style.color;
      ctx.lineWidth = style.size;
      ctx.moveTo(path[0].x, path[0].y);
      path.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  }
  return (
    <div>
      <div className='flex justify-center my-4'>
        <button onClick={undoDrawing} className='bg-blue-500 text-white px-4 py-2 rounded mr-2'>Undo</button>
        <button onClick={clearDrawing} className='bg-red-500 text-white px-4 py-2 rounded'>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className='border border-gray-400' />

      <div className='flex my-4'>
        <div className='flex justify-center space-x-4'>
          {['#000000', '#ffffff', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FFA500', '#800080'].map((color) => (
            <button
              key={color}
              onClick={() => changeColor(color)}
              className='w-8 h-8 rounded-full cursor-pointer border border-gray-300'
              style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className='grow' />
        <input type="range" min={1} max={10} value={brushSize} onChange={(e) => changeBrushSize(parseInt(e.target.value))} />
      </div>

    </div>
  )
}

export default WhiteBoard
