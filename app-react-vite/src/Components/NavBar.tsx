import { useEffect } from 'react';
import { User } from '../types';

interface NavBarProps {
  user: User | null;
}

const NavBar = ({ user }: NavBarProps) => {

    const providers = [
        { displayName: 'Twitter', useName: 'twitter' },
        { displayName: 'GitHub', useName: 'github' },
        { displayName: 'Microsoft Entra ID', useName: 'aad' }
    ];
    const redirect = `/`;

    useEffect(() => {
        console.log(`NavBar user object: ${JSON.stringify(user)}`)
    }, [user]);

    const formatUserName = (name: string) => {
        if (!name) return '';
        return name.toLowerCase().split(' ').map(x => x && x[0] ? x[0].toUpperCase() + x.slice(1) : '').join(' ');
    };

    return (
        <>
        {!user && providers.map((provider, index) => (
            <span key={provider.useName} >
                <a href={`/.auth/login/${provider.useName}?post_login_redirect_uri=${redirect}`}>{provider.displayName}</a>
                {index < providers.length - 1 ? ' | ' : ''}
            </span>
        ))}
        {user && (
            <div>
                <p>
                    <span>{formatUserName(user.userDetails)} ({user.identityProvider})</span>
                    <span> <a href={`/.auth/logout?post_logout_redirect_uri=${redirect}`}>
                        Logout
                    </a>
                    </span>
                </p>
            </div>
        )}
        </>
    )

}
export default NavBar;