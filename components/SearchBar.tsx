"use client";

import { useState, useEffect, useRef, useLayoutEffect } from 'react';

interface Show {
    id: number;
    name: string;
    first_air_date: string;
}

interface SearchBarProps {
    onGuess: (show: Show) => void;
    onSkip: () => void;
    disabled: boolean;
    guessedShowIds: number[];
    correctShowId?: number;
    correctShowName?: string;
}

export default function SearchBar({ onGuess, onSkip, disabled, guessedShowIds, correctShowId, correctShowName }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Show[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedShow, setSelectedShow] = useState<Show | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = () => {
        if (selectedShow) {
            onGuess(selectedShow);
            setSelectedShow(null);
            setQuery('');
        } else {
            onSkip();
            setQuery('');
        }
    };

    useEffect(() => {
        const fetchResults = async () => {
            if (query.trim().length < 2 || selectedShow) {
                setResults([]);
                return;
            }
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                
                // Filter out already guessed shows and duplicates of the correct show
                const filtered = (data.results || []).filter((s: Show) => {
                    const isGuessed = guessedShowIds.includes(s.id);
                    if (isGuessed) return false;

                    // If it's a namesale of today's show but not the correct ID, hide it
                    if (correctShowId && correctShowName && s.name.toLowerCase() === correctShowName.toLowerCase()) {
                        return s.id === correctShowId;
                    }

                    return true;
                });

                setResults(filtered);
                setIsOpen(true);
            } catch (e) {
                console.error("Search failed", e);
            }
        };


        const debounce = setTimeout(fetchResults, 300);
        return () => clearTimeout(debounce);
    }, [query, selectedShow]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    // Auto-focus on mount
    useLayoutEffect(() => {
        if (!disabled && inputRef.current) {
            inputRef.current.focus();
        }
    }, [disabled]);

    const handleSelect = (show: Show) => {
        setSelectedShow(show);
        setQuery(show.name);
        setIsOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (selectedShow) setSelectedShow(null);
    };

    return (
        <div 
            ref={wrapperRef} 
            className="relative w-full max-w-md mx-auto z-10 flex gap-2"
            onClick={() => inputRef.current?.focus()}
        >
            <div className="relative flex-1">
                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    className="w-full p-4 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="search for a show or submit to skip"
                    value={query}
                    onChange={handleInputChange}
                    onFocus={() => query.trim().length >= 2 && !selectedShow && setIsOpen(true)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                {isOpen && results.length > 0 && (
                    <ul className="absolute w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg max-h-60 overflow-y-auto shadow-xl z-20">
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
            <button
                onClick={handleSubmit}
                disabled={disabled}
                className="px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors disabled:opacity-50"
            >
                Submit
            </button>
        </div>
    );
}
