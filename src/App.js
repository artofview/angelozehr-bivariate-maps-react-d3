import React from 'react'
import SwissMap from './SwissMap'
import data from './data.json'
import CHkantonMap from './CHkantonMap'

function App () {
  
  return (
    <div>
      {/* <SwissMap data={data} /> */}
      <CHkantonMap data={data} />
    </div>
  )
}

export default App
