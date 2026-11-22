export const getFirstThreeCaps = (input: any) => {
    if (input == "Over") return "Over";
    if (input == "Under") return "Under";
    if (!input || typeof input !== 'string') return '';
    return input.slice(0, 3).toUpperCase();
}