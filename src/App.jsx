import { Form } from "react-bootstrap";
import "./index.css";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

const API_URL = "https://api.unsplash.com/search/photos";
const IMAGE_PER_PAGE = 20;

function App() {
  const searchInput = useRef(null);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [errroMsg, setErrorMsg] = useState('');

  const fetchImages = useCallback(async () => {
    try {
      if (searchInput.current.value) {
        setErrorMsg(''); 
        const { data } = await axios.get(
          `${API_URL}?query=${
            searchInput.current.value
          }&page=${page}&per_page=${IMAGE_PER_PAGE}&client_id=${
            import.meta.env.VITE_API_KEY
          }`
        );
        setImages(data.results);
        setTotalPages(data.total_pages);
      }
    } catch (error) {
       setErrorMsg("error fetching images. Try again");
      console.log(error);
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Check your Unsplash API key.");
      }
    }
  }, [page]);

  useEffect(() => {
    if (searchInput.current.value) {
      fetchImages();
    }
  }, [fetchImages]);

  const handleSearched = () => {
    setPage(1); // Reset to the first page on a new search
    fetchImages();
  };

  const handleSearch = (event) => {
    event.preventDefault();
    handleSearched();
  };

  const handleSelection = (selection) => {
    searchInput.current.value = selection;
    handleSearched();
  };

  return (
    <div className="container">
      <h1 className="title">Image Search</h1>
      {errroMsg && <p className="error-msg">{errroMsg}</p>}
      <div className="search-section">
        <form onSubmit={handleSearch}>
          <Form.Control
            type="search"
            placeholder="Type something to search..."
            className="search-input"
            ref={searchInput}
          />
        </form>
      </div>
      <div className="filters">
        <div className="buttons" onClick={() => handleSelection("nature")}>
          Nature
        </div>
        <div className="buttons" onClick={() => handleSelection("birds")}>
          Birds
        </div>
        <div className="buttons" onClick={() => handleSelection("animals")}>
          Animals
        </div>
        <div className="buttons" onClick={() => handleSelection("shoes")}>
          Shoes
        </div>
      </div>
      <div className="images">
        {images.map((image) => (
          <div className="image-container" key={image.id}>
            <img
              src={image.urls.small}
              alt={image.alt_description}
              className="image"
            />
          </div>
        ))}
      </div>
      <div className="pagination-buttons">
        {page > 1 && (
          <button onClick={() => setPage(page - 1)}>Previous</button>
        )}
        {page < totalPages && (
          <button onClick={() => setPage(page + 1)} className="next">
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
