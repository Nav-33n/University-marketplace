import React from 'react';
import SideBar from './components/homePage/SideBar';

function Home() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-10">
        <h1 className="text-center text-2xl mt-10">🏠 Home Page</h1>
      </main>
    </div>
  );
}
export default Home;