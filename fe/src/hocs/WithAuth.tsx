import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/hooks';
import { useCookies } from 'next-client-cookies';
import { COOKIES_AUTH } from '@/common/constants/auth';
import { Spin } from 'antd'

interface WithAuthProps {
    // TODO: add custom auth props
    [key: string]: any;
}

const withAuth = (WrappedComponent: React.ComponentType<WithAuthProps>) => {
    const Wrapper: FC<WithAuthProps> = (props) => {
        const router = useRouter();
        const cookies = useCookies();
        const { user, setUserSession } = useSessionStore();
        const [loading, setLoading] = useState(true);


        useEffect(() => {
            const checkUserSession = async () => {
                const username = cookies.get(COOKIES_AUTH);

                if (username && !user) {
                    setUserSession({
                        username,
                    });
                }

                if (!(username || user)) {
                    router.push('/signin');
                }

                setLoading(false);
            };

            checkUserSession();
        }, [user, router, cookies, setUserSession]);

        if (!user) {
            return <Spin />
        }
        // Render the wrapped component if the user session exists and not in a loading state
        return loading ? <Spin></Spin> : <WrappedComponent {...props} />;
    };

    return Wrapper;
};

export default withAuth;
