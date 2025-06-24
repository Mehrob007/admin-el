import { Outlet } from "react-router-dom";
import LeftMenu from "../navigate/LeftMenu";
import iconLogo from "../../assets/icon/iconLogo.svg";
import ava from "../../assets/icon/ava.svg";
localStorage.setItem(
  "refreshToken",
  `Sy1l1JmVbxUo4i5fp6/yQ+N87m0lfWr9o8BSfKMgItIvy8WpRG2DuFqc6T6c4AJFkqcah5oGx+KmxiYch6adBWzpLrKL+Ls4+lFIJMN0x4G2iy3pgkwIjydJ9bpFzqcMV/X5QUQ2A8Dsu0gS7VPDAIG41R/2vmpTg/v/8AUY8Oo=`,
);
export default function Layout() {
  return (
    <div>
      <div className="header__login">
        <div>
          <img src={iconLogo} alt="iconLogo" />
          <div>
            <span>ElevenIslandsAdmin11</span>
            <img src={ava} alt="ava" />
          </div>
        </div>
      </div>
      <main>
        <LeftMenu />
        <div className="box__outlet">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
