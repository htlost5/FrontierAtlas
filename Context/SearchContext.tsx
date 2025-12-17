import React, { createContext, useContext, useState } from "react";

type SearchContextType = {
    searchText: string;
    setSearchText: (text: string) => void;
    answerText: string;
    setAnswerText: (text: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
    const [searchText, setSearchText] = useState("");
    const [answerText, setAnswerText] = useState("");
    return (
        <SearchContext.Provider value={{ searchText, setSearchText, answerText, setAnswerText }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) throw new Error("useSearch must be used within a SearchProvider");
    return context;
};