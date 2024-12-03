'use client';

import {
  getUserBookshelves,
  addBookshelf,
  getBookIdsForBookshelf,
  addBookToBookshelf,
  deleteBookshelf,
  removeBookFromBookshelf,
  updateBookshelfName,
  updateReadStatus,
} from './api/supabase'; //

import { Book, useBooks } from '@/app/api/books';
import { useState } from 'react';
import { Search } from 'lucide-react';
import dayjs from 'dayjs';
import BookImage from '@/components/common/BookImage';
import BookPopup from '@/components/popup';
import ShelfButton from '@/components/ShelfButton';

export default function Home() {
  const [searchInput, setSearchInput] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | undefined>();
  const [hasSearched, setHasSearched] = useState(false); // Tracks if the user has searched
  const { data: books, isLoading: isBooksLoading } = useBooks(bookSearch);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // console.log(getUserBookshelves());
    console.log(updateReadStatus('jVZoAAAAQBAJ', 'reading'));
    // console.log(deleteBookshelf(24));
    // console.log(removeBookFromBookshelf(17, 'RlTCDwAAQBAJ'));
    // console.log(updateBookshelfName(22, 'A Bookshelf Name 1'));
    // console.log(addBookshelf('A Bookshelf Name 3'));
    // addBookToBookshelf(24, 'GGqTEAAAQBAJ');
    // addBookToBookshelf(17, 'jVZoAAAAQBAJ');
    // addBookToBookshelf(17, 'RlTCDwAAQBAJ');
    // console.log(getBookIdsForBookshelf(18));
    event.preventDefault();
    if (searchInput.trim() === '') {
      return;
    }
    setBookSearch(searchInput);
    setHasSearched(true); // Set the search flag to true after searching
  };

  const handleBookClick = (book: Book) => {
    console.log(book.id); //
    setSelectedBook(book);
  };

  const handleExitPopup = () => {
    setSelectedBook(undefined);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col bg-background text-foreground items-center">
      <h1 className="bg-primary p-4 rounded-xl">Bookshelf</h1>
      <ShelfButton />
      <div className="w-full max-w-sm min-w-[200px]">
        <form onSubmit={handleFormSubmit} className="flex p-4">
          <input
            className="bg-secondary w-full text-foreground rounded-2xl p-2 focus:outline-neutral-none placeholder:text-accent"
            placeholder="Search for books..."
            value={searchInput}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-primary text-foreground rounded-2xl"
          >
            <Search />
          </button>
        </form>
      </div>
      <div className="w-full mt-4 flex justify-center">
        {isBooksLoading ? (
          <p>Loading...</p>
        ) : books && books.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 xl:gap-x-8">
            {books.map((book) => (
              <div key={book.id}>
                <div className="aspect-w-3 aspect-h-4 overflow-hidden bg-gray-200">
                  {book.volumeInfo?.imageLinks?.thumbnail ? (
                    <img
                      src={book.volumeInfo.imageLinks.thumbnail}
                      alt={`${book.volumeInfo.title} Thumbnail`}
                      className="h-full w-full object-cover object-center"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-sm font-semibold text-gray-900">
                    {book.volumeInfo.title}
                  </p>
                  {book.volumeInfo.publishedDate && (
                    <p className="text-xs text-gray-600">
                      {dayjs(book.volumeInfo.publishedDate).format(
                        'MMMM D, YYYY',
                      )}
                    </p>
                  )}
                  <button
                    onClick={() => handleBookClick(book)}
                    className="mt-2 text-sm bg-primary text-foreground rounded-lg px-3 py-1 hover:bg-primary-dark"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          hasSearched && (
            <p className="text-gray-500 mt-4">
              No results found. Try another search.
            </p>
          )
        )}
      </div>
      {selectedBook && (
        <BookPopup
          selectedBookId={selectedBook.id}
          handleExitPopupAction={handleExitPopup}
        />
      )}
    </div>
  );
}
