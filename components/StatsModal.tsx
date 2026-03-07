import { motion, AnimatePresence } from 'framer-motion';
import { X, BarChart3, Trophy, PlayCircle, Flame, Star } from 'lucide-react';
import { Stats } from '@/lib/storage';

interface StatsModalProps {
    stats: Stats;
    onClose: () => void;
}

export default function StatsModal({ stats, onClose }: StatsModalProps) {
    const maxDistribution = Math.max(...stats.guessDistribution, 1);

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div className="absolute top-4 right-4 focus:outline-none">
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                                <BarChart3 size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Statistics</h2>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-4 gap-4 mb-10">
                            <StatItem label="Played" value={stats.gamesPlayed} icon={<PlayCircle size={14} className="text-gray-500" />} />
                            <StatItem
                                label="Win %"
                                value={stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0}
                                icon={<Trophy size={14} className="text-yellow-500" />}
                            />
                            <StatItem label="Streak" value={stats.currentStreak} icon={<Flame size={14} className="text-orange-500" />} highlight />
                            <StatItem label="Max" value={stats.maxStreak} icon={<Star size={14} className="text-purple-500" />} />
                        </div>

                        {/* Distribution Chart */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Guess Distribution</h3>
                            <div className="space-y-3">
                                {stats.guessDistribution.map((count, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-gray-500 w-2">{i + 1}</span>
                                        <div className="flex-1 h-6 bg-gray-800/50 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(count / maxDistribution) * 100}%` }}
                                                transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                                className={`h-full min-w-[30px] flex items-center justify-end px-3 text-[10px] font-black text-white ${count > 0 ? 'bg-gradient-to-r from-blue-600 to-blue-400' : 'bg-gray-700/30'
                                                    }`}
                                            >
                                                {count}
                                            </motion.div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full mt-10 py-4 bg-white hover:bg-gray-200 text-black font-black uppercase tracking-widest rounded-2xl transition-all transform active:scale-95 shadow-xl"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function StatItem({ label, value, icon, highlight }: { label: string; value: number; icon?: React.ReactNode; highlight?: boolean }) {
    return (
        <div className={`p-3 rounded-2xl border transition-colors ${highlight ? 'bg-orange-500/5 border-orange-500/20' : 'bg-gray-800/30 border-gray-700/30'
            }`}>
            <div className="flex items-center justify-center gap-1.5 mb-1">
                {icon}
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
            </div>
            <div className={`text-2xl font-black text-center ${highlight ? 'text-orange-400' : 'text-white'}`}>
                {value}
            </div>
        </div>
    );
}
