// import {DisplayQuestions} from "./displayQuestions.js";
import React, {useState} from "react";
// import axios from "axios";
// import { makeUrl, makeUrlSearch } from './utils/makeUrl.js';

function SearchBar({ onSearch }) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyUp = (event) => {
        if (event.key === 'Enter') {
            onSearch(inputValue);
            setInputValue('');
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <input
            type="text"
            id="searchBar"
            placeholder="Search..."
            value={inputValue}
            onChange={handleInputChange}
            onKeyUp={handleKeyUp}
        />
    );
}

// function searchQuestions(searchInput) {

//     const fetchData = async () => {
//         try {
//           const questionsResponse = await axios.get(makeUrlSearch('search', searchInput));
//           const filteredQuestions = questionsResponse.data;
//           return filteredQuestions;
//           } catch (error) {
//           console.error('Error fetching tags:', error);
//           // sortQuestions('newest', res.data); // Pass the data to sortQuestions
//         // } catch (error) {
//         //   console.error('Error fetching data:', error);
//         }
//       };
    
      
    //   return fetchData();
    // const searchTermLowerCase = searchInput.toLowerCase();

    // const tagMatches = searchTermLowerCase.match(/\[([^\]]+)\]/g);
    // const tagNames = tagMatches ? tagMatches.map(match => match.slice(1, -1).toLowerCase()) : [];

    // const filteredQuestions = questions.filter(que => {
    //     const titleWords = que.title.toLowerCase().split(' ');
    //     const textWords = que.text.toLowerCase().split(' ');

    //     // Search tags
    //     const questionTags = que.tags.map(tag => tag.name.toLowerCase());

    //     const tagMatch = tagNames.some(tagName => questionTags.includes(tagName));

    //     // Check if any word in the title or text matches the search term
    //     const allSearchWords = searchTermLowerCase.split(' ');
    //     const titleMatch = titleWords.some(titleWord => allSearchWords.includes(titleWord));
    //     const textMatch = textWords.some(textWord => allSearchWords.includes(textWord));

    //     return titleMatch || textMatch || tagMatch;
    // });

    // return filteredQuestions;
// }

export { SearchBar } ;