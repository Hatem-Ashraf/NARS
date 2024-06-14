import { useDispatch, useSelector } from "react-redux";
import MainHeader from "./shared/MainHeader";
import { userActions } from "./store/userSlice";
import SideDashboard from "./shared/SideDashboard";
import Footer from './shared/MainFooter'
import { useRouter } from "next/router";

export default function Layout({ children, cookies }) {
  const dispatch = useDispatch();
  const router = useRouter();
  // console.log(router.asPath.includes('/register'))
  dispatch(userActions.setCookies(cookies));

  return (
    <>
      <div className="grid grid-cols-12">
      {!router.asPath.includes('/register') && !router.asPath.includes('/password') && !router.asPath.includes('/otp') ? (
        <>
          <div className="col-span-2 h-screen"> 
          <SideDashboard />
          </div>
          <div className="col-span-10 min-h-screen overflow-y-scroll gap-10">
            <div className="cusGradientColor overflow-auto">{children}</div>
            <Footer />
          </div>
        </>
      ) : (
        <div className="col-span-12 h-screen overflow-y-scroll gap-10">
          <div className="cusGradientColor overflow-auto">{children}</div>
          <Footer />
        </div>
      )}
        
      </div>
    </>
  );
}
