import React from 'react';

const About = () => {
    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: 'white',
            minHeight: '100vh',
            marginTop: '210px',
        },
        section: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '40px',
            gap: '30px',
            margin: '20px 0',
            width: '90%',
            maxWidth: '1200px',
            borderRadius: '10px',
        },
        image: {
            width: '320px',
            height: '290px',
            objectFit: 'cover',
            borderRadius: '10px',
        },
        textContainer: {
            flex: 1,
            padding: '20px',
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '15px',
        },
        description: {
            fontSize: '18px',
            lineHeight: '1.6',
            marginBottom: '20px',
        },
        button: {
            backgroundColor: '#6C21DC',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '12px 25px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        buttonHover: {
            backgroundColor: '#5a1ab8',
        },
        teamContainer: {
            marginTop: '50px',
            textAlign: 'center',
            width: '90%',
            maxWidth: '1200px',
        },
        teamTitle: {
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '30px',
        },
        profiles: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '20px',
        },
        profile: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
        },
        profileImage: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginBottom: '10px',
            backgroundColor: '#ddd', // Placeholder background
        },
        profileName: {
            fontSize: '16px',
            fontWeight: 'bold',
        },
    };

    const teamMembers = [
        { name: "Louizza (Leader)", image: "/Images/Louizza.jpg" },
        { name: "Sam", image: "/Images/Sam.jpg" },
        { name: "Aimee", image: "/Images/Aimee.jpg" },
        { name: "Avian", image: "/Images/Avian.jpg" },
        { name: "Elvira", image: "/Images/Elvira.png" },
        { name: "Geoffrey", image: "/Images/Geoffrey.jpg" },
        { name: "Ashlei", image: "/Images/Ashlei.jpg" },
        { name: "Ayah", image: "/Images/Ayah.jpg" },
        { name: "Jade", image: "/Images/Jade.jpg" },
        { name: "Jeanne", image: "/Images/Jeanne.jpg" },
        { name: "Joshua", image: "/Images/Joshua.jpg" },
        { name: "Kyla", image: "/Images/Kyla.jpg" },
        { name: "Patrick", image: "/Images/Patrick.jpg" },
        { name: "Prince", image: "/Images/Prince.jpg" },
        { name: "Rod", image: "/Images/Rod.jpg" },
        // ...add the rest of your team members and their image paths
    ];

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <img src="/Images/meeting.png" alt="Meeting" style={styles.image} />
                <div style={styles.textContainer}>
                    <h2 style={styles.title}>Every class, every test, one ultimate study app</h2>
                    <p style={styles.description}>
                        Create your own flashcards or find sets made by teachers, students, and experts. Study them anytime, anywhere with our free app.
                    </p>
                </div>
            </div>

            <div style={styles.section}>
                <div style={styles.textContainer}>
                    <h2 style={styles.title}>Make class material instantly studiable</h2>
                    <p style={styles.description}>
                        Turn your slides, videos, and notes into flashcard sets, practice tests, and study guides.
                    </p>
                    <button
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Try it out
                    </button>
                </div>
                <img src="/Images/flashcards.png" alt="Flashcards" style={styles.image} />
            </div>

            <div style={styles.section}>
                <img src="/Images/meeting.png" alt="Meeting" style={styles.image} />
                <div style={styles.textContainer}>
                    <h2 style={styles.title}>Test prep for any subject</h2>
                    <p style={styles.description}>
                        Memorize anything with personalized practice tests and study sessions in Learn. 98% of students say Quizlet has improved their understanding.
                    </p>
                    <button
                        style={styles.button}
                        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
                    >
                        Get Started
                    </button>
                </div>
            </div>

            {/* Our Team Section */}
            <div style={styles.teamContainer}>
                <h2 style={styles.teamTitle}>Our Team</h2>
                <div style={styles.profiles}>
                    {teamMembers.map((member, index) => (
                        <div key={index} style={styles.profile}>
                            <img src={member.image} alt={member.name} style={styles.profileImage} />
                            <p style={styles.profileName}>{member.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;