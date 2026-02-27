import { useState } from "react"
import { createContext } from "react"

export const AuthContext = createContext()
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("")
  function login(data) {
    setUser(data.seller)
    localStorage.setItem("token", data.accessToken)
  }
  function logout() {
    localStorage.removeItem("token")
    setUser(null)
  }
  return (
    <AuthContext.Provider value={{user,login,logout }}>
      {children}
    </AuthContext.Provider>
  )
}
