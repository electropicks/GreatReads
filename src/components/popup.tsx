import { useBook } from '@/app/api/google_books/books';
import BookImage from '@/components/common/BookImage';
import {
  ReadStatusEnum,
  useAddBookToBookshelf,
  useUpdateNote,
  useUpdateReadStatus,
  useUserBookDetails,
  useUserBookshelves,
} from '@/app/api/supabase';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface BookPopupProps {
  selectedBookId: string;
  handleExitPopupAction: () => void;
}

const BookPopup = ({
  selectedBookId,
  handleExitPopupAction,
}: BookPopupProps) => {
  const { data: book, isLoading } = useBook(selectedBookId);
  const { data: bookshelves, isLoading: isBookshelvesLoading } =
    useUserBookshelves();
  const { mutate: addBookToBookshelf } = useAddBookToBookshelf();
  const { data: userBook, isPending: isUserBookPending } =
    useUserBookDetails(selectedBookId);
  const { mutate: updateReadStatus, isPending: isUpdateReadStatusPending } =
    useUpdateReadStatus();
  const { mutate: updateNote, isPending: isUpdateNotePending } =
    useUpdateNote();
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [note, setNote] = useState(userBook?.note || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [bookStatusInverse, setBookStatusInverse] = useState(
    userBook?.read_status === ReadStatusEnum.READ ? 'Unread' : 'Read',
  );

  const onReadStatusAction = useCallback(() => {
    if (isUpdateReadStatusPending || isUserBookPending) {
      return;
    }
    const newReadStatus =
      userBook?.read_status === ReadStatusEnum.READ
        ? ReadStatusEnum.UNREAD
        : ReadStatusEnum.READ;
    updateReadStatus(
      { googleBookId: selectedBookId, readStatus: newReadStatus },
      {
        onSuccess: () => {
          console.log('Read status updated!');
        },
      },
    );
    setBookStatusInverse(
      newReadStatus === ReadStatusEnum.READ ? 'Unread' : 'Read',
    );
  }, [
    isUpdateReadStatusPending,
    isUserBookPending,
    selectedBookId,
    updateReadStatus,
    userBook?.read_status,
  ]);

  const handleAddBook = useCallback(
    (bookshelfId: number) => {
      addBookToBookshelf(
        { bookshelfId, googleBookId: selectedBookId },
        {
          onSuccess: () => {
            console.log('Book added to bookshelf!');
            setDropdownOpen(false); // Close dropdown on success
            setToastVisible(true); // Show toast notification
            setTimeout(() => setToastVisible(false), 3000); // Hide after 3 seconds
          },
        },
      );
    },
    [addBookToBookshelf, selectedBookId],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500/75">
        Loading...
      </div>
    );
  }

  if (!book) {
    console.error(`Book with id: ${selectedBookId} not found`);
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-500/75">
        <div className="bg-background p-4 rounded shadow-lg">
          Book not found
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/75"
      role="dialog"
      aria-modal="true"
    >
      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
          Book successfully added to shelf!
        </div>
      )}

      <div className="relative bg-background rounded-lg shadow-lg w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={handleExitPopupAction}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 focus:outline-none"
          aria-label="Close popup"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 flex justify-center">
            <div className="relative w-48 h-72 border border-accent rounded-lg shadow-sm">
              {<BookImage book={book} />}
            </div>
          </div>
          <div className="md:col-span-8">
            <h2 className="text-2xl font-bold text-foreground">
              {book.volumeInfo.title || 'No title available'}
            </h2>
            <p className="mt-2 text-lg text-foreground">
              {book.volumeInfo.authors?.join(', ') || 'No author available'}
            </p>
            <section className="mt-4">
              <h3 className="font-semibold text-foreground">Description</h3>
              <div
                className="text-foreground max-h-72 overflow-y-auto"
                dangerouslySetInnerHTML={{
                  __html:
                    book.volumeInfo.description || 'No description available.',
                }}
              />
            </section>

            <div className="mt-6 flex items-center space-x-4">
              <button
                type="button"
                className="px-4 py-2 bg-foreground text-background rounded hover:bg-darkForeground focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onClick={onReadStatusAction}
              >
                {isUpdateReadStatusPending || isUserBookPending
                  ? 'Marking...'
                  : `Mark as ${bookStatusInverse}`}
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  type="button"
                  className="px-4 py-2 bg-primary text-foreground rounded hover:bg-darkPrimary focus:ring-2 focus:ring-gray-300 focus:outline-none"
                >
                  Add to Shelf
                </button>
                {dropdownOpen && (
                  <div className="absolute mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
                    {isBookshelvesLoading ? (
                      <div className="p-4">Loading...</div>
                    ) : bookshelves ? (
                      bookshelves.map((shelf) => (
                        <button
                          key={shelf.bookshelf_id}
                          onClick={() => handleAddBook(shelf.bookshelf_id)}
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                        >
                          {shelf.bookshelf_name}
                        </button>
                      ))
                    ) : (
                      <div className="p-4">No bookshelves available</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <section className="mt-6">
              <h3 className="font-semibold text-foreground">My Notes</h3>
              {isEditingNote ? (
                <div>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="mt-2 w-full border border-gray-300 rounded p-2"
                  />
                  <div className="flex space-x-4 mt-2">
                    <button
                      onClick={() => {
                        updateNote({ googleBookId: selectedBookId, note });
                        setIsEditingNote(false);
                      }}
                      disabled={isUpdateNotePending}
                      className="px-4 py-2 bg-primary text-foreground rounded hover:bg-darkPrimary focus:ring-2 focus:ring-gray-300 focus:outline-none"
                    >
                      {isUpdateNotePending ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setIsEditingNote(false)}
                      className="px-4 py-2 bg-secondary text-foreground rounded hover:bg-darkSecondary focus:ring-2 focus:ring-gray-300 focus:outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-foreground">
                  {userBook?.note || 'No notes available.'}
                </p>
              )}
              {!isEditingNote && (
                <button
                  onClick={() => setIsEditingNote(true)}
                  className="mt-2 px-4 py-2 bg-primary text-foreground rounded hover:bg-darkPrimary focus:ring-2 focus:ring-gray-300 focus:outline-none"
                >
                  Edit Notes
                </button>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BookPopup);
