import { sportsbook_data } from "~/data/bookdata";
import { auditBetBook } from "../audits";

export const getBookLogo = (name: any) => {
    const match = sportsbook_data.find(item => item.book_name === auditBetBook(name));
    return match ? match.book_logo : undefined;
}