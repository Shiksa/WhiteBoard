import WhiteBoard from '@/components/WhiteBoard'
import React from 'react'

const page = () => {
  return (
    <div className='h-screen w-full flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold fixed top-5'>Welcome to WhiteBoard, Unleash Your Creativity</h1>
      <div className='mt-10'>
        <WhiteBoard />
      </div>
    </div>
  )
}

export default page
