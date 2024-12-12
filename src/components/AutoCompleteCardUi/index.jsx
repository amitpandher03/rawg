import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';

const AutoCompleteCardUi = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [games, setGames] = useState([]);
  const [selectedItem, setSelectedItem] = useState(-1);
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      const response = await fetch('https://api.rawg.io/api/games?key=' + import.meta.env.VITE_RAWG_API_KEY);
      const data = await response.json();
      setGames(data.games);
    };
    fetchGames();
  }, []);

  const handleSearch = async (event) => {
    if (event.key === 'Enter' || event.type === 'submit') {
      event.preventDefault();
      const response = await fetch(`https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${encodeURI(searchQuery)}`)
      const data = await response.json()
      // eslint-disable-next-line no-unused-vars
      const results = data.results;
      
      Navigate(`/search?q=${searchQuery}`);
      
      setSearchQuery('');
      setSuggestions([]);
    } else {
      const searchQuery = event.target.value;
      setSearchQuery(searchQuery);
      if (searchQuery.length > 0) {
        try {
          const url = `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${encodeURI(searchQuery)}`;
          console.log('Chiamata API:', url);
          const response = await fetch(url);
          const data = await response.json();
          setSuggestions(data.results);
        } catch (error) {
          console.error('Errore durante la ricerca:', error);
        }
      } else if (searchQuery.length === 0) {
        setSuggestions([]);
        setSelectedItem(-1);
      }
    }
  };

  const handleSuggestionClick = (game) => {
    setSearchQuery(game.name);
    setSuggestions([]);

    // Aprire una nuova pagina con i dettagli del gioco selezionato
    Navigate(`/game/${game.id}`);
    setSearchQuery('');
  };


  const scrollIntoView = (index) => {
    const li = document.querySelector(`#suggestion-${index}`);
    if (li) {
      li.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp' && selectedItem > 0) {
      setSelectedItem(prev => prev - 1);
      scrollIntoView(selectedItem);
  }
  else if (e.key === 'ArrowDown' && selectedItem < suggestions.length - 1) {
      setSelectedItem(prev => prev + 1);
      scrollIntoView(selectedItem);
  }
  else if (e.key === 'Enter' && selectedItem >= 0) {
      handleSuggestionClick(suggestions[selectedItem]);
  }
  };


  return (
    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
      <div className="relative w-full">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          placeholder="Search games..."
          className="w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm"
          
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
        >
          <FaSearch />
        </button>
      </div>
      {suggestions.length > 1 && (
        <div className="absolute top-14 left-0 w-full bg-gray-800/50 rounded-lg shadow-lg p-4" style={{ overflowY: "scroll", maxHeight: "300px" }}>
          <ul className="list-none p-0 m-0">
            {suggestions.map((game) => (
              <li key={game.id} 
              className="flex items-center p-4 hover:bg-purple-500/[.5] cursor-pointer" 
              onFocus={() => handleSuggestionClick(game)} 
              onClick={() => handleSuggestionClick(game)}
              onKeyDown={handleKeyDown}
              
               style={selectedItem === suggestions.indexOf(game) ? { backgroundColor: 'rgba(128, 0, 128, 0.5)' } : {}}
              >
                <img src={game.background_image} alt={game.name} className="w-12 h-12 mr-4" />
                <h3 className="text-xl font-bold">{game.name}</h3>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default AutoCompleteCardUi;