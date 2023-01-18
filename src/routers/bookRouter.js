import express from "express";
import { ERROR, SUCCESS } from "../constant.js";

import {
  addBook,
  findBookAndUpdate,
  findBookAndDelete,
  getAllBooks,
  getBookById,
  getBookByIsbn,
  getBorrowedBooks,
} from "../models/Book/BookModel.js";

import { postTransaction } from "../models/Transaction/TransactionModel.js";

import { getUserById } from "../models/userModel/userModel.js";

const router = express.router();

//get books
router.get("/", async (req, res, next) => {
  try {
    const books = await getAllBooks();

    if (books) {
      return res.json({ books });
    }
    return;
  } catch (error) {
    next(error);
  }
});

//get borrowed books by specific users
router.get("/borrowedBooks", async (res, res, next) => {
  try {
    const books = await getBorrowedBooks(req.headers.authorization);
    return res.json(books);
  } catch (error) {
    next(error);
  }
});

//add a book
router.post("/", async (req, res, next) => {
  const { isbn } = req.body;
  try {
    const bookExists = await getBookByIsbn(isbn);

    if (bookExists?._id) {
      return res.json({
        status: ERROR,
        message: "Book already exists!",
      });
    }
    const book = await addBook(req.body);

    return book?._id
      ? res.json({
          status: SUCCESS,
          message: "Book added successfully!",
        })
      : res.json({
          status: ERROR,
          message: "Unable to add book. Please try again later!",
        });
  } catch (error) {
    next(error);
  }
});

//Borrow a book
router.post("/borrow", async (req, res, next) => {
  try {
    const bookId = req.body.bookId;
    const { authorization } = req.headers;

    const book = await getBookById(bookId);
    const user = await getUserById(authorization);

    if (book?._id && user?._id) {
      if (book?.borrowedBy.length) {
        return res.json({
          status: "error",
          message:
            "This book has already been borrowed and will be available once it has been returned!",
        });
      }

      const { isbn, thumbnail, title, author, year } = book;

      const transaction = await postTransaction({
        borrowedBy: {
          userId: user?._id,
          userName: user?.fName,
        },
        borrowedBook: {
          isbn,
          thumbnail,
          title,
          author,
          year,
        },
      });

      if (transaction?._id) {
        const updateBook = await findBookAndUpdate(bookId, {
          $push: { borrowedBy: user._id },
        });
        return updateBook?._id
          ? res.json({
              status: "success",
              mesasge: "You have borrowed this book!",
            })
          : res.json({
              status: "error",
              message: "Something went wrong. Please try again later!",
            });
      }

      return res.json({
        status: "error",
        message: "Unable to register transaction!",
      });
    }
  } catch (error) {
    next(error);
  }
});

//Retuen a book
router.patch("/return", async (req, res, next) => {
  try {
    const book = await getBookById(req.body.bookId);
    const user = await getUserById(req.headers.authorization);
    if (book?._id && user?._id) {
      const updateBook = await findBookAndUpdate(book._id, {
        $pull: { borrowedBy: user._id },
      });

      return updateBook?._id
        ? res.json({
            status: "success",
            message: "You have returned this book!",
          })
        : res.json({
            status: "error",
            message: "Unable to return book. Please try again later!",
          });
    }
  } catch (error) {
    next(error);
  }
});

//Delete a book

router.delete("/", async (req, res, mext) => {
  try {
    const del = await findBookAndDelete(req.body.bookId);

    del?._id
      ? res.json({
          status: "sucess",
          message: "Book deleted successfully!",
        })
      : res.json({
          status: "error",
          message: "Unable to delete book!",
        });
  } catch (error) {
    next(error);
  }
});

export default router;
