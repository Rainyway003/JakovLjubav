import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import App from './App.jsx'
import Login from './components/login/Login.jsx'
import { auth } from './lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import "./index.css"
import LoginScreen, { loginScreenAction } from './components/login/LoginScreen.jsx';

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Provjerava da li je korisnik autentificiran
    });

    return () => unsubscribe();
  }, []);

  if (isAuthenticated === null) {
    // Možeš prikazati loading dok ne provjeriš status autentifikacije
    return <div className="loading">Loading...</div>;
  }

  // Ako je korisnik prijavljen, prikazat će se djeca, u suprotnom preusmjeri na login
  return isAuthenticated ? children : <Navigate to="/login" />;
};


const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGuard>
        <App />
      </AuthGuard>
    ),
  },
  {
    path: "/login",
    element: <LoginScreen />,
    action: loginScreenAction,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
