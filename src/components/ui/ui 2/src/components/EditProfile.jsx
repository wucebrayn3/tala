import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase"; // adjust the path to your Firebase config
import { getAuth } from "firebase/auth";

function EditProfile() {
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  // Load saved profile data on mount
  useEffect(() => {
    const savedName = localStorage.getItem("profileName");
    const savedImage = localStorage.getItem("profileImage");
    if (savedName) setName(savedName);
    if (savedImage) setProfileImage(savedImage);
  }, []);

  // Handle image input
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); // Base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      localStorage.setItem("profileName", name);
      if (profileImage) {
        localStorage.setItem("profileImage", profileImage);
      }

      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in.");
        return;
      }

      const userId = user.uid;

      const userRef = doc(firestore, "users", userId);
      await updateDoc(userRef, {
        firstName: name,
      });

      alert("Profile saved and synced with Firebase!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  const styles = {
    h1: {
      fontFamily: "Raleway, sans-serif",
      fontSize: "1.5rem",
      color: "black",
    },
    div: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#ECDEFA",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "white",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      gap: "1rem",
    },
    button: {
      backgroundColor: "rgb(141, 80, 121)",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "1rem",
    },
    input: {
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
      width: "100%",
      fontSize: "1rem",
    },
    imagePreview: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: "1rem",
    },
  };

  return (
    <div style={styles.div}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h1 style={styles.h1}>Edit Profile</h1>

        {profileImage && (
          <img
            src={profileImage}
            alt="Profile Preview"
            style={styles.imagePreview}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.input}
        />

        <input
          type="text"
          value={name}
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
