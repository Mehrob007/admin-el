import { useRef, useState } from 'react';

const ImageUploader = ({ handleFileChange }) => {
  const fileInputRef = useRef(null); // Ссылка на <input type="file">
  const [imageSrc, setImageSrc] = useState(null); // Хранит URL выбранного изображения
  const [error, setError] = useState(''); // Для сообщений об ошибках

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Открытие окна выбора файла
    }
  };



  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={(event) => handleFileChange(event.target.files[0], setImageSrc, setError)}
      />
      {imageSrc && (
        <div style={{ marginTop: '20px' }}>
          <img src={imageSrc} alt="Выбранное изображение" style={{ maxWidth: '300px', border: '1px solid #ddd' }} />
        </div>
      )}
      {!imageSrc ?
        <button onClick={handleButtonClick}>Загрузить</button> :
        <button onClick={() => setImageSrc('')}>Удалить</button>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ImageUploader;
