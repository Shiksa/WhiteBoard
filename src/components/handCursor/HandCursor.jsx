"use client"
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import style from "@/components/handCursor/HandCursor.module.css"

const HandCursor = () => {
  const defaultCursorRef = useRef({ x: 100, y: 100 }); // Initial cursor position
  const handCursorRef = useRef(null); // Reference to the hand cursor element

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches; // Check for touch devices
    if (!isTouch) {
      const moveCursor = (e) => {
        defaultCursorRef.current.x = e.clientX;
        defaultCursorRef.current.y = e.clientY;
      }
      window.addEventListener('mousemove', moveCursor);
      const handCursor = handCursorRef.current;
      const followCursor = () => {
        if (handCursor) {
          handCursor.style.setProperty("--cursor-x", `${defaultCursorRef.current.x}px`);
          handCursor.style.setProperty("--cursor-y", `${defaultCursorRef.current.y}px`);
        }
        requestAnimationFrame(followCursor); // Continuously update position
      }
      followCursor(); // Start the follow loop
      return () => {
        window.removeEventListener('mousemove', moveCursor);
      }
    }
  }, []);

  return (
    <div ref={handCursorRef} className={style.handCursor}>
      <Image
        src="/hand.webp"
        alt="Hand Cursor"
        width={48}
        height={48}
      />
    </div>
  )
}

export default HandCursor
