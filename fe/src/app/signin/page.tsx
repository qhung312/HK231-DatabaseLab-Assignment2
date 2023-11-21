'use client'
import { SignIn } from "@/components/Auth";

const SignInPage = () => {
    return (
        <div className="flex h-[calc(100vh-50px)] w-full items-center justify-center">
            <SignIn />
        </div>
    )
}

export default SignInPage;