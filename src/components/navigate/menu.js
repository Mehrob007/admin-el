import Gelary from '../../assets/icon/Gelary.svg'
import Camera from '../../assets/icon/Camera.svg'
import Shop from '../../assets/icon/Shop.svg'
import Star from '../../assets/icon/Star.svg'

const menu = [
    {
        "id": 1,
        "name": "Главный баннер",
        "icon": Gelary,
        "url": "/"
    },
    {
        "id": 2,
        "name": "Акции и промокоды",
        "icon": Star,
        "url": "/promo-codes"
    },
    {
        "id": 3,
        "name": "Магазин",
        "icon": Shop,
        "url": "/shop-page",
        "links": [
            {
                "id": 1,
                "name": "Товары",
                "url": "/products"
            },
            {
                "id": 2,
                "name": "Коллекции",
                "url": "/collections"
            },
            {
                "id": 3,
                "name": "Тип одежды",
                "url": "/clothing-types"
            },
        ]
    },
    {
        "id": 4,
        "name": "Фотогалерея",
        "icon": Camera,
        "url": "/photo-gallery"
    }
]
export default menu