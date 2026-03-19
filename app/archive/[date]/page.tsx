import Home from '../../page';
import { redirect } from 'next/navigation';

interface PageProps {
    params: Promise<{ date: string }>;
}

export default async function ArchiveDatePage({ params }: PageProps) {
    const { date } = await params;

    // Validate YYYY-MM-DD format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        redirect('/archive');
    }

    // Validate real calendar date
    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (
        dateObj.getFullYear() !== year ||
        dateObj.getMonth() !== month - 1 ||
        dateObj.getDate() !== day
    ) {
        redirect('/archive');
    }

    // Validate not in the future
    const todayStr = new Date().toLocaleDateString('en-CA');
    if (date > todayStr) {
        redirect('/archive');
    }

    return <Home date={date} />;
}
