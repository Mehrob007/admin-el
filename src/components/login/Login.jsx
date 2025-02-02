// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import iconLogo2 from "../../assets/icon/iconLogo2.svg";
// import Input from "../comElement/Input";
// import axios from "axios";

import { useEffect } from "react";

export default function Login() {
  // const navigate = useNavigate()
  useEffect(() => {
    document.location.href = "http://localhost:5174";
  }, []);
  // const token = localStorage.getItem("token")
  // const [error, setError] = useState({
  //     login: false,
  //     label: ""
  // })
  // const [data, setData] = useState({
  //     login: '',
  //     password: ''
  // })
  // const onChange = (value, name) => {
  //     setData({
  //         ...data,
  //         [name]: value
  //     })
  // }

  // const validata = (data) => {
  //     if (data?.login?.length <= 0 || data?.password?.length <= 0) {
  //         setError({
  //             [data?.login?.length <= 0
  //                 ? "login" :
  //                 data?.password?.length <= 0
  //                     ? "password" : ""]: true,
  //             label: "Поле не заполнено"
  //         })
  //         return false
  //     }
  //     setError({
  //         login: false,
  //         label: ""
  //     })
  //     return true
  // }

  // const onSend = async () => {
  //     const valid = validata(data)
  //     if (!valid) {
  //         return
  //     }
  //     try {
  //         const res = await axios.post('https://Backendeleven.ru/Token/get-token-for-admin', { username: data.login.trim(), password: data.password.trim() })
  //         if (res.status >= 200 && res.status < 300) {
  //             console.log('Запрос выполнен успешно:', res.data);
  //             localStorage.setItem("token", res.data)
  //             navigate(0)
  //         } else {
  //             console.error('Что-то пошло не так:', res.status, res.data);
  //         }
  //     } catch (e) {
  //         console.error(e);
  //         if (e.response.status === 401) {
  //             setError({ login: true, label: "логин или пароль неверный!" })
  //         }
  //     }

  // }

  // useEffect(() => {
  //     if (token) {
  //         navigate("/")
  //     }
  // }, [token])
  // return (
  //     <div>
  //         <div className="header__login">
  //             <img src={iconLogo2} alt="iconLogo" />
  //         </div>
  //         <div className="body__login">
  //             <div className="box__login">
  //                 <h1 className="title__login">Вход</h1>
  //                 <div className="div__login">
  //                     <div className="inputs__login">
  //                         <Input
  //                             error={error?.login}
  //                             labelError={error.label}
  //                             label='Логин'
  //                             value={data?.login}
  //                             onChange={(e) => onChange(e.target.value, "login")}
  //                         />
  //                         <Input
  //                             error={error?.password}
  //                             labelError={error.label}
  //                             label='Пароль'
  //                             value={data?.password}
  //                             onChange={(e) => onChange(e.target.value, "password")}
  //                         />
  //                     </div>
  //                     <button className='button__component' onClick={onSend}>Войти</button>
  //                 </div>
  //             </div>
  //         </div>
  //     </div>
  // )
}
