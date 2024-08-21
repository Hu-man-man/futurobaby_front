"use client"

import React from 'react'
import { useState } from "react";

export const Test = () => {

  const [count, setCount] = useState(0)

  const handleClick = () => {setCount(count +1)}

  return (
    <>
    <div><button onClick={handleClick}> Clicks : {count}</button></div>
    </>
  )
}
