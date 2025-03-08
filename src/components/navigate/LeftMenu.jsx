import { NavLink, useNavigate } from "react-router-dom";
import menu from "./menu";

export default function LeftMenu() {
  const navigate = useNavigate();
  return (
    <div className="left__menu">
      <div className="nav__laft__menu">
        {menu.map((a) => (
          <div key={a.id}>
            <NavLink
              className={({ isActive }) => (isActive ? "active_link" : "")}
              to={a.url}
            >
              <img src={a.icon} alt={`icon ${a.name}`} />
              <span>{a.name}</span>
            </NavLink>
            <div>
              {a?.links?.map((b) => (
                <NavLink
                  className={({ isActive }) => (isActive ? "active_link" : "")}
                  to={b.url}
                  key={b.id}
                >
                  {/* <img src={b.icon} alt={`icon ${b.name}`} /> */}
                  <span>{b.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="exit__button__left__menu">
        <button
          onClick={() => {
            localStorage.removeItem("refreshToken");
            document.location.href = import.meta.env.VITE_ENV_URL_REDIRECT;
          }}
        >
          Выход
        </button>
      </div>
    </div>
  );
}
