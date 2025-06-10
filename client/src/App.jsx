import { useState } from 'react'
import reactlogo from './assets/react.svg'
import ShakingImage from './component/shakingimg'

function App() {
  return (
    <>
      <ShakingImage
      src={reactlogo}
      x={600}
      y={300}
      width={300}
      height={300}
      shakeStrength={15}      // Semakin besar, semakin liar
      shakeInterval={200}    // Semakin kecil, semakin sering
    />

    </>
  )
}

export default App
