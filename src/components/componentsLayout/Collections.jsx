import { useEffect, useState } from "react";
import Input from "../comElement/Input";
import apiClient from "../../utils/apiClient";

export default function Collections() {
  const [data, setData] = useState([]);
  const [Collection, setCollection] = useState({
    name: "",
  });
  const onSendcollection = async () => {
    try {
      const res = await apiClient.post("/collections", Collection);
      console.log(res);
      getCollections();
      setCollection({});
    } catch (e) {
      console.error(e);
    }
  };
  const getCollections = async () => {
    try {
      const res = await apiClient.get("collections/admins");
      setData(res.data.data.collections);
    } catch (e) {
      console.error(e);
      setData([]);
    }
  };
  const onDelete = async (id) => {
    try {
      const res = await apiClient.delete("/collections", {
        data: {
          id: id,
          forceDeleted: true,
        },
      });
      console.log(res);
      getCollections();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  return (
    <div>
      <div className="com__box">
        <div className="top__com">
          <h1>Коллекции</h1>
          <p>Добавьте новую коллекцию</p>
        </div>
        <div className="bottom__com">
          <Input
            value={Collection.name}
            onChange={(e) =>
              setCollection({ ...Collection, name: e.target.value })
            }
          />
          <button onClick={onSendcollection}>Сохранить</button>
        </div>
      </div>
      <div className="com__box">
        <div className="top__com">
          <h1>Активные коллекции</h1>
        </div>
        <div className="bottom__com com__category">
          {data.map((el) => (
            <div key={el.id} className="com__item__category">
              <span>{el.name}</span>

              <button onClick={() => onDelete(el.id)}>x</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
