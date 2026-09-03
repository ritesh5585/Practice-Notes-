"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext"
import { useEffect } from "react"

const ProtectedRoutes = ({ children }) => {

    let router = useRouter()

    let { user } = useAuth

    useEffect(() => {
        if (!user) router.replace("/login")
    }, [user, children])
}
export default 
ProtectedRoutes