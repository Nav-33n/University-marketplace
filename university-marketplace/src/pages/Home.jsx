import React from 'react';
import SideBar from './components/homePage/SideBar';
import SearchBar from './components/homePage/SearchBar';
import NotificationButton from './components/homePage/NotificationBtn';
import MailButton from './components/homePage/MessageBtn';
import ProfileImageUpload from './components/homePage/Profile';
import ProductList from './components/homePage/ProductList';

function Home() {
  return (
    <div className="grid col-span-full min-w-screen min-h-screen bg-white px-4">
    <div className="flex h-full min-h-[700px] flex-col justify-between items-start bg-white p-4">
      <SideBar />  
    </div>
    <div className="col-start-3 col-end-23 mt-5 ml-3">
      <div className="flex items-center justify-between ">
        <div>
          <SearchBar />
        </div>
        <div className="flex items-center gap-6">
          <NotificationButton />
          <MailButton />
          <ProfileImageUpload />
      </div>
      </div>
      {/* Main content area */}
       <div className="bg-blue mt-5">
        <ProductList />
       </div>
    </div>
    </div>
  );
}
export default Home;