"use client";


import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { hasPlayedDate } from '@/lib/storage';

export default function ArchivePage() {
    const [dates, setDates] = useState<string[]>([]);

    useEffect(() => {
        const last30Days = [];
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            last30Days.push(d.toLocaleDateString('en-CA'));
        }
        setDates(last30Days);
    }, []);

    return (
        <main className="min-h-screen bg-black text-white px-4 py-8 font-sans">
            <div className="max-w-2xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <Link prefetch={false}
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Archive</h1>
                </header>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {dates.map((date) => {
                        const status = hasPlayedDate(date);
                        const isToday = date === new Date().toLocaleDateString('en-CA');
                        const dateObj = new Date(date);

                        return (
                            <Link prefetch={false}
                                key={date}
                                href={isToday ? '/' : `/archive/${date}`}
                                className={`group relative aspect-square p-2 bg-gray-900/50 border flex flex-col items-center justify-center text-center rounded-2xl transition-all active:scale-[0.98] ${isToday
                                        ? 'border-blue-500/50 hover:border-blue-500 bg-blue-500/5'
                                        : 'border-gray-800 hover:border-gray-600'
                                    }`}
                            >
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                                        {dateObj.toLocaleDateString(undefined, { weekday: 'short' })}
                                    </div>
                                    <div className="text-2xl font-black tracking-tighter">
                                        {dateObj.getDate()}
                                    </div>
                                    <div className="text-[10px] font-bold uppercase text-gray-400">
                                        {dateObj.toLocaleDateString(undefined, { month: 'short' })}
                                    </div>
                                </div>

                                <div className="absolute top-2 right-2">
                                    {status === 'won' && (
                                        <div className="text-green-500 bg-green-500/20 p-1 rounded-full border border-green-500/20">
                                            <CheckCircle2 size={12} />
                                        </div>
                                    )}
                                    {status === 'lost' && (
                                        <div className="text-red-500 bg-red-500/20 p-1 rounded-full border border-red-500/20">
                                            <XCircle size={12} />
                                        </div>
                                    )}
                                </div>

                                {isToday && (
                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-500 text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-blue-500/20">
                                        Today
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
