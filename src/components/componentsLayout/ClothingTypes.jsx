import { useEffect, useState } from "react";
import Input from "../comElement/Input";
import apiClient from "../../utils/apiClient";
import { LuEye } from "react-icons/lu";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";

export default function ClothingTypes() {
  const [TypeClothing, setTypeClothing] = useState({});
  const [data, setData] = useState([]);

  const onSendTypeClothing = async () => {
    console.log(TypeClothing);
    try {
      const res = await apiClient.post("/categories", {
        name: TypeClothing.name,
      });
      console.log(res);
      getСategory();
      setTypeClothing({});
    } catch (e) {
      console.error(e);
    }
  };

  const getСategory = async () => {
    try {
      const res = await apiClient.get("/categories");
      setData(res.data.data.categories);
    } catch (e) {
      console.error(e);
      setData([]);
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await apiClient.delete(`/categories`, {
        data: {
          id: id,
          forceDeleted: true,
        },
      });
      console.log(res);
      getСategory();
    } catch (e) {
      console.error(e);
    }
  };

  const onPatch = async (el) => {
    try {
      const res = await apiClient.patch("/categories", {
        data: {
          id: el.id,
          name: el.name,
          isHide: !el.isHide,
        },
      });
      console.log(res);
      getСategory();
    } catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    getСategory();
  }, []);

  console.log(data);

  return (
    <div>
      <div className="com__box">
        <div className="top__com">
          <h1>Тип одежды</h1>
          <p>Добавьте новый тип одежды</p>
        </div>
        <div className="bottom__com">
          <Input
            value={TypeClothing.name}
            onChange={(e) =>
              setTypeClothing({ ...TypeClothing, name: e.target.value })
            }
          />
          <button
            onClick={() => {
              if (TypeClothing?.name?.length) {
                onSendTypeClothing();
              }
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Активные типы</h1>
        </div>
        <div className="bottom__com com__category">
          {data.map((el) => (
            <div key={el.id} className="com__item__category">
              <span>{el.name}</span>
              <div>
                <button onClick={() => onPatch(el)}>
                  {el.isHide ? <IoMdEye /> : <IoMdEyeOff />}
                </button>
                <button onClick={() => onDelete(el.id)}>X</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
