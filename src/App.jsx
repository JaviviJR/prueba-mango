import { Routes, Route } from 'react-router-dom'
import Exercise1 from './pages/Exercise1'

function App() {
  return (
    <Routes>
      <Route path='/exercise1' element={<Exercise1 />} />
      <Route path='/exercise2' element={<div>Exercise 2</div>} />
      <Route path='/' element={<div>Prueba Mango</div>} />
    </Routes>
  )
}

export default App
