'use client'
import { fetchUserSession } from "@/apis";
import { SignUp } from "@/components/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            const { userInfo } = await fetchUserSession()

            if (userInfo?.username) {
                router.push('/')
            }
        }

        fetchSession()
    }, [])

    return (
        <div className="flex h-[calc(100vh-50px)] w-full items-center justify-center">
            <SignUp />
        </div>
    )
}

export default SignInPage;