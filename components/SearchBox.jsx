import React, { useState, useEffect } from 'react';
import cities from '../lib/city.list.json';
import Link from 'next/link';
import Router from 'next/router';

export default function SearchBox({placeholder}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    const clearQuery = () => setQuery("")

    // listen to route changes and clear input query when component mounts
    Router.events.on("routeChangeComplete", clearQuery)

    return () => {
      // listen to route changes and clear input query when component unmounts
      Router.events.off("routeChangeComplete", clearQuery)
    }

  }, [])

  const onChange = (e) => {
    const { value } = e.target;

    setQuery(value);

    // set an empty array to get matching search results
    let matchingCities = [];

    // verify that input value is more than 3 letters before searching
    if (value.length > 3) {
      for (let city of cities) {
        // return only 5 or less matching cities else break
        if (matchingCities.length >= 5) {
          break;
        }

        // convert search value to lowercase and search for a match in cities array
        const match = city.name.toLowerCase().startsWith(value.toLowerCase());

        if (match) {
          // create new object cityData with slug for each matching city
          const cityData = {
            ...city,
            slug: `${city.name.toLowerCase().replace(/ /g, '-')}-${city.id}`,
          };

          // if a match is found, add to matchingCities array
          matchingCities.push(cityData);
        }
      }
    }
    return setResults(matchingCities);
  };

  return (
    <div className="search">
      <input type="text" placeholder={placeholder ? placeholder : ''} value={query} onChange={onChange} />

      {query.length > 3 && (
        <ul>
          {results.length > 0 ? (
            results.map((city) => (
              <li key={city.slug}>
                <Link href={`/location/${city.slug}`}>
                  <a>
                    {city.name}
                    {city.state ? `${city.state}` : ''}{" "}
                    <span>({city.country})</span>
                  </a>
                </Link>
              </li>
            ))
          ) : (
            <li className="search__no-results">No result found</li>
          )}
        </ul>
      )}
    </div>
  );
}
