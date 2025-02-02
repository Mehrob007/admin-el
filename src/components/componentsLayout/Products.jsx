import { useEffect, useRef, useState } from "react";
import Trash from "../../assets/icon/Trash.svg";
import testImg from "../../assets/img/99.png";
import backProductsIcon from "../../assets/icon/backProductsIcon.svg";
import Input from "../comElement/Input";
import activeCheckbox from "../../assets/icon//activeCheckbox.svg";
import apiClient from "../../utils/apiClient";
import { throttle } from "lodash";
import { useNavigate } from "react-router-dom";
import { getImageSrc } from "../../utils/urlImage";

function generateGUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (char) {
      const random = (Math.random() * 16) | 0;
      const value = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    },
  );
}

const defoultSize = [
  { on: false, name: "XXS" },
  { on: false, name: "XS" },
  { on: false, name: "S" },
  { on: false, name: "M" },
  { on: false, name: "L" },
  { on: false, name: "XL" },
  { on: false, name: "XXL" },
];

export default function Products() {
  const navigate = useNavigate();
  const [openForm, setOpenForm] = useState(false);
  const [edit, setEdit] = useState(false);
  const [inputColor, setInputColor] = useState("");
  const sizeDef = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const [dataCollections, setDataCollections] = useState([]);
  const [dataСategory, setDataСategory] = useState([]);
  const [sizeArr, setSizeArr] = useState([]);
  const [colorsArr, setColorsArr] = useState([]);

  const [formState, setFormState] = useState({
    newCollection: false,
    popular: false,
    categoryId: "",
    price: "",
    discount: "",
    shortDescription: "",
    fullDescription: "",
    care: "",
    images: [],
  });
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const [langthProduct, setLangthProduct] = useState(null);
  const [pageProduct, setPageProduct] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);
  const [pageCount, setPageCount] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [idAtributs, setIdAtributs] = useState([]);

  console.log("colorsArr", colorsArr);

  const limit = 20;

  const getProducts = async (count = null) => {
    try {
      const res = await apiClient.get(
        `Product/get-category-product?limit=${limit}&page=${
          count || pageCount
        }`,
      );
      const products = res.data.products[0] || [];
      setLangthProduct(res.data.totalItems || 0);
      setPageProduct(res.data.totalPages || 0);

      const uniqueProducts = products.filter(
        (newProduct) =>
          !dataProducts.some(
            (existingProduct) => existingProduct.price === newProduct.price,
          ),
      );
      setDataProducts(
        uniqueProducts?.map((el) => ({
          ...el,
          images: el?.images?.map((prev) => getImageSrc(prev)),
        })),
      );
      setFetching(false);
    } catch (e) {
      console.error("Error fetching products:", e);
      setLangthProduct(0);
      setHasMore(false);
    } finally {
      setFetching(false);
    }
  };

  const getPromoNames = async () => {
    try {
      const response = await apiClient.get("sizes");
      setSizeArr(
        response.data.data.sizes.map((e) => ({
          ...e,
          on: false,
        })),
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files) return;

    const base64Images = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        // Проверка размера файла
        alert("Размер файла не может превышать 5мб.");
        continue;
      }

      const base64 = await convertToBase64(file);
      base64Images.push(base64);
    }

    setFormState((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...base64Images],
    }));
  };
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const removeImage = (index) => {
    setFormState((prevState) => ({
      ...prevState,
      images: prevState?.images?.filter((_, i) => i !== index),
    }));
  };
  const validateForm = () => {
    const newErrors = {};

    if (!formState.shortDescription)
      newErrors.shortDescription = "Заголовок обязателен";
    if (!formState.categoryId) newErrors.categoryId = "Тип обязателен";
    if (!formState.price || isNaN(formState.price))
      newErrors.price = "Цена должна быть числом";
    // if (formState.discount && isNaN(formState.discount)) newErrors.discount = 'Скидка должна быть числом';
    if (formState.images.length === 0)
      newErrors.images = "Необходимо загрузить хотя бы одну фотографию";
    if (!formState.fullDescription)
      newErrors.fullDescription = "Описание обязательно";
    if (!formState.care) newErrors.care = "Уход обязателен";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const addProduct = async () => {
    console.log("!validateForm()", !validateForm());

    if (!validateForm()) return;
    try {
      if (edit) {
        let editData = { ...formState };
        delete editData.idProduct;
        console.log(JSON.stringify(editData));
        console.log("formStatein func", formState);

        const res = await apiClient.put(
          `Product/update-product?id=${formState?.idProduct}`,
          {
            ...editData,
            fullDescription: editData?.fullDescription?.replace(/\n/g, "<br>"),
            care: editData?.care?.replace(/\n/g, "<br>"),
          },
        );

        if (res.status >= 200 && res.status < 300) {
          console.log("Запрос выполнен успешно:", res.data);
          setOpenForm(false);
          setFormState({
            newCollection: false,
            popular: false,
            categoryId: "",
            price: "",
            discount: "",
            shortDescription: "",
            fullDescription: "",
            care: "",
            images: [],
          });
          setSizeArr(defoultSize);
          setColorsArr([]);
          setEdit(false);
          getProducts();
          // navigate(0)
        }
      }

      if (!edit) {
        const res = await apiClient.post("/Product/add-product", {
          ...formState,
          fullDescription: formState?.fullDescription?.replace(/\n/g, "<br>"),
          care: formState?.care?.replace(/\n/g, "<br>"),
        });
        if (res.status >= 200 && res.status < 300) {
          console.log("Запрос выполнен успешно:", res.data);
          setOpenForm(false);
          setFormState({
            newCollection: false,
            popular: false,
            categoryId: "",
            price: "",
            discount: "",
            shortDescription: "",
            fullDescription: "",
            care: "",
            images: [],
          });
          setSizeArr(defoultSize);
          setColorsArr([]);
          setEdit(false);
          getProducts();
          navigate(0);
        }
      }
    } catch (e) {
      console.error("Ошибка при выполнении запроса:", e.message);
    }
  };

  const onDelete = async (id) => {
    try {
      const res = await apiClient.delete(`Product/delete-product/${id}`);
      navigate(0);
      if (res.data) {
        setTimeout(navigate(0), 1000);
      }
    } catch (el) {
      console.error(el);
    }
  };

  const onChange = (name, value) => {
    setFormState({
      ...formState,
      [name]: value,
    });
  };
  const getCollections = async () => {
    try {
      const res = await apiClient.get("collections/admins");
      setDataCollections(res.data.data.collections);
    } catch (e) {
      console.error(e);
    }
  };

  const getСategory = async () => {
    try {
      const res = await apiClient.get("/categories");
      setDataСategory(res.data.data.categories);
    } catch (e) {
      console.error(e);
      setDataСategory([]);
    }
  };

  useEffect(() => {
    if (fetching) {
      getProducts();
    }
  }, [pageCount, fetching]);

  useEffect(() => {
    // getProducts();
    setFetching(true);
    getCollections();
    getСategory();
    getPromoNames();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.documentElement.offsetHeight - 20;
      if (
        pageCount < pageProduct &&
        !openForm &&
        scrollPosition >= threshold &&
        !fetching
      ) {
        setFetching(true);
        setPageCount((prevCount) => prevCount + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  const handleSaveChanges = () => {
    setFormState((prevState) => ({
      ...prevState,
      colors: colorsArr.map((e) => ({ ...e, id: e.id })),
      sizes: sizeArr
        .filter((el) => el.on)
        .map((el) => ({ sizeValue: el.name, id: el.id })),
    }));
  };
  useEffect(() => {
    if (formState.sizes?.length && formState?.colors?.length) {
      addProduct();
    }
  }, [formState]);

  console.log("====================================");
  console.log("dataProducts", dataProducts);
  console.log("formState", formState);
  console.log("colorEdit", colorsArr);
  console.log("pageProduct", pageProduct);
  console.log("langthProduct", langthProduct);
  console.log("edit", edit);
  console.log("sizeArr", sizeArr);
  console.log("id", idAtributs);
  console.log("Errors", errors);
  console.log("dataСategory", JSON.stringify(dataСategory));

  console.log("====================================");

  return (
    <div>
      {!openForm ? (
        <div className="com__box">
          <div className="content__photo__gallery">
            <div className="top__com">
              <h1>Товары</h1>
              <p>Добавляйте, редактируйте или удаляйте товары</p>
            </div>
          </div>
          <div className="bottom__com">
            <button
              style={{ width: "250px" }}
              onClick={() => {
                setOpenForm(true);
                if (!edit) {
                  setFormState((prevState) => ({
                    ...prevState,
                    id: langthProduct + 1,
                  }));
                }
              }}
            >
              Добавить новый товар
            </button>
          </div>
        </div>
      ) : (
        <div className="com__box">
          <div className="content__photo__gallery">
            <div className="top__com">
              <img
                onClick={() => {
                  setOpenForm(false);
                  // navigate(0)
                  setEdit(false);
                  setSizeArr(defoultSize);
                  setColorsArr([]);
                  setFormState({
                    newCollection: false,
                    popular: false,
                    categoryId: "",
                    price: "",
                    discount: "",
                    shortDescription: "",
                    fullDescription: "",
                    care: "",
                    descriptionProduct: "",
                    images: [],
                    collectionId: "",
                  });
                }}
                className="button__back"
                src={backProductsIcon}
                alt="backProductsIcon"
              />
              <h1>Редактирование товара</h1>
              <p>Не забудьте нажать на кнопку “Сохранить”</p>
            </div>
            <button onClick={handleSaveChanges}>Сохранить изменения</button>
          </div>
        </div>
      )}
      <div className="com__box">
        {!openForm && (
          <div className="product__items">
            <div className="item">
              {dataProducts.map((el) => (
                <div key={el?.id}>
                  <div className="id__parsing__product">
                    <h1>Позиция</h1>
                    <span>{el?.id}</span>
                  </div>
                  <img src={el?.images?.[0]} alt="imgProduct" />
                  <div>
                    <div className="top__info__product">
                      <h1>{el?.shortDescription}</h1>
                      <p>{el?.descriptionProduct}</p>
                    </div>
                    <div className="main___info__product">
                      <div>
                        <label>Цена:</label>
                        <p>{el?.price} RUB</p>
                      </div>
                      <div>
                        <label>Размеры:</label>
                        {el?.sizes
                          ?.sort(
                            (a, b) =>
                              sizeDef.indexOf(a.sizeValue) -
                              sizeDef.indexOf(b.sizeValue),
                          )
                          ?.map((el, i) => (
                            <p key={i}>{el?.sizeValue}</p>
                          ))}
                      </div>
                      <div>
                        <label>Цвета:</label>
                        {el?.colors?.map((el, i) => (
                          <p key={i}>
                            {el?.name[0] !== "#" ? "#" : ""}
                            {el?.name?.split("|")[0]}
                          </p>
                        ))}
                        {/* <p>#262626 #262626</p> */}
                      </div>
                    </div>
                    <div className="bottom__action__product"></div>
                    <div className="bottom__com" style={{ marginTop: "20px" }}>
                      <button
                        onClick={() => {
                          setOpenForm(true);
                          setEdit(true);
                          const editData = { ...el };
                          setColorsArr(
                            el?.colors?.map((el) => ({
                              name: `${el?.name[0] !== "#" ? "#" : ""}${
                                el?.name
                              }`,
                              id: el?.id,
                            })),
                          );
                          const updatedSizes = sizeArr.map((size) => {
                            const isAvailable = el?.sizes?.some(
                              (attribute) => attribute.sizeValue === size.name,
                            );
                            if (isAvailable) {
                              return {
                                ...size,
                                on: isAvailable,
                                id: generateGUID(),
                              };
                            } else {
                              return { ...size, id: generateGUID() };
                            }
                          });
                          setIdAtributs([
                            el?.attributes?.filter(
                              (e) => e.productAttributeId !== 1,
                            )?.[0]?.id,
                            el?.attributes?.filter(
                              (e) => e.productAttributeId !== 1,
                            )?.[0]?.id,
                          ]);
                          setSizeArr(updatedSizes);
                          delete editData.colors;
                          delete editData.sizes;
                          setFormState(editData);
                        }}
                      >
                        Изменить
                      </button>
                      <button
                        style={{ width: 45 }}
                        onClick={() => onDelete(el.idProduct)}
                      >
                        <img src={Trash} alt="Trash" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {openForm &&
          (langthProduct !== null ? (
            <div className="form__product">
              <div className="com__dop__input">
                <label>Заголовок</label>
                <div className="title__products__add">
                  <Input
                    value={formState.shortDescription}
                    onChange={(e) =>
                      onChange("shortDescription", e.target.value)
                    }
                    styleInput={{ width: "520px" }}
                  />
                  <span className="id__product">ID: {formState.id}</span>
                </div>
                {!formState.shortDescription && (
                  <p className="error">Поле обязательно для заполнения.</p>
                )}
              </div>
              <div className="com__dop__input">
                <label>Подзаголовок</label>
                <div className="title__products__add">
                  <Input
                    value={formState.descriptionProduct}
                    onChange={(e) =>
                      onChange("descriptionProduct", e.target.value)
                    }
                    styleInput={{ width: "520px" }}
                  />
                </div>
                {!formState.descriptionProduct && (
                  <p className="error">Поле обязательно для заполнения.</p>
                )}
              </div>
              <div className="select__form__product">
                <div className="com__dop__input">
                  <label>Коллекция</label>
                  <select
                    className="select__com"
                    value={formState.collectionId}
                    onChange={(e) => onChange("collectionId", e.target.value)}
                  >
                    <option value="">Коллекция</option>
                    {dataCollections?.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                    {/* <option value="1">Essential</option> */}
                  </select>
                </div>
                <div className="com__dop__input">
                  <label>Тип</label>
                  <select
                    className="select__com"
                    value={formState.categoryId}
                    onChange={(e) => onChange("categoryId", e.target.value)}
                  >
                    <option value="">Тип</option>
                    {dataСategory?.map((el) => (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                  {!formState.categoryId && (
                    <p className="error">Поле обязательно для заполнения.</p>
                  )}
                </div>
              </div>
              <div className="check__box__form"></div>
              <div className="input__form__product">
                <div className="com__dop__input">
                  <label>Цена</label>
                  <div>
                    <Input
                      value={formState.price}
                      onChange={(e) => onChange("price", e.target.value)}
                      classNameDiv="input__collection"
                      styleInput={{ width: "180px" }}
                    />
                    <div className="box__valut">RUB</div>
                  </div>
                  {!formState.price && (
                    <p className="error">Поле обязательно для заполнения.</p>
                  )}
                </div>
                <div className="com__dop__input">
                  <label style={{ color: "#AA4D45" }}>Скидка</label>
                  <div>
                    <Input
                      value={formState.discount}
                      onChange={(e) => onChange("discount", e.target.value)}
                      classNameDiv="input__collection"
                      styleInput={{ width: "180px" }}
                    />
                    <div className="box__valut">RUB</div>
                  </div>
                </div>
              </div>
              <div className="colot__section">
                <div className="color__top__element">
                  <h1>Цвет</h1>
                  <p>Введите номер цвета в формате HEX “#000000”</p>
                  <div>
                    <Input
                      styleInput={{
                        width: "165px",
                        paddingLeft: "25px",
                        borderBottom: `1px solid ${
                          inputColor.length !== 9 ? "red" : "green"
                        }`,
                      }}
                      value={inputColor}
                      classNameDiv="color__input"
                      onChange={(e) => {
                        setInputColor(e.target.value);
                      }}
                    />{" "}
                    <button
                      onClick={() => {
                        if (inputColor) {
                          setColorsArr([
                            ...colorsArr,
                            { name: inputColor, id: generateGUID() },
                          ]);
                          setInputColor("");
                        }
                      }}
                    >
                      Добавить
                    </button>
                  </div>
                  {!colorsArr && (
                    <p className="error">Поле обязательно для заполнения.</p>
                  )}
                </div>
                <div className="colars__parsing">
                  {colorsArr.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        background: `${item.name[0] !== "#" ? "#" : ""}${
                          item.name.split("|")[0]
                        }`,
                      }}
                    >
                      {item.name[0] !== "#" ? "#" : ""}
                      {item.name}
                      <button
                        onClick={() => {
                          // setFormState({
                          //   ...formState,
                          //   colors: formState.colors.filter((el) => item.id !== el.id)
                          // })
                          setColorsArr(
                            colorsArr.filter((el) => item.id !== el.id),
                          );
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="com__dop__input">
                <label>Размеры</label>
                <div className="size__arr__com">
                  {sizeArr.map((a, i) => (
                    <div
                      onClick={() =>
                        setSizeArr(
                          sizeArr.map((e) => {
                            if (e.id === a.id) {
                              return { ...e, on: !e.on };
                            } else {
                              return e;
                            }
                          }),
                        )
                      }
                      className={a.on && "actiove__div__size"}
                      key={i}
                    >
                      {a.name}
                    </div>
                  ))}
                </div>
                {!sizeArr && (
                  <p className="error">Поле обязательно для заполнения.</p>
                )}
              </div>
              <div className="com__dop__input">
                <label>Описание</label>
                <div className="textarea__arr__com">
                  <textarea
                    value={formState.fullDescription.replace(
                      /<br\s*\/?>/g,
                      "\n",
                    )}
                    onChange={(e) =>
                      onChange("fullDescription", e.target.value)
                    }
                    name=""
                    id=""
                  ></textarea>
                  {!formState.fullDescription && (
                    <p className="error">Поле обязательно для заполнения.</p>
                  )}
                </div>
              </div>
              <div className="com__dop__input">
                <label>Уход</label>
                <div className="textarea__arr__com">
                  <textarea
                    value={formState.care.replace(/<br\s*\/?>/g, "\n")}
                    onChange={(e) => onChange("care", e.target.value)}
                    name=""
                    id=""
                  ></textarea>
                  {!formState.care && (
                    <p className="error">Поле обязательно для заполнения.</p>
                  )}
                </div>
              </div>
              <div className="com__img__product" style={{ padding: 0 }}>
                <h1>Фотографии</h1>
                <p>
                  Загрузите 4,6 или 8 фотографий. Размер фото не может быть
                  более 5мб.
                </p>
                <button
                  style={{ width: "250px" }}
                  onClick={() => fileInputRef.current.click()}
                >
                  Добавить
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                />
                {!formState?.images && (
                  <p className="error">Поле обязательно для заполнения.</p>
                )}
                <div className="arr__img__rodect">
                  {formState?.images?.map((el, i) => (
                    <div key={i}>
                      <img src={el} alt="imgProduct" />
                      <span>
                        <button
                          style={{ width: 45 }}
                          onClick={() => removeImage(i)}
                        >
                          <img src={Trash} alt="Trash" />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <h1>Загрузка...</h1>
          ))}
      </div>
    </div>
  );
}
