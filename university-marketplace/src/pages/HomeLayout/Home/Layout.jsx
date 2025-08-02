import SidebarWrapper from '../SideBar/SidebarWrapper';
import SearchBar from '../SearchBar/SearchBar';
import NotificationButton from '../NotificationBtn/NotificationBtn';
import MailButton from '../MessageBtn/MessageBtn';
import ProfileImageUpload from '../Profile/Profile';
import ConfirmSaleBtn from '../ConfirmSale/ConfirmSaleBtn';
import { useAuth } from '../../../services/authContext';
import { getToken } from '../../../utils/tokenStorage';
import { Outlet } from 'react-router-dom';


export default function Layout() {
    const { user } = useAuth();
    const userToken = getToken();

    return(
       <div className="grid sm:grid-cols-12 px-9 py-5">
    <div className="sm:col-span-2 pr-4 border-r-4 border-[#ced7dfbb] mr-2">
      <SidebarWrapper /> 
    </div>
     <div className="hidden sm:block col-span-10">
          <div className="flex items-center justify-between ">
            <div>
              <SearchBar />
            </div>
            <div className="flex items-center gap-6">
              <ConfirmSaleBtn />
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