import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import GameDetails from './pages/GameDetails'
import Search from './pages/Search'
import Trending from './pages/Trending'
import Categories from './pages/Categories'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Footer from './components/Footer'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-900 text-white">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/search" element={<Search />} />
              <Route path="/trending" element={<Trending />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/login" element={<Login redirect="/" />} />
              <Route path="/signup" element={<Signup redirect="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
