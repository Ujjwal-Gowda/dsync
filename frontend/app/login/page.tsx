
"use client"
import { logIn, register, getCurrentUser } from "@/services/auth.service";
const HomePage = () => {

    register("ujjwal", "ujjwal@gmail.com", "123456")
    const user = getCurrentUser()
    console.log(user)
    console.log("hiii")
    return <h1>HOME PAGE</h1>;
};
export default HomePage;
