import { Outlet } from 'react-router-dom'
import LeftMenu from '../navigate/LeftMenu'
import iconLogo from '../../assets/icon/iconLogo.svg'
import ava from '../../assets/icon/ava.svg'

export default function Layout() {
  return (<div>
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
      <div className='box__outlet'>
        <Outlet />
      </div>
    </main>
  </div>)
}
