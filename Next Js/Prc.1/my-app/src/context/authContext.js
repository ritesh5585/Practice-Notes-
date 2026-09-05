"use client"
import { api } from "@/lib/axios";
import { createContext, useContext, useEffect, useState } from "react";

let Auth = createContext()
const [loading, setLoading] = useState(true)

export let AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const hydradateUser = async () => {
        try {
            let res = await api.get("/api/auth/me")
            setUser(res.data.user)
        } catch (error) {
            setUser(null)
            console.log("error in get api", error)
        } finally{
            setLoading(false)
        }
    }

    useEffect(() => {
        hydradateUser()
    }, [])

    return <Auth.Provider value={
        { setUser, user, loading }
    } >
        {children}
    </Auth.Provider >
}
export const useAuth = () => {
    return useContext(Auth);
};