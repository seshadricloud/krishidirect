import React from 'react';

const HomePage = () => {
  return (
    <div className="home">
      <header>
        <h1>Welcome to KrishiDirect</h1>
        <p>Your one-stop solution for all agricultural needs.</p>
      </header>
      <main>
        <section>
          <h2>Featured Products</h2>
          <p>Explore our range of products tailored for farmers and agricultural enthusiasts.</p>
        </section>
        <section>
          <h2>Join Our Community</h2>
          <p>Connect with farmers and share your experiences.</p>
        </section>
      </main>
      <footer>
        <p>&copy; {new Date().getFullYear()} KrishiDirect. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;