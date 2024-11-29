import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import LeftMenu from '../navigate/leftMenu'
import iconLogo from '../../assets/icon/iconLogo.svg'
import ava from '../../assets/icon/ava.svg'

export default function Layout() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token])
  return (<div>
    <div className="header__login">
      <div>
        <img src={iconLogo} alt="iconLogo" />
        <div>
          <span>AdminAnvar</span>
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
