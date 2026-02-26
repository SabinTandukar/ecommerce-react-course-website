// create context
import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// AuthProvider is a wrapper component
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem("currentUserEmail")
      ? { email: localStorage.getItem("currentUserEmail") }
      : null,
  );

  function signUp(email, password) {
    // insert users in local storage
    const users = JSON.parse(localStorage.getItem("users") || "[]"); //checks if email and password

    // check if user is already signed up
    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" };
    }
    const newUser = { email, password }; //takes email and password from the user
    users.push(newUser); //inserts the email and passwod in the empty array
    localStorage.setItem("users", JSON.stringify(users)); //sets email and password in localstorage
    localStorage.setItem("currentUserEmail", email); //save users email

    setUser({ email });
    return { success: true };
  }

  function logIn(email, password) {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    localStorage.setItem("currentUserEmail", email);
    setUser({ email });

    return { success: true };
  }

  //   logging out
  function logOut() {
    localStorage.removeItem("currenUserEmail");
    setUser(null);
  }
  return (
    <AuthContext.Provider value={{ signUp, user, logOut, logIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  return context;
}
