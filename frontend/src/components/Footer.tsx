import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer style={styles.footer}>
            <div style={styles.container}>
                <p style={styles.text}>© {new Date().getFullYear()} KrishiDirect. All rights reserved.</p>
                <nav style={styles.nav}>
                    <a href="/privacy" style={styles.link}>Privacy Policy</a>
                    <a href="/terms" style={styles.link}>Terms of Service</a>
                </nav>
            </div>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#f8f9fa',
        padding: '20px 0',
        textAlign: 'center',
        borderTop: '1px solid #e9ecef',
    },
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
    },
    text: {
        margin: '0',
        color: '#6c757d',
    },
    nav: {
        marginTop: '10px',
    },
    link: {
        margin: '0 15px',
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Footer;