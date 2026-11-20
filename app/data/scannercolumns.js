import { sportsbook_data } from "./bookdata";

export const scanner_column_options = [
    {
        column_name: "Event",
        column_code: "event",
        column_logo: null,
    },
    {
        column_name: "Best Odds",
        column_code: "best_odds",
        column_logo: null,
    },
    ...sportsbook_data.map(book => ({
        column_name: book.book_name,
        column_code: book.book_code,
        column_logo: book.book_logo,
        column_logo_long: book.book_long_logo,
        column_height: book.height,
        column_width: book.width,
    }))
];