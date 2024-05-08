import { Routes, Route } from 'react-router-dom'
import Exercise1 from './pages/Exercise1'
import Exercise2 from './pages/Exercise2'

function App() {
  return (
    <Routes>
      <Route path='/exercise1' element={<Exercise1 />} />
      <Route path='/exercise2' element={<Exercise2 />} />
      <Route path='/' element={<div>Prueba Mango</div>} />
    </Routes>
  )
}

export default App
