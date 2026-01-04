"use client"
import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { setIsDrawing, setCurrentColor, setBrushSize, setCurrentPath, addCurrentPath, addDrawingAction, undoDrawing, clearAll } from '@/features/whiteBoardSlice';

const WhiteBoard = () => {
  const canvasRef = useRef(null) // Reference to the canvas element
  const [context, setContext] = useState(null); //where we'll store the drawing context context state the drawing engine

  const dispatch = useDispatch();
  const { isDrawing, currentColor, brushSize, drawingActions, currentPath, currentStyle } = useSelector((state) => state.WhiteBoard);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 900; // Set canvas width
      canvas.height = 400; // Set canvas height
      canvas.style.backgroundColor = '#DAD8C9'; // Set canvas background to white
      canvas.style.border = '10px solid #C19A6B';
      const ctx = canvas.getContext('2d'); //getContext is a method of html Canvas elementt, return CanvasRenderingContext2D (an object that provides methods and properties for drawing and manipulating graphics on the canvas like ctx = {moveTo(), lineTo(), stroke(),beginPath(),clearRect(), fillRect(), strokeStyle, lineWidth, font, fillText(), ...})
      setContext(ctx);
      reDrawPreviousData(ctx);
    }
  }, []);

  const startDrawing = (e) => { //when mouse is pressed down
    if (context) {
      const x = e.nativeEvent.offsetX;
      const y = e.nativeEvent.offsetY;
      context.beginPath();
      context.moveTo(x, y); //Move the drawing cursor to mouse position
      dispatch(setIsDrawing(true)); //set drawing state to true
      dispatch(setCurrentPath([{ x, y }])); //reset current path with starting point
    }
  }

  const draw = (e) => { //when mouse is moved
    if (!isDrawing || !context) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    context.strokeStyle = currentStyle.color;
    context.lineWidth = currentStyle.size;
    context.lineTo(x, y); //Draw line to new mouse position
    context.stroke(); //Render the line
    dispatch(addCurrentPath({ x, y })); //Add point to current path
  }


  const endDrawing = () => { //when mouse is released
    dispatch(setIsDrawing(false)); //set drawing state to false
    context && context.closePath();
    if (currentPath.length > 0) {
      dispatch(addDrawingAction({ path: currentPath, style: currentStyle })); //Save the current path and style to drawing actions
    }
    dispatch(setCurrentPath([])); //Reset current path
  }


  const changeColor = (color) => { //change brush color
    dispatch(setCurrentColor(color));
    // dispatch(setCurrentStyle({ ...currentStyle, color }));
  }

  const changeBrushSize = (size) => { //change brush size
    dispatch(setBrushSize(size));
    // dispatch(setCurrentStyle({ ...currentStyle, size }));
  }

  const handleUndoDrawing = () => { //undo last drawing action
    if (drawingActions.length === 0) return;
    dispatch(undoDrawing());
    const newContext = canvasRef.current.getContext('2d'); //get new canvas context because we will clear and redraw as it dont have built-in undo
    newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); //clear entire canvas
    reDrawPreviousData(newContext); //redraw previous data
  }

  const clearDrawing = () => { //clear entire canvas
    dispatch(clearAll());
    const newContext = canvasRef.current.getContext('2d');
    newContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }


  const reDrawPreviousData = (ctx) => { //redraw previous drawing actions from history
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
        <button onClick={handleUndoDrawing} className='bg-blue-500 text-white px-4 py-2 rounded mr-2'>Undo</button>
        <button onClick={clearDrawing} className='bg-red-500 text-white px-4 py-2 rounded'>Clear</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseOut={endDrawing}
        className='border border-gray-400'
        style={{
          cursor: "url('/marker32.webp') 4 32, auto "
        }}
      />

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
        <input type="range" min={1} max={10} value={brushSize} onChange={(e) => changeBrushSize(parseInt(e.target.value))} className='cursor-pointer' />
      </div>

    </div>
  )
}

export default WhiteBoard
