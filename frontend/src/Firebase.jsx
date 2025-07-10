import toast from "react-hot-toast";
import { createContext, useContext, useEffect, useState } from "react";
// import { initializeApp } from "firebase/app";
// import { 
//     getAuth,
//     GoogleAuthProvider,
//     signInWithPopup,
//     signOut,
//     GithubAuthProvider
// } from "firebase/auth";

// const firebaseConfig = {  
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID,
//     measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const firebaseAuth = getAuth(firebaseApp);
// const googleProvider = new GoogleAuthProvider();
// const githubProvider = new GithubAuthProvider();

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

// ✅ Now properly defined inside component
export const FirebaseProvider = (props) => {
    const [user, setUser] = useState(null);

    const checkAuth = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/auth/checkAuth', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include"
            });

            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setUser(data);
            }
        } catch (err) {
            console.error('error:', err);
        }
    };

    // const signInWithGoogle = () => {
    //     return signInWithPopup(firebaseAuth, googleProvider);
    // };

    // const signInWithGithub = () => {
    //     return signInWithPopup(firebaseAuth, githubProvider);
    // };

    return (
        <FirebaseContext.Provider value={{ checkAuth, user, setUser }}>
            {props.children}
        </FirebaseContext.Provider>
    );
};
