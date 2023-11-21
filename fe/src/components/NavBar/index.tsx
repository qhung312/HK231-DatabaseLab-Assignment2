'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'antd';
import { ROUTES } from '@/common/constants/routes.constant';
import { useSessionStore } from '@/hooks';
import { LogoutOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';

const NavBar = () => {
    const pathname = usePathname() || '/';
    const router = useRouter();

    const { user, deleteUserSession } = useSessionStore();

    const handleSignOut = () => {
        deleteUserSession();
        router.push('/')
    }

    return (
        <div className="flex h-[50px] bg-blue-100 p-2 items-center justify-end gap-2 relative">
            <nav className=" flex gap-2 absolute items-center justify-center w-full">
                {ROUTES.map(({ path, name }) => {
                    const isActive = path === pathname;
                    return (
                        <Link key={path} href={path}>
                            <Button
                                className={`font-bold px-2 py-1 ${isActive
                                    ? ' text-white'
                                    : '!bg-blue-100 text-blue-600 border-blue-600'
                                    }`}
                            >
                                {name}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {
                user &&
                <div className='flex items-center justify-center'>
                    <span className='w-max font-light'>{user}</span>
                    <Button
                        className='flex items-center shadow-none'
                        style={{
                            backgroundColor: "inherit",
                            border: "none",
                        }}
                        onClick={handleSignOut}
                    >
                        <LogoutOutlined />
                    </Button>
                </div>
            }
        </div>
    );
};

export default NavBar;