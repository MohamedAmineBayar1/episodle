"use client";

import { useState, useEffect, useRef } from 'react';

interface Show {
    id: number;
    name: string;
    first_air_date: string;
}

interface SearchBarProps {
    onGuess: (show: Show) => void;
    disabled: boolean;
    guessedShowIds: number[];
}

export default function SearchBar({ onGuess, disabled, guessedShowIds }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Show[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                const filtered = (data.results || []).filter((s: Show) => !guessedShowIds.includes(s.id));
                setResults(filtered);
                setIsOpen(true);
            } catch (e) {
                console.error("Search failed", e);
            }
        };

        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (show: Show) => {
        onGuess(show);
        setQuery('');
        setIsOpen(false);
    };

    return (
        <div ref={wrapperRef} className="relative w-full max-w-md mx-auto z-10">
            <input
                type="text"
                disabled={disabled}
                className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                placeholder="Guess a TV show..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
            />

            {isOpen && results.length > 0 && (
                <ul className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                    {results.map((show) => (
                        <li
                            key={show.id}
                            onClick={() => handleSelect(show)}
                            className="p-3 hover:bg-gray-700 cursor-pointer text-white flex justify-between items-center border-b border-gray-700 last:border-0"
                        >
                            <span>{show.name}</span>
                            <span className="text-gray-400 text-sm">
                                {show.first_air_date ? show.first_air_date.substring(0, 4) : 'Unknown'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
