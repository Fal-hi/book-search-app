"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [keyword, setKeyword] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getResult() {
    try {
      // Replace space with +
      let title = keyword.replace(/ /g, "+");
      setLoading(true);
      const { data } = await axios.get("api/search", {
        params: { title },
      });
      // Add the data to the results state
      setSearchResults(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }

  return (
    <>
      <header className="flex flex-col md:px-12 px-4 bg-background font-poppins items-center">
        <h1 className="md:text-6xl text-4xl font-bold text-primary mt-10">
          Book Search App
        </h1>
        <h4 className="text-primary text-2xl font-light mt-6 font-ebas">
        Find the book you want here
        </h4>
        <form
          className="sm:mx-auto sm:w-full sm:flex mt-10 justify-center"
          onSubmit={(e: any) => {
            getResult();
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <input
            type="text"
            className="flex w-full sm:w-1/3 rounded-lg px-3 border-2 border-black text-base text-background font-semibold outline-none"
            placeholder="Enter the book's title"
            defaultValue={keyword}
            onChange={(e: any) => {
              setKeyword(e.target.value);
              setSearchResults([]);
            }}
          />
          <div className="mt-4 sm:mt-0 sm:ml-3">
            <button
              className="block w-full rounded-lg px-5 py-3 bg-black text-white font-semibold hover:scale-90 transition-opacity"
              type="submit"
              defaultValue={keyword}
              onChange={(e: any) => {
                setKeyword(e.target.value);
                setSearchResults([]);
              }}
            >
              {
                // If loading is true, show a loading text
                loading ? (
                  <span className="animate-pulse">Loading..</span>
                ) : (
                  <span>Search</span>
                )
              }
            </button>
          </div>
        </form>
      </header>
      <main>
        {searchResults && (
          <div className="my-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map((book: any) => (
                <div key={book.book_id} className="pt-6">
                  <div className="px-4 pb-8">
                    <div className="-mt-6">
                      <div className="flex items-center justify-center">
                        <Image
                          width={256}
                          height={700}
                          src={book.cover.replace(/._SX50_|._SY75_/gi, "")}
                          className="p-2 w-[270px] h-auto rounded-lg"
                          alt={book.name}
                        />
                      </div>
                      <div className="text-center justify-center items-center">
                        <Link href={book.url} target="_blank">
                          <h3 className="mt-2 text-base font-semibold w-full break-words overflow-x-auto text-primary">
                            {book.name}
                          </h3>
                        </Link>
                        <h5 className="mt-2 text-sm leading-relaxed text-secondary">
                          {book.authors[0]} ({book.year})
                        </h5>
                        <h6 className="font-medium text-sm text-secondary">
                          Rating: {book.rating}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
      <footer>
        <h3 className="text-center absolute bottom-0 left-0 right-0">Copyright by <Link href="https://github.com/Fal-hi" target="_blank">Syaifal Illahi</Link></h3>
      </footer>
    </>
  );
}
