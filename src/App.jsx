import { useState } from 'react'
import './App.css'
import Chat from './Chat'
import Login from './Login'
import { Route, Routes } from 'react-router-dom'

export default function App() {
  const [nickName, setNickName] = useState('')

  return (
    <section className="app">
      <Routes>
        <Route path="/" element={<Login setNickName={setNickName} />} />
        <Route path="/chat" element={<Chat nickName={nickName} />} />
      </Routes>
    </section>
  )
}
