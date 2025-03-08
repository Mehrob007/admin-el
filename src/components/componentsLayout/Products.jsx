import { useEffect, useRef, useState } from "react";
import Trash from "../../assets/icon/Trash.svg";
import testImg from "../../assets/img/99.png";
import backProductsIcon from "../../assets/icon/backProductsIcon.svg";
import Input from "../comElement/Input";
import activeCheckbox from "../../assets/icon//activeCheckbox.svg";
import apiClient from "../../utils/apiClient";
import { size, throttle } from "lodash";
import { useNavigate } from "react-router-dom";
import { getImageSrc } from "../../utils/urlImage";
import axios from "axios";
import apiClientFiles from "../../utils/apiFileService";
import { FaFontAwesome } from "react-icons/fa";

const defItem = {
  newCollection: false,
  category: {
    id: "",
  },
  cost: "",
  preCost: "",
  name: "",
  description: "",
  care: "",
  images: [],
  collection: {
    id: "",
  },
  dimension: {
    dx: 0,
    dy: 0,
    dz: 0,
    weight: 0,
  },
  sizes: [],
  colorEdit: "",
};

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
  const [images, setImages] = useState([]);
  const [modalAddColor, setModalAddColor] = useState(false);
  const sizeDef = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
  const [dataCollections, setDataCollections] = useState([]);
  const [dataСategory, setDataСategory] = useState([]);
  const [sizeArr, setSizeArr] = useState([]);
  const [colorsArr, setColorsArr] = useState([]);
  const [nameColor, setNameColor] = useState([]);

  const [formState, setFormState] = useState({
    newCollection: false,
    category: {
      id: "",
    },
    cost: "",
    preCost: "",
    name: "",
    description: "",
    care: "",
    images: [],
    collection: {
      id: "",
    },
    colorEdit: "",
  });
  const [allData, setAllData] = useState([]);
  const [allDataVibor, setAllDataVibor] = useState("");
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const [langthProduct, setLangthProduct] = useState(null);
  const [pageProduct, setPageProduct] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idAtributs, setIdAtributs] = useState([]);

  const validateForm = () => {
    const newErrors = allData.map(() => ({}));
    for (let i = 0; i < allData.length; i++) {
      if (!allData[i]?.name) newErrors[i].name = "Заголовок обязателен";
      if (!allData[i]?.shortDescription)
        newErrors[i].shortDescription = "Описание обязательно";
      if (!allData[i]?.collection?.id)
        newErrors[i].collection = "Коллекция обязателен";
      if (!allData[i]?.category?.id) newErrors[i].category = "Тип обязателен";
      if (!allData[i].cost || isNaN(allData[i].cost))
        newErrors[i].cost = "Цена должна быть числом";
      // if (allData[i].preCost && isNaN(allData[i].preCost)) newErrors[i].preCost = 'Скидка должна быть числом';
      if (!allData[i]?.sizes?.length)
        newErrors[i].sizes = "Необходимо загрузить хотя бы одну фотографию";

      if (!allData[i]?.description)
        newErrors[i].description = "Описание обязательно";
      if (!allData[i]?.dimension?.dx)
        newErrors[i].dimensionXd = "Описание обязательно";
      if (!allData[i]?.dimension?.dy)
        newErrors[i].dimensionYd = "Описание обязательно";
      if (!allData[i]?.dimension?.dz)
        newErrors[i].dimensionZd = "Описание обязательно";
      if (!allData[i]?.dimension?.weight)
        newErrors[i].dimensionWeight = "Описание обязательно";

      if (!allData[i]?.care) newErrors[i].care = "Уход обязателен";
      if (edit && allData[i]?.colorEdit?.length !== 7)
        newErrors[i].colorEdit = "Введите корректный цвет!";
      if (allData[i]?.images.length === 0)
        newErrors[i].images = "Необходимо загрузить хотя бы одну фотографию";
    }

    setErrors(newErrors);
    // Object.keys(newErrors).length === 0;
    // return Object.keys(newErrors) === 0;
    for (const e of newErrors) {
      if (Object.keys(e).length !== 0) {
        return false;
      }
    }
    return true;
  };

  const getProductsId = async (id) => {
    try {
      const res = await apiClient.get(`/products/full?id=${id}`);
      console.log(res);
      const editData = res?.data?.data;
      setAllData([
        {
          ...defItem,
          ...editData,
          color: { hex: editData?.selectedColor?.hex },
          colorEdit: editData?.selectedColor?.hex,
        },
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const getProducts = async (count = null) => {
    try {
      // const res = await apiClient.get(
      //   `Product/get-category-product?limit=${limit}&page=${
      //     count || pageCount
      //   }`,
      // );
      const res = await apiClient.get(`/products?page=${count || pageCount}`);
      const products = res.data.data.products;
      // setLangthProduct(res.data.totalItems || 0);
      // setPageProduct(res.data.totalPages || 0);

      // const uniqueProducts = products.filter(
      //   (newProduct) =>
      //     !dataProducts.some(
      //       (existingProduct) => existingProduct.cost === newProduct.cost,
      //     ),
      // );
      setDataProducts(
        // uniqueProducts?.map((el) => ({
        //   ...el,
        //   // images: el?.images?.map((prev) => getImageSrc(prev)),
        // })),
        [...dataProducts, ...products],
      );
      setFetching(false);
      setPageCount((prevCount) => prevCount + 1);
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

  const addPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const [res, imgBase64] = await Promise.all([
        apiClientFiles.post("photos/upload", formData),
        convertToBase64(file),
      ]);

      return { source: res.data.source, sourceLoc: imgBase64 };
    } catch (e) {
      console.error("Ошибка при загрузке фото:", e);
    }
  };
  const handleFileChange = async (event, color) => {
    const files = Array.from(event.target.files);
    if (!files.length) return;
    const prevState = allData.find((prev) => prev.color.hex === color);

    if (!prevState) {
      console.error(`Цвет ${color} не найден в allData`);
      return;
    }

    let photos = [];

    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не может превышать 5мб.");
        continue; // Пропускаем этот файл, но не прерываем цикл
      }

      let itemPhoto = await addPhoto(file, color);
      photos.push(itemPhoto);

      if (edit) {
        await apiClient.put(import.meta.env.VITE_ENV_URL + "images", {
          productId: prevState?.selectedColor?.productId,
          imageSource: itemPhoto?.source,
        });
      }
    }

    onChange("images", [...prevState.images, ...photos], color);
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const removeImage = async (src, color, imageId = null) => {
    if (edit && imageId) {
      const prevState = await allData.find((prev) => prev.color.hex === color);
      try {
        await apiClient.delete(import.meta.env.VITE_ENV_URL + "images", {
          data: {
            productId: prevState?.selectedColor?.productId,
            imageId: imageId,
          },
        });
        onChange(
          "images",
          prevState.images.filter((e) => e.source !== src),
          color,
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      const prevState = await allData.find((prev) => prev.color.hex === color);
      onChange(
        "images",
        prevState.images.filter((e) => e.source !== src),
        color,
      );
    }
    // console.log("imageId", imageId);
  };

  // const addProduct = async () => {
  //   console.log("!validateForm()", !validateForm());

  //   if (!validateForm()) return;
  //   try {
  //     if (edit) {
  //       let editData = { ...formState };
  //       delete editData.idProduct;
  //       console.log(JSON.stringify(editData));
  //       console.log("formStatein func", formState);

  //       const res = await apiClient.put(
  //         `Product/update-product?id=${formState?.idProduct}`,
  //         {
  //           ...editData,
  //           description: editData?.description?.replace(/\n/g, "<br>"),
  //           care: editData?.care?.replace(/\n/g, "<br>"),
  //         },
  //       );

  //       if (res.status >= 200 && res.status < 300) {
  //         console.log("Запрос выполнен успешно:", res.data);
  //         setOpenForm(false);
  //         setFormState({
  //           newCollection: false,
  //           category: {
  //             id: "",
  //           },
  //           cost: "",
  //           preCost: "",
  //           name: "",
  //           description: "",
  //           care: "",
  //           images: [],
  //         });
  //         setSizeArr(defoultSize);
  //         setColorsArr([]);
  //         setEdit(false);
  //         getProducts();
  //         // navigate(0)
  //       }
  //     }

  //     if (!edit) {
  //       const res = await apiClient.post("/Product/add-product", {
  //         ...formState,
  //         description: formState?.description?.replace(/\n/g, "<br>"),
  //         care: formState?.care?.replace(/\n/g, "<br>"),
  //       });
  //       if (res.status >= 200 && res.status < 300) {
  //         console.log("Запрос выполнен успешно:", res.data);
  //         setOpenForm(false);
  //         setFormState({
  //           newCollection: false,
  //           category: {
  //             id: "",
  //           },
  //           cost: "",
  //           preCost: "",
  //           name: "",
  //           description: "",
  //           care: "",
  //           images: [],
  //         });
  //         setSizeArr(defoultSize);
  //         setColorsArr([]);
  //         setEdit(false);
  //         getProducts();
  //         navigate(0);
  //       }
  //     }
  //   } catch (e) {
  //     console.error("Ошибка при выполнении запроса:", e.message);
  //   }
  // };

  const onDelete = async (id) => {
    try {
      const res = await apiClient.delete(`products`, {
        data: {
          id: id,
          forceDeleted: true,
        },
      });
      // navigate(0);
      if (res.data) {
        setTimeout(navigate(0), 1000);
      }
    } catch (el) {
      console.error(el);
    }
  };

  const onChange = (name, value, color) => {
    // setFormState({
    //   ...formState,
    //   [name]: value,
    // });
    setAllData(
      allData.map((prev) => {
        if (prev?.color?.hex === color) {
          return {
            ...prev,
            [name]: value,
          };
        } else {
          return prev;
        }
      }),
    );
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

  const handleSaveChanges = async () => {
    const resultValid = await validateForm();
    if (!resultValid) return;

    try {
      setLoading(true);
      if (edit) {
        let sendData = allData.map((e) => ({
          ...e,
          images: e?.images.map((prev) => ({
            source: prev.source,
          })),
          preCost: e?.preCost || 0,
        }))[0];
        await apiClient.patch(
          "/products",
          {
            productId: sendData?.selectedColor?.productId,
            ...sendData,
            color: { hex: sendData?.colorEdit },
          },
          //   {
          //   seriesId: sendData?.seriesId,
          //   newProduct: sendData,
          // }
        );
      } else {
        await apiClient.post(
          "/products",
          allData.map((e) => ({
            ...e,
            images: e?.images.map((prev) => ({
              source: prev.source,
            })),
            preCost: e?.preCost || 0,
          })),
        );
      }
      setTimeout(() => navigate(0), 100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  // useEffect(() => {
  //   if (formState.sizes?.length) {
  //     addProduct();
  //   }
  // }, [formState]);
  console.log("alldata", allData);

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
      const threshold = document.documentElement.offsetHeight - 10;
      if (!openForm && scrollPosition >= threshold && !fetching) {
        setFetching(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetching]);

  return (
    <>
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
                  // if (!edit) {
                  //   setFormState((prevState) => ({
                  //     ...prevState,
                  //     id: langthProduct + 1,
                  //   }));
                  // }
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
                    // setSizeArr(defoultSize);
                    // setColorsArr([]);
                    setAllData([]);
                    setErrors([]);
                    // setFormState({
                    //   newCollection: false,
                    //   category: {
                    //     id: "",
                    //   },
                    //   cost: "",
                    //   preCost: "",
                    //   name: "",
                    //   description: "",
                    //   care: "",
                    //   shortDescription: "",
                    //   images: [],
                    //   collection: {
                    //     id: "",
                    //   },
                    // });
                  }}
                  className="button__back"
                  src={backProductsIcon}
                  alt="backProductsIcon"
                />
                <h1>{edit ? "Редактирование" : "Сохранение"} товара</h1>
                <p>Не забудьте нажать на кнопку “Сохранить”</p>
              </div>
              <button
                style={{ background: loading && "D9D9D9" }}
                onClick={() => {
                  if (!loading) {
                    handleSaveChanges();
                  }
                }}
              >
                Сохранить изменения
              </button>
            </div>
          </div>
        )}
        <div className="com__box">
          {!openForm && (
            <div className="product__items">
              <div className="item">
                {dataProducts.map((el) => {
                  const sortedData = el?.images
                    ?.slice()
                    ?.sort((a, b) => a.id - b.id);
                  return (
                    <div key={el?.id}>
                      <div className="id__parsing__product">
                        <h1>Позиция</h1>
                        <span>{el?.id}</span>
                      </div>
                      <img
                        src={
                          import.meta.env.VITE_ENV_URL_FILE +
                          `photos?photo=${sortedData?.[0]?.source}`
                        }
                        alt="imgProduct"
                      />
                      <div>
                        <div className="top__info__product">
                          <h1>{el?.name}</h1>
                          <p>{el?.shortDescription}</p>
                        </div>
                        <div className="main___info__product">
                          <div>
                            <label>Цена:</label>
                            <p>{+el.preCost ? el?.preCost : el?.cost} RUB</p>
                          </div>
                          <div>
                            <label>Размеры:</label>
                            {el?.sizes
                              ?.sort(
                                (a, b) =>
                                  sizeDef.indexOf(a.name) -
                                  sizeDef.indexOf(b.name),
                              )
                              ?.map((el, i) => (
                                <p key={i}>{el?.name}</p>
                              ))}
                          </div>
                          <div>
                            <label>Цвета:</label>
                            {el?.colors?.map((el, i) => (
                              <p key={i}>
                                {el?.hex}
                                {/* {el?.hex?.split("|")[0]} */}
                              </p>
                            ))}
                            {/* <p>#262626 #262626</p> */}
                          </div>
                        </div>
                        <div className="bottom__action__product"></div>
                        <div
                          className="bottom__com"
                          style={{ marginTop: "20px" }}
                        >
                          <button
                            onClick={() => {
                              setOpenForm(true);
                              setEdit(true);
                              const editData = { ...el };
                              console.log("editData", editData);

                              getProductsId(editData?.selectedColor?.productId);
                              // setColorsArr(
                              //   el?.colors?.map((el) => ({
                              //     name: `${el?.name[0] !== "#" ? "#" : ""}${
                              //       el?.name
                              //     }`,
                              //     id: el?.id,
                              //   })),
                              // );
                              // const updatedSizes = sizeArr.map((size) => {
                              //   const isAvailable = el?.sizes?.some(
                              //     (attribute) =>
                              //       attribute.sizeValue === size.name,
                              //   );
                              //   if (isAvailable) {
                              //     return {
                              //       ...size,
                              //       on: isAvailable,
                              //       id: generateGUID(),
                              //     };
                              //   } else {
                              //     return { ...size, id: generateGUID() };
                              //   }
                              // });
                              // setIdAtributs([
                              //   el?.attributes?.filter(
                              //     (e) => e.productAttributeId !== 1,
                              //   )?.[0]?.id,
                              //   el?.attributes?.filter(
                              //     (e) => e.productAttributeId !== 1,
                              //   )?.[0]?.id,
                              // ]);
                              // setSizeArr(updatedSizes);
                              // delete editData.colors;
                              // delete editData.sizes;
                              // setFormState(editData);
                            }}
                          >
                            Изменить
                          </button>
                          <button
                            style={{ width: 45 }}
                            onClick={() => onDelete(el.id)}
                          >
                            <img src={Trash} alt="Trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {openForm && (
            <>
              {!edit && (
                <div className="menu__color__products">
                  <div>
                    {allData?.map((e) => (
                      <span
                        onClick={() => setAllDataVibor(e.color.hex)}
                        // className={
                        //   e.color.hex === allDataVibor && "active__nav__product"
                        // }
                        style={{
                          backgroundColor: e.color.hex,
                          borderTop:
                            e.color.hex === allDataVibor && "5px solid #408759",
                        }}
                        key={e.color.hex}
                      ></span>
                    ))}
                  </div>
                  <button onClick={() => setModalAddColor(true)}>+</button>
                </div>
              )}
              {allData
                ?.filter((prev) =>
                  !edit ? prev?.color?.hex == allDataVibor : true,
                )
                ?.map((formState, _, Arr) => {
                  let i = allData
                    .map((e, i) =>
                      formState?.color?.hex == e?.color?.hex ? i : "*",
                    )
                    .filter((e) => e != "*")[0];
                  return (
                    <div className="form__product" key={formState?.color?.hex}>
                      <div className="com__dop__input">
                        <label>Заголовок</label>
                        <div className="title__products__add">
                          <Input
                            value={formState?.name}
                            onChange={(e) =>
                              onChange(
                                "name",
                                e.target.value,
                                formState?.color?.hex,
                              )
                            }
                            styleInput={{ width: "520px" }}
                          />
                          {/* <span className="id__product">ID: {formState.id}</span> */}
                        </div>
                        {errors?.[i]?.name && (
                          <p className="error">
                            Поле обязательно для заполнения.
                          </p>
                        )}
                      </div>
                      <div className="com__dop__input">
                        <label>Подзаголовок</label>
                        <div className="title__products__add">
                          <Input
                            value={formState.shortDescription}
                            onChange={(e) =>
                              onChange(
                                "shortDescription",
                                e.target.value,
                                formState?.color?.hex,
                              )
                            }
                            styleInput={{ width: "520px" }}
                          />
                        </div>
                        {errors?.[i]?.shortDescription && (
                          <p className="error">
                            Поле обязательно для заполнения.
                          </p>
                        )}
                      </div>
                      {/* <div className="check__box__form">
                        <div
                          className="check__box"
                          onClick={() => {
                            // setFormState((prev) => ({
                            //   ...prev,
                            //   newCollection: !formState.newCollection,
                            // }));
                            onChange(
                              "newCollection",
                              !formState.newCollection,
                              formState?.color?.hex,
                            );
                          }}
                        >
                          <label>New collection</label>
                          <span>
                            {formState.newCollection && (
                              <img src={activeCheckbox} alt="activeCheckbox" />
                            )}
                          </span>
                        </div>
                      </div> */}
                      <div className="select__form__product">
                        <div className="com__dop__input">
                          <label>Коллекция</label>
                          <select
                            className="select__com"
                            value={formState?.collection?.id}
                            onChange={(e) =>
                              onChange(
                                "collection",
                                { id: +e.target.value },
                                formState?.color?.hex,
                              )
                            }
                          >
                            <option value="">Коллекция</option>
                            {dataCollections?.map((el) => (
                              <option key={el.id} value={el.id}>
                                {el.name}
                              </option>
                            ))}
                          </select>
                          {errors?.[i]?.collection && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                        <div className="com__dop__input">
                          <label>Тип</label>
                          <select
                            className="select__com"
                            value={formState?.category?.id}
                            onChange={(e) =>
                              onChange(
                                "category",
                                { id: +e.target.value },
                                formState?.color?.hex,
                              )
                            }
                          >
                            <option value="">Тип</option>
                            {dataСategory?.map((el) => (
                              <option key={el.id} value={el.id}>
                                {el.name}
                              </option>
                            ))}
                          </select>
                          {errors?.[i]?.category && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="input__form__product">
                        <div className="com__dop__input">
                          <label>Цена</label>
                          <div>
                            <Input
                              value={formState.cost}
                              onChange={(e) =>
                                onChange(
                                  "cost",
                                  +e.target.value,
                                  formState?.color?.hex,
                                )
                              }
                              classNameDiv="input__collection"
                              styleInput={{ width: "180px" }}
                            />
                            <div className="box__valut">RUB</div>
                          </div>
                          {errors?.[i]?.cost && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                        <div className="com__dop__input">
                          <label style={{ color: "#AA4D45" }}>Скидка</label>
                          <div>
                            <Input
                              value={formState.preCost}
                              onChange={(e) =>
                                onChange(
                                  "preCost",
                                  +e.target.value,
                                  formState?.color?.hex,
                                )
                              }
                              classNameDiv="input__collection"
                              styleInput={{ width: "180px" }}
                            />
                            <div className="box__valut">RUB</div>
                          </div>
                        </div>
                      </div>
                      {edit && (
                        <>
                          <div
                            className="com__dop__input"
                            style={{ width: "540px" }}
                          >
                            <label>Цвет (hex)</label>
                            <div style={{ width: "100%" }}>
                              <Input
                                value={`${formState.colorEdit}`}
                                onChange={(e) =>
                                  onChange(
                                    "colorEdit",
                                    `${e.target.value}`,
                                    formState?.color?.hex,
                                  )
                                }
                                classNameDiv="input__collection"
                                styleInput={{ fontWeight: 600 }}
                                // style={{ width: "540px" }}
                                typeHtml="text"
                              />
                              <span
                                style={{
                                  backgroundColor: formState.colorEdit,
                                  width: 45,
                                  height: 45,
                                  position: "absolute",
                                  left: 213,
                                  bottom: 0,
                                }}
                              ></span>
                            </div>
                          </div>
                          {errors?.[i]?.colorEdit && (
                            <p className="error">{errors?.[i]?.colorEdit}</p>
                          )}
                        </>
                      )}
                      <div className="com__dop__input">
                        <label>Размеры</label>
                        <div className="size__arr__com">
                          {sizeArr.map((a, i) => (
                            <div
                              onClick={
                                () => {
                                  // console.log(
                                  //   Arr.find(
                                  //     (prev) =>
                                  //       prev?.color?.hex ===
                                  //       formState?.color?.hex,
                                  //   )?.sizes,
                                  // );

                                  const prevState = Arr.find(
                                    (prev) =>
                                      prev?.color?.hex ===
                                      formState?.color?.hex,
                                  )?.sizes;
                                  if (
                                    Arr.find(
                                      (prev) =>
                                        prev.color.hex == formState?.color?.hex,
                                    )
                                      ?.sizes?.map((e) => e?.id)
                                      ?.includes(a?.id)
                                  ) {
                                    onChange(
                                      "sizes",
                                      prevState.filter(
                                        (prev) => prev.id !== a?.id,
                                      ),
                                      formState?.color?.hex,
                                    );
                                  } else {
                                    onChange(
                                      "sizes",
                                      [...prevState, { id: a.id }],
                                      formState?.color?.hex,
                                    );
                                  }
                                }
                                // setSizeArr(
                                //   sizeArr.map((e) => {
                                //     if (e.id === a.id) {
                                //       return { ...e, on: !e.on };
                                //     } else {
                                //       return e;
                                //     }
                                //   }),
                                // )
                              }
                              className={
                                Arr.find(
                                  (prev) =>
                                    prev.color.hex == formState?.color?.hex,
                                )
                                  ?.sizes?.map((e) => e?.id)
                                  ?.includes(a?.id) && "actiove__div__size"
                              }
                              key={i}
                            >
                              {a.name}
                            </div>
                          ))}
                        </div>
                        {errors?.[i]?.sizes && (
                          <p className="error">Размер обязательно.</p>
                        )}
                      </div>

                      <div className="com__dop__input">
                        <label>Описание</label>
                        <div className="textarea__arr__com">
                          <textarea
                            value={formState.description.replace(
                              /<br\s*\/?>/g,
                              "\n",
                            )}
                            onChange={(e) =>
                              onChange(
                                "description",
                                e.target.value,
                                formState?.color?.hex,
                              )
                            }
                            name=""
                            id=""
                          ></textarea>
                          {errors?.[i]?.description && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="com__dop__input">
                        <label>Уход</label>
                        <div className="textarea__arr__com">
                          <textarea
                            value={formState.care.replace(/<br\s*\/?>/g, "\n")}
                            onChange={(e) =>
                              onChange(
                                "care",
                                e.target.value,
                                formState?.color?.hex,
                              )
                            }
                            name=""
                            id=""
                          ></textarea>
                          {errors?.[i]?.care && (
                            <p className="error">{errors?.[i]?.care}</p>
                          )}
                        </div>
                      </div>
                      <div className="select__form__product">
                        <div className="com__dop__input">
                          <label>Ширина</label>
                          <input
                            type="text"
                            className="select__com"
                            placeholder="Размер в сантиметров"
                            value={formState.dimension.dx}
                            onChange={(e) =>
                              setAllData(
                                allData.map((prev) => {
                                  if (
                                    prev?.color?.hex === formState?.color?.hex
                                  ) {
                                    return {
                                      ...prev,
                                      dimension: {
                                        ...prev?.dimension,
                                        dx: +e.target.value,
                                      },
                                    };
                                  } else {
                                    return prev;
                                  }
                                }),
                              )
                            }
                          />
                          {errors?.[i]?.dimensionXd && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                        <div className="com__dop__input">
                          <label>Высота</label>
                          <input
                            type="text"
                            className="select__com"
                            placeholder="Размер в сантиметров"
                            value={formState.dimension.dy}
                            onChange={(e) =>
                              setAllData(
                                allData.map((prev) => {
                                  if (
                                    prev?.color?.hex === formState?.color?.hex
                                  ) {
                                    return {
                                      ...prev,
                                      dimension: {
                                        ...prev?.dimension,
                                        dy: +e.target.value,
                                      },
                                    };
                                  } else {
                                    return prev;
                                  }
                                }),
                              )
                            }
                          />
                          {errors?.[i]?.dimensionYd && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="select__form__product">
                        <div className="com__dop__input">
                          <label>Длина</label>
                          <input
                            type="text"
                            className="select__com"
                            placeholder="Размер в сантиметров"
                            value={formState.dimension.dz}
                            onChange={(e) =>
                              setAllData(
                                allData.map((prev) => {
                                  if (
                                    prev?.color?.hex === formState?.color?.hex
                                  ) {
                                    return {
                                      ...prev,
                                      dimension: {
                                        ...prev?.dimension,
                                        dz: +e.target.value,
                                      },
                                    };
                                  } else {
                                    return prev;
                                  }
                                }),
                              )
                            }
                          />
                          {errors?.[i]?.dimensionZd && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                        <div className="com__dop__input">
                          <label>Вес</label>
                          <input
                            type="text"
                            className="select__com"
                            placeholder="Вес в граммах"
                            value={formState.dimension.weight}
                            onChange={(e) =>
                              setAllData(
                                allData.map((prev) => {
                                  if (
                                    prev?.color?.hex === formState?.color?.hex
                                  ) {
                                    return {
                                      ...prev,
                                      dimension: {
                                        ...prev?.dimension,
                                        weight: +e.target.value,
                                      },
                                    };
                                  } else {
                                    return prev;
                                  }
                                }),
                              )
                            }
                          />
                          {errors?.[i]?.dimensionWeight && (
                            <p className="error">
                              Поле обязательно для заполнения.
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="com__img__product" style={{ padding: 0 }}>
                        <h1>Фотографии</h1>
                        <p>
                          Загрузите 4,6 или 8 фотографий. Размер фото не может
                          быть более 5мб.
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
                          onChange={(e) =>
                            handleFileChange(e, formState?.color?.hex)
                          }
                        />
                        {errors?.[i]?.images && (
                          <h6 className="error" style={{ color: "red" }}>
                            {errors?.[i]?.images}.
                          </h6>
                        )}
                        <div className="arr__img__rodect">
                          {formState?.images?.map((el, i) => (
                            <div key={i}>
                              <img
                                src={
                                  el.sourceLoc
                                    ? el.sourceLoc
                                    : import.meta.env.VITE_ENV_URL_FILE +
                                      `photos?photo=${el?.source}`
                                }
                                alt="imgProduct"
                              />
                              <span>
                                <button
                                  style={{ width: 45 }}
                                  onClick={() =>
                                    removeImage(
                                      el?.source,
                                      formState?.color?.hex,
                                      el?.id,
                                    )
                                  }
                                >
                                  <img src={Trash} alt="Trash" />
                                </button>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
      {modalAddColor && (
        <div className="modalAddColor">
          <main>
            <h1>Название цвета</h1>
            <input
              type="text"
              style={{ width: "195px" }}
              value={nameColor}
              onChange={(e) => {
                setNameColor(e.target.value);
              }}
            />
            <div>
              <button
                onClick={() => {
                  if (nameColor.length === 7) {
                    setAllData([
                      ...allData,
                      {
                        ...defItem,
                        color: {
                          hex: nameColor,
                        },
                      },
                    ]);
                    setAllDataVibor(nameColor);
                    setNameColor("");
                    setModalAddColor(false);
                  }
                }}
              >
                add new
              </button>
              {/* <button>add copy</button> */}
            </div>
            <button onClick={() => setModalAddColor(false)}>X</button>
          </main>
        </div>
      )}
    </>
  );
}
