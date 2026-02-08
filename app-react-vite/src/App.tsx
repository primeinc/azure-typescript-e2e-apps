import { useActionState, useRef, use, Suspense, useState, useMemo } from 'react';
import NavBar from './Components/NavBar';
import Status from './Components/Status';
import { User, Todo } from './types';
import './App.css';

let url = `/api/todo`;

const cloudEnv = import.meta.env.VITE_CLOUD_ENV || `production`;
const backendEnv = import.meta.env.VITE_BACKEND_URI || `https://localhost:7071`;

if (cloudEnv.toLowerCase() === 'production') {
  if (backendEnv) {
    url = `${backendEnv}${url}`
  } else {
    throw Error(`Missing backendEnv`)
  }
}

// Note: In a real production app, you might want to use a more robust
// caching or state management library (like TanStack Query).
function App() {
  const authPromise = useRef(fetch('/.auth/me').then(res => {
    if (!res.ok) throw new Error(`Auth fetch failed: ${res.status}`);
    return res.json();
  }).then(payload => payload.clientPrincipal as User | null)).current;
  
  const todoPromise = useRef(fetch(url).then(res => {
    if (!res.ok) throw new Error(`Todo fetch failed: ${res.status}`);
    return res.json();
  }) as Promise<Record<string, Todo>>).current;

  return (
    <Suspense fallback={<div className="App-header">Loading app data...</div>}>
      <AppContent todosPromise={todoPromise} authPromise={authPromise} />
    </Suspense>
  );
}

function AppContent({ todosPromise, authPromise }: { todosPromise: Promise<Record<string, Todo>>, authPromise: Promise<User | null> }) {
  const user = use(authPromise);
  const initialTodos = use(todosPromise);
  const [todos, setTodos] = useState(initialTodos);
  
  const isAuthenticated = !!user;
  const userName = user?.userDetails ? user.userDetails.toLowerCase().split(' ').map((x: string) => x && x[0] ? x[0].toUpperCase() + x.slice(1) : '').join(' ') : '';

  const statusPromise = useMemo(() => {
    if (!isAuthenticated) return Promise.resolve(null);
    
    let statusUrl = `/api/status`;
    if (cloudEnv.toLowerCase() === 'production' && backendEnv) {
        statusUrl = `${backendEnv}${statusUrl}`;
    }
    
    return fetch(statusUrl).then(res => {
        if (!res.ok) throw new Error(`Status fetch failed: ${res.status}`);
        return res.json();
    });
  }, [isAuthenticated]);

  const [message, submitAction, isPending] = useActionState(
    async (_previousState: string, formData: FormData) => {
      const title = formData.get('title') as string;
      if (!title) return 'Please enter a todo';

      try {
        const config = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title })
        };
        const response = await fetch(url, config);
        if (!response.ok) throw new Error(`Post failed: ${response.status}`);
        const returnedName = await response.text();

        // Update local state to fix P0 #5
        setTodos(prev => ({ ...prev, [Date.now()]: { title, completed: false } }));

        return returnedName || 'Todo added';
      } catch (error) {
        return `Error: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
    ''
  );

  return (
    <div className="App">
      <NavBar user={user} />
      <header className="App-header">
        <form action={submitAction} className="App-form">
          <div>
            <input
              type="text"
              name="title"
              className="App-input"
              placeholder="Enter todo to add"
              required
            />
            <button type="submit" className="App-button" disabled={isPending}>
              {isPending ? 'Adding...' : 'Submit'}
            </button>
          </div>
        </form>
        <div><h5>{message && `Todo added: ${message}`}</h5></div>

        <details>
          <summary>Public data</summary>
          <p><h5><pre>{JSON.stringify(todos, null, 2)}</pre></h5></p>
        </details>

        {isAuthenticated ?
          <div>
            <details>
              <summary>Private data - just for {userName}</summary>
              <div style={{ padding: '10px' }}>
                <h5>Auth: {String(isAuthenticated)}</h5>
                <Suspense fallback={<p>Loading status...</p>}>
                  <Status user={user} statusPromise={statusPromise} />
                </Suspense>
              </div>
            </details>
            <p>{JSON.stringify(user)}</p>
          </div>
          : <div>Sign in for private data access</div>
        }
      </header>
    </div>
  );
}

export default App;
