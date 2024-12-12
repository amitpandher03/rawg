// import React, { useState, useEffect } from 'react';
// import { ReactSearchAutocomplete } from 'react-search-autocomplete';
// const AutoCompleteCardUi = () => {
//   const [inputValue, setInputValue] = useState('');
//   const [suggestions, setSuggestions] = useState([]);

//   const handleInputChange = async (event) => {
//     console.log(handleInputChange);

//     console.log('Input value:', event.target.value);
//     const inputValue = event.target.value;
//     setInputValue(inputValue);

//     if (inputValue.length > 2) { // effettua la richiesta API solo se l'input ha almeno 3 caratteri
//       try {
//         const url = `https://api.rawg.io/api/games?key=${import.meta.env.VITE_RAWG_API_KEY}&search=${encodeURI(inputValue)}`;
//         console.log('Chiamata API:', url);
//         const response = await fetch(url);
//         console.log('Risposta API:', response);

//         if (response.ok) {
//           const data = await response.json();
//           console.log('Dati API:', data);
//           const suggestions = data.results.map(game => ({ label: game.name, id: game.id }));
//           console.log('Suggerimenti:', suggestions);
//           setSuggestions(suggestions);
//           console.log('Suggerimenti:', suggestions);

//         } else {
//           console.error('Errore durante la richiesta API:', response.status);
//         }
//       } catch (error) {
//         console.error('Errore durante la richiesta API:', error);
//       }
//     } else {
//       setSuggestions([]); // resetta i suggerimenti se l'input è vuoto o ha meno di 3 caratteri
//     }
//   };

//   useEffect(() => {
//     console.log('Suggerimenti:', suggestions);
//   }, [suggestions]);


//   const handleSelect = (item) => {

//     console.log('Gioco selezionato:', item);

//     // Aprire una nuova pagina con i dettagli del gioco selezionato
//     window.open(`https://www.example.com/games/${item.id}`, '_blank');

//     // Aggiungere il gioco selezionato a una lista di giochi preferiti
//     const favoriteGames = JSON.parse(localStorage.getItem('favoriteGames')) || [];
//     favoriteGames.push(item);
//     localStorage.setItem('favoriteGames', JSON.stringify(favoriteGames));

//     // Eseguire una ricerca più approfondita sul gioco selezionato
//     fetch(`https://api.rawg.io/api/games/${item.id}`)
//       .then(response => response.json())
//       .then(data => console.log(data));
//   };

//   return (
//     <ReactSearchAutocomplete
//       getItemValue={(item) => item.label}
//       items={suggestions}
//       shouldItemRender={(item, value) => item.label.toLowerCase().includes(value.toLowerCase())}
//       onSelect={handleSelect}
//       onChange={handleInputChange}
//       value={inputValue}
//       inputProps={{
//         placeholder: 'Cerca giochi...',
//         className: 'w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm',
//       }}
//       wrapperProps={{
//         className: 'relative w-full',
//       }}
//       menuProps={{
//         className: 'absolute bg-gray-800/50 rounded-lg shadow-lg p-4 w-full',
//       }}
//       renderMenu={(items, value, style) => (
//         <div style={style} className="absolute bg-gray-800/50 rounded-lg shadow-lg p-4 w-full">
//           {items.map((item, index) => (
//             <div key={index} className="py-2">
//               {item.label}
//             </div>
//           ))}
//         </div>
//       )}
//     />
//   );
// };

// export default AutoCompleteCardUi;

import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';



const AutoCompleteCardUi = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
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
      const game = suggestions.find((game) => game.name.toLowerCase() === searchQuery.toLowerCase());
      if (game) {
        handleSuggestionClick(game);
      }
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
    // <div>
    //   <input
    //     type="text"
    //     value={searchQuery}
    //     onChange={handleSearch}
    //     placeholder="Cerca giochi..."
    //     className="w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm"
    //   />
    //   {suggestions.length > 0 && (
    //     <ul className="absolute bg-gray-800/50 rounded-lg shadow-lg p-4 w-full">
    //       {suggestions.map((game) => (
    //         <li key={game.id} onClick={() => handleSuggestionClick(game)} className="py-2">
    //           {game.name}
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </div>

  //! DA UTILIZZARE NEL CASO

    // <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
    //   <div className="relative w-full">
    //     <input
    //       type="text"
    //       value={searchQuery}
    //       onChange={handleSearch}
    //       placeholder="Cerca giochi..."
    //       className="w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm"
    //     />
    //     <button
    //       type="submit"
    //       className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
    //     >
    //       <FaSearch />
    //     </button>
    //   </div>
    //   <div>
    //     {suggestions.length > 0 && (
    //       <div className="absolute bg-gray-800/50 rounded-lg shadow-lg p-4 w-full">
    //         {suggestions.length > 0 && (
    //           <div className="absolute bg-gray-800/50 rounded-lg shadow-lg p-4 w-full">
    //             {suggestions.map((game) => (
    //               <div key={game.id} className="flex items-center p-4 hover:bg-gray-700 cursor-pointer" onFocus={() => handleSuggestionClick(game)} onClick={() => handleSuggestionClick(game)}>
    //                 <img src={game.background_image} alt={game.name} className="w-12 h-12 mr-4" />
    //                 <h3 className="text-xl font-bold">{game.name}</h3>
    //               </div>
    //             ))}
    //           </div>
    //         )}
    //       </div>
    //   )}
    //   </div>
    // </form>

    //! FINE
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
              className="flex items-center p-4 hover:bg-purple-500/[.5] cursor-pointer" onFocus={() => handleSuggestionClick(game)} 
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

{/* <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
  <div className="relative w-full">
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search games..."
      className="w-full px-6 py-3 rounded-full bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700 backdrop-blur-sm" />
    <button
      type="submit"
      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors">
      <FaSearch />
    </button>
  </div>
</form>  */}


export default AutoCompleteCardUi;