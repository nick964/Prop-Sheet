'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)

  const addCount = () => {
    console.log('logging out here');
    setCount(count + 1);
  }
 
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={addCount}>Click me</button>
    </div>
  )
}