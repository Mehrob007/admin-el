import { useEffect, useState } from "react";
import Input from "../comElement/Input";
import apiClient from "../../utils/apiClient";

export default function PromoCodes() {
  const [data, setData] = useState([]);
  const [newSkitka, setNewSkitka] = useState();
  const [localionPromoTop, setLocalionPromoTop] = useState("");
  const [promoCode, setPromoCode] = useState({
    name: "",
    percent: "",
  });

  const onSendNewCollection = async () => {
    console.log(newSkitka);
    try {
      await apiClient.post("/promo", promoCode);
      setNewSkitka("");
      getLocationPromoTop();
    } catch (e) {
      console.error(e);
    }
  };
  const onSendPromoCode = async () => {
    try {
      await apiClient.post("/promo", {
        ...promoCode,
        percent: promoCode?.percent * 0.01,
      });
      setPromoCode({
        name: "",
        percent: "",
      });
      getPromoNames();
    } catch (e) {
      console.error(e);
    }
  };

  const getPromoNames = async () => {
    try {
      const response = await apiClient.get("promo/admin");
      setData(response.data.data.promos);
    } catch (e) {
      console.error(e);
    }
  };

  const onDelete = async (id) => {
    try {
      await apiClient.delete("/promo", {
        data: {
          id: id,
        },
      });
      getPromoNames();
    } catch (e) {
      console.error(e);
    }
  };
  const getLocationPromoTop = async () => {
    try {
      const res = await apiClient.get("/Api/get-promo-all-for-top");
      setLocalionPromoTop(res?.data[res?.data?.length - 1]?.promoName);
    } catch (e) {
      console.error(e);
    }
  };

  console.log("localionPromoTop", localionPromoTop);

  useEffect(() => {
    getPromoNames();
    getLocationPromoTop();
  }, []);

  return (
    <div>
      <div className="com__box">
        <div className="top__com">
          <h1>Акция в верхней части экрана</h1>
          <p>Придумайте название акции</p>
        </div>
        <div className="top__com">
          <p>Текущий: {localionPromoTop}</p>
        </div>

        <div className="bottom__com">
          <Input
            value={newSkitka}
            onChange={(e) => setNewSkitka(e.target.value)}
          />
          <button onClick={onSendNewCollection}>Сохранить</button>
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Промокод для пользолвателей</h1>
          <p>Промокод который будут вводить при оформлении</p>
        </div>
        <div className="bottom__com">
          <Input
            value={promoCode.name}
            style={{ width: "240px" }}
            onChange={(e) =>
              setPromoCode({ ...promoCode, name: e.target.value })
            }
          />
          <Input
            classNameDiv="input__number__procent"
            typeHtml="number"
            value={promoCode.percent}
            style={{ width: "70px", marginLeft: "10px", textAlign: "center" }}
            onChange={(e) =>
              setPromoCode({ ...promoCode, percent: +e.target.value })
            }
          />
          <button style={{ marginLeft: "15px" }} onClick={onSendPromoCode}>
            Сохранить
          </button>
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Активные промокоды</h1>
        </div>
        <div className="bottom__com flex-col">
          {data?.map((el) => (
            <div
              key={el.id}
              className="com__item__category"
              style={{ width: "200px" }}
            >
              <span>
                {el.name} | {el.percent * 100}%
              </span>
              <button onClick={() => onDelete(el.id)}>x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
