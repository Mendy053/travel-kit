import { useState, type ChangeEvent, type FormEvent } from 'react';
import './App.css'

function App() {
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const [hotels, setHotels] = useState<string[]>(['']);
  const [freeText, setFreeText] = useState<string>('');

  const handleFileChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = [...files];
    newFiles[index] = event.target.files ? event.target.files[0] : null;
    setFiles(newFiles);
  };

  const addFileInput = () => setFiles([...files, null]);

  const handleHotelChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const newHotels = [...hotels];
    newHotels[index] = event.target.value;
    setHotels(newHotels);
  };

  const addHotelInput = () => setHotels([...hotels, '']);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({ files, hotels, freeText });
  };

  return (
    <>
      <div>
        <h1>יצירת קיט טיולים חדש</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <h3>הוספת קבצים</h3>
        {files.map((_, idx) => (
          <div key={idx}>
            <input type="file" accept="application/pdf" onChange={e => handleFileChange(idx, e)} />
            {idx === files.length - 1 && (
              <button type="button" onClick={addFileInput}>+</button>
            )}
          </div>
        ))}

        <h3>הוספת מלונות</h3>
        {hotels.map((hotel, idx) => (
          <div key={idx}>
            <input
              type="text"
              placeholder="שם מלון"
              value={hotel}
              onChange={e => handleHotelChange(idx, e)}
            />
            {idx === hotels.length - 1 && (
              <button type="button" onClick={addHotelInput}>+</button>
            )}
          </div>
        ))}

        <h3>טקסט חופשי</h3>
        <textarea
          value={freeText}
          onChange={e => setFreeText(e.target.value)}
          placeholder="הכנס טקסט חופשי כאן"
        />

        <br />
        <button type="submit">שלח</button>
      </form>
    </>
  );
}

export default App;
