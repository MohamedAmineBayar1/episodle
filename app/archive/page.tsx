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
                    <Link
                        href="/"
                        className="p-2 -ml-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-black tracking-tighter uppercase">Archive</h1>
                </header>

                <div className="space-y-3">
                    {dates.map((date) => {
                        const status = hasPlayedDate(date);
                        const isToday = date === new Date().toLocaleDateString('en-CA');

                        return (
                            <Link
                                key={date}
                                href={isToday ? '/' : `/archive/${date}`}
                                className="group flex items-center justify-between p-5 bg-gray-900/50 border border-gray-800 hover:border-gray-600 rounded-2xl transition-all active:scale-[0.98]"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-blue-500 animate-pulse' : 'bg-gray-700'}`} />
                                    <div>
                                        <span className="text-lg font-bold text-white tracking-tight">
                                            {new Date(date).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </span>
                                        {isToday && <span className="ml-2 text-[10px] font-black uppercase text-blue-500 tracking-widest">Today</span>}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {status === 'won' && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20">
                                            <CheckCircle2 size={12} />
                                            Won
                                        </span>
                                    )}
                                    {status === 'lost' && (
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20">
                                            <XCircle size={12} />
                                            Lost
                                        </span>
                                    )}
                                    <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
