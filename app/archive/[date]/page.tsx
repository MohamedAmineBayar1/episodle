import Home from '../../page';

interface PageProps {
    params: Promise<{ date: string }>;
}

export default async function ArchiveDatePage({ params }: PageProps) {
    const { date } = await params;

    return <Home date={date} />;
}
