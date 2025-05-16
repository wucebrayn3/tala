import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase"; // Import auth and db
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { getDoc } from "firebase/firestore"; // make sure this is imported

function Login({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const googleProvider = new GoogleAuthProvider();

  const handleLoginClick = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let userCredential;
      if (usernameOrEmail.includes("@")) {
        // Looks like an email
        userCredential = await signInWithEmailAndPassword(
          auth,
          usernameOrEmail,
          password
        );
      } else {
        // Looks like a username
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("username", "==", usernameOrEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const email = userData.email;
          userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
        } else {
          setError("User with this username not found.");
          setLoading(false);
          return;
        }
      }

      const user = userCredential.user;
      console.log("Login successful!", user);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(userDocRef); // <-- FIXED: used getDoc

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          username: user.displayName?.split(" ")[0] || "User",
          email: user.email,
          // Add more user fields if needed
        });
      }

      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
      console.error("Google Sign-in failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  const styles = {
    main: {
      backgroundColor: "#ECDEFA",
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
      display: "block",
      margin: "0 auto",
      marginTop: "-90px",
      width: "300px",
      height: "300px",
      marginBottom: "-10px",
    },
    container: {
      width: "500px",
      height: "650px",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    loginForm: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    input: {
      display: "block",
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #a1a1a1",
      borderRadius: "29px",
      fontSize: "12px",
      paddingLeft: "15px",
      boxSizing: "border-box",
    },
    options: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      margin: "10px 0",
      width: "100%",
    },
    label: {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#000000",
      whiteSpace: "nowrap",
      marginLeft: "5px",
    },
    checkbox: {
      marginRight: "5px",
      verticalAlign: "middle",
      display: "inline-block",
    },
    forgetPassword: {
      background: "none",
      border: "none",
      color: "#007BFF",
      fontSize: "12px",
      cursor: "pointer",
      textDecoration: "underline",
    },
    submitButton: {
      backgroundColor: "#6C21DC",
      color: "white",
      border: "none",
      borderRadius: "29px",
      padding: "10px 20px",
      fontSize: "14px",
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
      margin: "5px 0",
    },
    signupSection: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "15px",
      fontWeight: "500",
      fontSize: "12px",
      color: "#000000",
    },
    signupButton: {
      background: "none",
      border: "none",
      color: "#000000",
      fontSize: "12px",
      marginLeft: "5px",
      cursor: "pointer",
      textDecoration: "underline",
    },
    error: {
      color: "red",
      marginBottom: "10px",
      fontSize: "14px",
      textAlign: "center",
    },
    loading: {
      color: "gray",
      marginBottom: "10px",
      fontSize: "14px",
      textAlign: "center",
    },

    googleButton: {
      backgroundColor: "white",
      color: "black",
      width: "45%",
      border: "none",
      borderRadius: "29px",
      border: "1px solid gray",
      padding: "10px 20px",
      fontSize: "14px",
      cursor: "pointer",
      marginTop: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    googleButtonHover: {
      backgroundColor: "#3574E5",
    },
    googleIcon: {
      width: "20px",
      height: "20px",
      marginRight: "10px",
    },
  };

  return (
    <div style={styles.main}>
      <div style={styles.container}>
        <div className="login-form" style={styles.loginForm}>
          <img src="/Images/logo.png" alt="Logo" style={styles.logo} />
          <form onSubmit={handleLoginClick}>
            <input
              type="text"
              placeholder="Enter email or username"
              required
              style={styles.input}
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Enter password"
              required
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div style={styles.options}>
              <label style={styles.label}>
                <input type="checkbox" style={styles.checkbox} />
                Remember me?
              </label>
              <button type="button" style={styles.forgetPassword}>
                Forget password?
              </button>
            </div>

            {error && <p style={styles.error}>{error}</p>}
            <button
              type="submit"
              style={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            type="button"
            style={styles.googleButton}
            onClick={handleGoogleSignIn}
            disabled={loading}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, styles.googleButtonHover)
            }
            onMouseLeave={(e) =>
              Object.assign(e.currentTarget.style, styles.googleButton)
            }
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAABDlBMVEX////qQzU0qFNChfT7vAU6gfSKrvf4+v9MivX7uQDqQDEwp1DpNyb/vQDqPi/7twDpLBclpEkxffMZokMpevP98fD0ranxkoz63dz0qKToJw7w+PIzqUn86+rtaF7rVkvudm7wiIL+7c/pOTf8yV38wgD3xcL92Zb7vy7+8dr8xlL93aT80X38xUfZ5Pz/+vC5zfpyn/ZYs27d7uCq1bOVzKFsu35GrWD4zszynZjrTUD1uLT5skrtYS7ygSb2nxnsUzHwdCn0kR/4rRKivvnP3PzLsxeYsD1kq0rH48zfuR60szKErkJbkvXsuhVSqk7ewFBbo744nZI2pWU7j8l+wo03l6c2ong/it85k7nSYW2aAAAD/UlEQVRoge2WaVubQBSFYUKMYYCAZDPGkLhVq62aPXZv3dLWrtrl//+RDmRhmAUvCX7o056vMC+Hc+/cGUX5ryVV2iQqpY4dllsN3TICWbrXWh+m9I3qqFGzDcvS1ZnIZ+yaVxkuS94cnRGwKpBu2GqrugR62KgZuog8+4Oat7co2rOFniN8+2wRfNWzY0zTeC9xOJX7XYf4SjLbugFF+zLUBOZHsERo82Uou2knQ/uyWyB0yUsUyUyGB2GfgSsZtT4CsK0F2esA4wv6rgF8K94D+m7G1FLXrUA636Y1CHtd2oNkyKpes1WptJqeajBzEuS7KmMbtcZ6NTwequUmPS1BvhVVvC8Na7TJvloqzwcEyLcyEgZuGZLF5Uk4MN/iUOym9LQs+WMC5ltpCLpQt5/FLSnbMN/KsCaK5J5RugfZO0TP9W2OraZ0gdjK518wdF1P6wK0o2m7L6N0m2vABXVc0Aj9FU23F701cHqU13x64fUcbyQ7deO0r020+2ZK19XU2AcFbUZ/u51yKNNUJvR3KsFbjdTYymONkt+TKRpXCjTc78mz9NhbUTjpSeC2hugwH4VrhQPxi7kVmM6pNUcsfF/iIpfJgrRKrXnCsPNHMvhqBqZcuEZj4YdLwteehmu4yLeWhBdD+DELz0vqCXd+IYdrx8vCT+ZLDv5a+IPG8gAFDeHptyINT38Tha2Y/vanNlGCwbXA9oePXPFU5OnU4GIPC/OyJ4GLx/cpi6dHLnPMmVd4IMlFrJM1Bn5KP6UPaFO7RsgdJ4GzzrP0SURfLcz3iAi3E7BzbCp0J9KXIvMDCpTEOpdKMRd5Pr3OmebHCRthBIez/Zm9iT6f5GJ++oxmciQNAzAejXx6hTYvESVoMDmuyen9GWiHRHKFInI3QPAVbg+tsq+QfXQdZZPYIfSTIstmUyH6ghErSFEv2MC5XvE1djk4wriT2Hcmeyp4r81bR9iJr+o5z84ULwQvdgTWSVX78uA7XwXsjMi4ovQcEd1xumL0Rs+tf+PHLdeHUyFBMD4ed3n3nZ5DvNS/37AzS2xcFoyPd/tdqrQb497Anfwmrt9Go8nyrTJVV0YnlXXRoN8jumsPsOuE/1j/QdPpY59VXxj77APYIcKYCa/+czV7byiBBuLYY1VHv6Y7KZuRhhLEKSlqrHD994SelXTKnM7+Ncx80JPC7bO896AnizHFnNMHcVWVCeNbAJuoL+3IGDj40O25SaNx0H3zM1QHJYvG7YPRSc1LZ5vcfBuIx+4d7LCNaDwA4LHbh6cdxbfpESUgO+7dgmhfnR6S8ckYGwgGfVJ+23Ud+gv+eHRxZMQv9YHuXRsFE9efuWSwpwUOtREobeq/pz/IFG/cCAeuzAAAAABJRU5ErkJggg=="
              alt="Google"
              style={styles.googleIcon}
            />
            {loading ? "Logging in..." : "Login with Google"}
          </button>

          <div style={styles.signupSection}>
            <p>New to TALA?</p>
            <button
              type="button"
              style={styles.signupButton}
              onClick={handleSignUpClick}
            >
              Sign up here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
