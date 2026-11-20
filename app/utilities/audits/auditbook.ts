import { sportsbook_data } from "~/data/bookdata";

export const auditBetBook = (bet_book: any) => {
    const book = sportsbook_data.find(book => book.book_code === bet_book);
    return book ? book.book_name : bet_book;
};