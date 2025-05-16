import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const NavBar = ({ isAuthenticated, onLogout }) => { // Accept props
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [studyToolsOpen, setStudyToolsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const studyToolsRef = useRef(null);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
        setStudyToolsOpen(false); // Close other dropdown
    };

    const toggleStudyTools = () => {
        setStudyToolsOpen((prev) => !prev);
        setDropdownOpen(false); // Close other dropdown
    };

    const handleLogoutClick = () => {
        onLogout(); // Call logout function from App.js
        setDropdownOpen(false); // Close dropdown
        navigate('/login'); // Navigate to login after logout
    };
    
    const closeDropdowns = () => {
        setDropdownOpen(false);
        setStudyToolsOpen(false);
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (studyToolsRef.current && !studyToolsRef.current.contains(event.target)) {
                setStudyToolsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Styles (minor adjustments for clarity and consistency)
    const styles = {
        navbar: {
            backgroundColor: 'white',
            padding: '10px 20px',
            position: 'fixed',
            top: 0,
            left: 0,
            height: '50px',
            width: '100%',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            boxSizing: 'border-box',
        },
        navLogo: {
            marginRight: 'auto',
        },
        talaImage: {
            width: '100px', // Adjusted size slightly
            height: 'auto',
            marginTop: '2px',
        },
        navLinks: {
            listStyle: 'none',
            display: 'flex',
            alignItems: 'center',
            margin: 0,
            padding: 0,
        },
        navLinksLi: {
            position: 'relative',
            marginLeft: '15px', // Slightly reduced margin
        },
        navLink: { // Renamed for clarity
            color: 'black',
            fontWeight: 700,
            textDecoration: 'none',
            fontSize: '15px', // Standardized font size
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '5px',
            transition: 'color 0.3s ease, background-color 0.3s ease',
        },
        navLinkHover: { // Renamed for clarity
            backgroundColor: '#6C21DC', // Maintained purple for hover
            color: 'white',
        },
        dropdownMenu: {
            position: 'absolute',
            top: '100%',
            left: 0,
            backgroundColor: 'white',
            listStyle: 'none',
            padding: '8px 0', // Adjusted padding
            margin: 0,
            marginTop: '5px', // Added slight margin for separation
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)', // Slightly enhanced shadow
            borderRadius: '6px', // Consistent border radius
            zIndex: 1001, // Ensure it's above navbar content
            minWidth: '160px', // Ensure enough width
        },
        dropdownMenuItem: {
            padding: '10px 20px',
            fontSize: '14px', // Standardized font size
            color: '#333',
            textDecoration: 'none',
            display: 'block',
            fontWeight: 600, // Slightly less bold than main links
            transition: 'color 0.2s ease, background-color 0.2s ease',
        },
        dropdownMenuItemHover: {
            backgroundColor: '#f0e6ff', // Lighter purple for hover
            color: '#5a1ab8',
        },
        profileButton: {
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex', // To align icon properly
            alignItems: 'center',
        },
        navIcon: {
            width: '40px', // Standardized size
            height: '40px',
            objectFit: 'cover',
            borderRadius: '50%',
            verticalAlign: 'middle',
        },
        profileDropdown: {
            position: 'absolute',
            top: 'calc(100% + 5px)', // Position below the button
            right: 0,
            backgroundColor: 'white',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            borderRadius: '6px',
            width: '230px', // Adjusted width
            zIndex: 1001,
            padding: '15px',
        },
        profileInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px', // Increased gap
            marginBottom: '15px',
            borderBottom: '1px solid #eee', // Separator
            paddingBottom: '10px',
        },
        dropdownProfileIcon: {
            width: '45px', // Standardized size
            height: '45px',
            borderRadius: '50%',
            objectFit: 'cover',
        },
        profileDetails: {
            display: 'flex',
            flexDirection: 'column',
        },
        profileName: {
            fontSize: '15px', // Standardized
            fontWeight: 'bold',
            margin: 0,
            color: '#333',
        },
        profileEmail: {
            fontSize: '13px', // Standardized
            margin: 0,
            color: '#666',
        },
        logoutButton: {
            backgroundColor: '#d32f2f', // Slightly less aggressive red
            color: 'white',
            border: 'none',
            padding: '10px 15px',
            borderRadius: '5px',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background-color 0.2s ease',
        },
        logoutButtonHover: {
            backgroundColor: '#c62828',
        }
    };
    
    if (!isAuthenticated) {
        return null; // Don't render Navbar if not authenticated
    }

    return (
        <nav style={styles.navbar}>
            <div style={styles.navLogo}>
                <Link to="/dashboard" onClick={closeDropdowns}>
                    <img src="/Images/tala.ico" alt="Tala" style={styles.talaImage} />
                </Link>
            </div>
            <ul style={styles.navLinks}>
                <li style={styles.navLinksLi}>
                    <Link
                        to="/dashboard"
                        style={styles.navLink}
                        onClick={closeDropdowns}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.navLink, {backgroundColor: '', color: 'black'})}
                    >
                        Dashboard
                    </Link>
                </li>
                <li style={styles.navLinksLi}>
                    <Link
                        to="/about"
                        style={styles.navLink}
                        onClick={closeDropdowns}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.navLink, {backgroundColor: '', color: 'black'})}
                    >
                        About
                    </Link>
                </li>
                <li style={styles.navLinksLi} ref={studyToolsRef}>
                    <span
                        style={styles.navLink}
                        onClick={toggleStudyTools}
                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.navLinkHover)}
                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.navLink, {backgroundColor: '', color: 'black'})}
                    >
                        Study Tools
                    </span>
                    {studyToolsOpen && (
                        <ul style={{...styles.dropdownMenu, display: 'block'}}>
                            <li>
                                <Link
                                    to="/flashcard" // This page gives option to upload or create
                                    style={styles.dropdownMenuItem}
                                    onClick={closeDropdowns}
                                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.dropdownMenuItemHover)}
                                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.dropdownMenuItem, {backgroundColor: '', color: '#333'})}
                                >
                                    Flashcards
                                </Link>
                            </li>
                            {/* Add other study tools like Quizzes here if needed */}
                        </ul>
                    )}
                </li>
                <li style={styles.navLinksLi} ref={dropdownRef}>
                    <button style={styles.profileButton} onClick={toggleDropdown}>
                        <img src="/Images/profile.png" alt="Profile" style={styles.navIcon} />
                    </button>
                    {dropdownOpen && (
                        <div style={{...styles.profileDropdown, display: 'block'}}>
                            <div style={styles.profileInfo}>
                                <img src="/Images/profile.png" alt="Profile" style={styles.dropdownProfileIcon} />
                                <div style={styles.profileDetails}>
                                    {/* Placeholder user data */}
                                    <p style={styles.profileName}>User Name</p>
                                    <p style={styles.profileEmail}>user@example.com</p>
                                </div>
                            </div>
                            <button 
                                style={styles.logoutButton} 
                                onClick={handleLogoutClick}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.logoutButtonHover)}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.logoutButton)}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
