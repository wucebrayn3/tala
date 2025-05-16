import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase"; // Import firestore
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore"; // Import Firestore functions

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterClick = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!termsAccepted) {
      setError("Please accept the Terms, Services, and Policy.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Registration successful!", user);

      // Store additional user data in Firestore
      const usersCollectionRef = collection(firestore, "users");
      await setDoc(doc(usersCollectionRef, user.uid), {
        email,
        firstName,
        lastName,
        username,
        dob: `${year}-${month}-${day}`, // Store date of birth as a string
      });
      console.log("User data stored in Firestore");

      // Redirect to the dashboard or another page upon successful registration
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    body: {
      backgroundColor: "#ECDEFA",
      margin: 0,
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    logo: {
      display: "block",
      margin: "0 auto",
      marginTop: "-70px",
      width: "300px",
      height: "300px",
      marginBottom: "-25px",
    },

    container: {
      width: "500px",
      height: "650px", // Adjusted height to accommodate error message
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column", // Changed to column to better organize elements
      justifyContent: "center",
      alignItems: "center",
      padding: "20px", // Added padding
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },

    form: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },

    input: {
      display: "block",
      backgroundColor: "white",
      width: "100%",
      padding: "10px",
      margin: "10px 0",
      border: "1px solid #a1a1a1",
      borderRadius: "29px",
      fontSize: "12px",
      paddingLeft: "15px",
      boxSizing: "border-box",
    },

    check: {
      display: "flex",
      justifyContent: "flex-start", // Aligned to the start
      alignItems: "center",
      margin: "10px 0",
      width: "100%", // Take full width
    },

    checkLabel: {
      display: "flex",
      alignItems: "center",
      fontSize: "12px",
      color: "#000000",
      whiteSpace: "nowrap",
      marginLeft: "5px", // Adjusted margin
    },

    checkInput: {
      marginRight: "5px",
      verticalAlign: "middle",
      display: "inline-block",
    },

    dobSection: {
      marginBottom: "15px",
      width: "100%", // Take full width
    },

    dobLabel: {
      fontSize: "14px",
      color: "#333",
      fontWeight: 400,
      marginBottom: "5px",
      display: "block",
      textAlign: "left", // Aligned to the left
    },

    dobInputs: {
      display: "flex",
      gap: "10px", // Adjusted gap
      width: "100%",
    },

    dobSelect: {
      width: "32%", // Adjusted width for better spacing
      padding: "8px",
      border: "1px solid #a1a1a1",
      borderRadius: "29px",
      fontSize: "12px",
      boxSizing: "border-box",
    },

    error: {
      color: "red",
      marginBottom: "10px",
      fontSize: "14px",
    },

    registerButton: {
      backgroundColor: "#6C21DC",
      color: "white",
      padding: "10px",
      margin: "10px 0",
      border: "none",
      borderRadius: "29px",
      fontSize: "16px",
      cursor: "pointer",
      width: "100%",
      textAlign: "center",
    },

    loading: {
      color: "gray",
      marginBottom: "10px",
      fontSize: "14px",
    },
  };
  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <form style={styles.form} onSubmit={handleRegisterClick}>
          <img src="/Images/logo.png" alt="Logo" style={styles.logo} />
          <input
            type="email"
            placeholder="Enter email"
            style={styles.input}
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter First Name"
            style={styles.input}
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter Last Name"
            style={styles.input}
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Enter username"
            style={styles.input}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter password"
            style={styles.input}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={styles.dobSection}>
            <label style={styles.dobLabel}>Date of Birth</label>
            <div style={styles.dobInputs}>
              <select
                style={styles.dobSelect}
                required
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="" disabled>
                  Day
                </option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                style={styles.dobSelect}
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="" disabled>
                  Month
                </option>
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((monthName, i) => (
                  <option key={i + 1} value={i + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
              <select
                style={styles.dobSelect}
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>
                  Year
                </option>
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((yearValue) => (
                  <option key={yearValue} value={yearValue}>
                    {yearValue}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div style={styles.check}>
            <input
              type="checkbox"
              style={styles.checkInput}
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <label style={styles.checkLabel}>
              I accept Terms, Services, and Policy
            </label>
          </div>
          {error && <p style={styles.error}>{error}</p>}
          <button
            type="submit"
            style={styles.registerButton}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
