import { sportsbook_data } from "../data/bookdata";
import { auditBetBook } from "./auditbook";

export const getBookLogo = (name) => {
    const match = sportsbook_data.find(item => item.book_name === auditBetBook(name));
    return match ? match.book_logo : null;
}