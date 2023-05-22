"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [series, setSeries] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const options = {
      method: 'GET',
      url: 'https://book-finder1.p.rapidapi.com/api/search',
      params: {
        series: series,
        results_per_page: '25',
        page: '1'
      },
      headers: {
        'X-RapidAPI-Key': '4e21bb028emsh362628b46ba93f3p1d2416jsn8c027163ac88',
        'X-RapidAPI-Host': 'book-finder1.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log("response", response.data.results)
      if (response.data.results && Array.isArray(response.data.results)) {
        setResults(response.data.results.map((book: any) => book.title));
      } else {
        setResults([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <header className="flex flex-col md:px-12 px-4 bg-background font-poppins items-center">
        <h1 className="md:text-6xl text-4xl font-bold text-primary mt-10">
          <span className="text-active">Books</span> Search
        </h1>
        <h2 className="text-primary text-2xl font-light mt-6 font-ebas">
          Search for any book using the Books API
        </h2>
        <form
          className="sm:mx-auto sm:w-full sm:flex mt-10 justify-center"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="flex w-full sm:w-1/3 rounded-lg px-3 border-2 border-black text-base text-background font-semibold outline-none"
            placeholder="Enter the book's title"
            value={series}
            onChange={(e: any) => setSeries(e.target.value)}
          />
          <div className="mt-4 sm:mt-0 sm:ml-3">
            <button
              className="block w-full rounded-lg px-5 py-3 bg-black text-white font-semibold hover:scale-90 transition-opacity"
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </header>
      <main>
      {results.length > 0 && (
        <div>
          <h2>Search Results:</h2>
          <ul>
            {results.map((title: string, index: number) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        </div>
      )}
      </main>
    </>
  );
}
