"use client"

import { logIn, register, getCurrentUser } from "@/services/auth.service";
import { useEffect } from "react";
export default function Home() {
    // useEffect(() => {
    //     const data = async () => {
    //         const info = await logIn("ujjwal@gmail.com", "123456")
    //         const user = await getCurrentUser()
    //         console.log(info, user)
    //         console.log("hiii")
    //     }
    //     data()

    // }, [])
    return (
        <>
            <h1>home page</h1>
        </>
    );
}
