"use client"
import { useRouter } from "next/navigation"
import { useAuth } from "../context/authContext"
import { useEffect } from "react"

const ProtectedRoutes = ({ children }) => {

    let { user, loading } = useAuth
    let router = useRouter()

    if (loading) return <h1>Loading...

    </h1>

    useEffect(() => {
        if (!user) router.replace("/login")
    }, [user, loading, router])
}
export default
    ProtectedRoutes