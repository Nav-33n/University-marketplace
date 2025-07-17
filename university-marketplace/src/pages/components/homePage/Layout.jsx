import SideBar from './SideBar';
import SearchBar from './SearchBar';
import NotificationButton from './NotificationBtn';
import MailButton from './MessageBtn';
import ProfileImageUpload from './Profile';
import { useAuth } from '../../../services/authContext';
import { getToken } from '../../../utils/tokenStorage';
import { Outlet } from 'react-router-dom';


export default function Layout() {
    const { user } = useAuth();
    const userToken = getToken();

    return(
       <div className="grid sm:grid-cols-12 min-h-screen  px-9 py-5">
    <div className="sm:col-span-2 bg-h-screen sticky pr-4">
      <SideBar />  
    </div>
     <div className="hidden sm:block col-span-10">
          <div className="flex items-center justify-between ">
            <div>
              <SearchBar />
            </div>
            <div className="flex items-center gap-6">
              <NotificationButton />
              <MailButton />
              <ProfileImageUpload userToken={userToken}/>
          </div>
          </div>
          {/* Main content area */}
           <div className=" mt-5">
            <Outlet />
           </div>
        </div>
    </div> 
    )
}