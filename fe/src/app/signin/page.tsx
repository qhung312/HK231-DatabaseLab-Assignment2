'use client'
import { COOKIES_AUTH } from "@/common/constants/auth";
import { SignIn } from "@/components/Auth";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const SignInPage = () => {
    const router = useRouter();

    const cookies = useCookies();

    useEffect(() => {
        const username = cookies.get(COOKIES_AUTH);

        if (username) {
            router.push('/')
        }
    }, [])

    return (
        <div className="flex h-[calc(100vh-50px)] w-full items-center justify-center">
            <SignIn />
        </div>
    )
}

export default SignInPage;