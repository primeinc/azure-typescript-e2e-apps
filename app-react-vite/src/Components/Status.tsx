import { use } from 'react';
import { User } from '../types';

let url = `/api/status`;

const cloudEnv = import.meta.env.VITE_CLOUD_ENV || `production`;
const backendEnv = import.meta.env.VITE_BACKEND_URI || `https://localhost:7071`;

if (cloudEnv.toLowerCase() === 'production') {
  if (backendEnv) {
    url = `${backendEnv}${url}`
  } else {
    throw Error(`Missing backendEnv`)
  }
}

interface StatusProps {
  user: User | null;
  statusPromise: Promise<any>;
}

function Status({ user, statusPromise }: StatusProps) {
    const envvars = use(statusPromise);

    const formatUserName = (name: string) => {
        if (!name) return '';
        return name.toLowerCase().split(' ').map(x => x && x[0] ? x[0].toUpperCase() + x.slice(1) : '').join(' ');
    };

    return (
        <div className="App">
            <header className="App-header" style={{ minHeight: 'auto', padding: '10px' }}>
            <p>Hi {user ? formatUserName(user.userDetails) : 'Guest'}</p>
            {JSON.stringify(envvars)}
            </header>
        </div>
    );
}
export default Status;
