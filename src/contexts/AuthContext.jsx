import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  auth, 
  db,
  githubProvider 
} from '../config/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  async function signup(email, password, username) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Create user profile in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString()
      })
      
      return userCredential
    } catch (error) {
      console.error('Signup error:', error)
      throw new Error(error.message)
    }
  }

  async function loginWithGithub() {
    try {
      const result = await signInWithPopup(auth, githubProvider)
      
      // Check if user profile exists, if not create one
      const userDoc = await getDoc(doc(db, 'users', result.user.uid))
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          username: result.user.displayName,
          email: result.user.email,
          createdAt: new Date().toISOString()
        })
      }
      
      return result
    } catch (error) {
      console.error('Github login error:', error)
      throw new Error(error.message)
    }
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = () => {
    return signOut(auth)
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    user,
    signup,
    login,
    loginWithGithub,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
} 