import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import NotFound from "@/public/not-found.png";
import Cat from "@/components/icons/Cat";

const BookSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [priceFilter, setPriceFilter] = useState<string>("All");
  const [maxResults, setMaxResults] = useState<number>(40);
  const [books, setBooks] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const categories = [
    "Art",
    "Biography",
    "Business & Economics",
    "Comics & Graphic Novels",
    "Computers",
    "Cooking",
    "Education",
    "Fiction",
    "Health & Fitness",
    "History",
    "Humor",
    "Literary Collections",
    "Mathematics",
    "Music",
    "Poetry",
    "Religion",
    "Science",
    "Self-Help",
    "Sports & Recreation",
    "Travel",
  ];

  function formatRupiah(value: any) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    })
      .format(value)
      .replace(/(\.|,)00$/, "");
  }

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");
      let url = `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=${maxResults}`;
      const response = await axios.get(url);
      const allBooks = response.data.items;
      let filteredBooks = allBooks;
      if (category !== "") {
        filteredBooks = allBooks.filter((book: any) =>
          book.volumeInfo.categories?.some((cat: string) =>
            cat.toLowerCase().includes(category.toLowerCase())
          )
        );
      }
      if (priceFilter === "free") {
        filteredBooks = filteredBooks.filter(
          (book: any) =>
            isNaN(book.saleInfo.retailPrice?.amount) ||
            book.saleInfo.retailPrice?.amount === 0
        );
      } else if (priceFilter === "paid") {
        filteredBooks = filteredBooks.filter(
          (book: any) =>
            !isNaN(book.saleInfo.retailPrice?.amount) &&
            book.saleInfo.retailPrice?.amount > 0
        );
      }
      const limitedBooks = filteredBooks.slice(
        0,
        Math.min(maxResults, filteredBooks.length)
      );
      setBooks(limitedBooks);
      setLoading(false);
      if (limitedBooks.length === 0 && category !== "") {
        setError("Category not found");
      } else if (limitedBooks.length === 0) {
        setError("No books found");
      }
    } catch (error: any) {
      setLoading(false);
      if (error.response) {
        setError("Error: " + JSON.stringify(error.response.data.error.message));
        console.log(error.response.data.error.message);
      } else if (error.request) {
        setError("Request not found");
        console.log("Request not found");
      } else {
        setError("An error occurred: " + error.message);
        console.log("An error occurred: " + error.message);
      }
      setBooks([]);
    }
  };

  // console.log("books", books);

  return (
    <div className="font-sans">
      <header className="mt-8">
        <section className="text-center">
          <h1 className="text-4xl font-semibold">Book Search App</h1>
          <h3 className="text-xl font-light">Find the book you want here</h3>
        </section>
        <form
          className="mt-8 flex flex-col-reverse lg:flex-row gap-4 justify-center items-center mx-auto px-4"
          onSubmit={(e: any) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div>
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="px-2 py-1 font-semibold border-2 border-black rounded outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((category: any) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-x-2 items-center">
            <select
              value={priceFilter}
              onChange={(e: any) => setPriceFilter(e.target.value)}
              className="px-2 py-1 font-semibold border-2 border-black rounded outline-none"
            >
              <option value="all">All Prices</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>

            <select
              value={maxResults}
              onChange={(e: any) => setMaxResults(+e.target.value)}
              className="px-2 py-1 font-semibold border-2 border-black rounded outline-none"
            >
              <option value="40">Find All</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
          <div className="flex gap-x-2 items-center">
            <input
              type="text"
              className="py-1 px-2 border-2 border-black outline-none w-[14.2rem] md:w-[20rem] font-semibold rounded-md"
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
            />
            <button
              onClick={handleSearch}
              className="py-2 px-2 bg-black text-white text-sm font-semibold rounded-md outline-none"
            >
              {loading ? (
                <span className="animate-pulse">Searching...</span>
              ) : (
                <span>Search</span>
              )}
            </button>
          </div>
        </form>
      </header>

      {error && (
        <div className="mt-10">
          <h2 className="font-semibold text-center">{error}</h2>
          <Cat className="mx-auto mt-2" />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 px-4 md:px-8">
        {books.map((book: any) => (
          <section
            key={book.id}
            className="bg-white p-4 shadow flex mb-4 gap-x-4 items-start"
          >
            <Image
              width={400}
              height={400}
              src={
                book.volumeInfo.imageLinks
                  ? book.volumeInfo.imageLinks?.thumbnail
                  : NotFound
              }
              alt={book.volumeInfo.title}
              className="mb-4 w-auto h-auto drop-shadow"
            />
            <article>
              <h5 className="text-xs md:text-base font-semibold leading-4 md:leading-5 uppercase">
                {book.volumeInfo.title}
              </h5>
              <p className="text-gray-600 text-[10px] md:text-xs">
                {book.volumeInfo.authors?.join(", ")}
              </p>
              <p className="text-xs md:text-sm mt-3 mb-2 font-semibold">
                <span className="bg-blue-400 px-1 pb-[2px]">Category</span> :{" "}
                {book.volumeInfo?.categories
                  ? book.volumeInfo.categories
                  : "Unknown"}
              </p>
              <p className="text-xs md:text-sm font-semibold mb-4">
                {isNaN(book.saleInfo.retailPrice?.amount) ? (
                  <>
                    <span className="bg-yellow-400 px-1">Status</span> : Not
                    Available
                  </>
                ) : book.saleInfo.retailPrice?.amount === 0 ? (
                  <>
                    <span className="bg-green-400 px-1">Price</span> : Free
                  </>
                ) : (
                  <>
                    <span className="bg-green-400 px-1">Price</span> :{" "}
                    {formatRupiah(book.saleInfo.retailPrice?.amount)}
                  </>
                )}
              </p>
              <Link
                href={book.volumeInfo.previewLink}
                target="_blank"
                className={`bg-black text-white text-sm font-semibold px-2 py-1 ${
                  isNaN(book.saleInfo.retailPrice?.amount)
                    ? "bg-rose-600 pointer-events-none cursor-not-allowed"
                    : ""
                }`}
              >
                {isNaN(book.saleInfo.retailPrice?.amount)
                  ? "Not Available"
                  : "Get The Book"}
              </Link>
            </article>
          </section>
        ))}
      </div>
    </div>
  );
};

export default BookSearch;
