import { useState } from "react";
import Input from "../comElement/Input";


export default function Home() {
    const [newCollection, setNewCollection] = useState("")

    const onSendNewCollection = () => {
        console.log(newCollection);
        
    }

    return (
        <div className="box__home">
            <div className="com__box">
                <div className="top__com">
                    <h1>Название новой коллекции</h1>
                    <p>Название коллекции которое будет отображаться на главном баннере</p>
                </div>
                <div className="bottom__com">
                    <Input
                        onChange={(e) => setNewCollection(e.target.value)}
                    />
                    <button onClick={onSendNewCollection}>
                        Сохранить
                    </button>
                </div>
            </div>
        </div>
    )
}
