interface PageProp {
    params: Promise<{ id: string[] }>
}
export default async function ProjectPage({ params }: PageProp) {
    const resolvedParams = await params;
    const idArray = resolvedParams.id;
    const id = idArray ? idArray[0] : null;

    if (!id) {
        return (
            <div className="p-4">
                <h1>Welcome to the projects Page</h1>
                <p>This is the default content shown when no ID is in the URL.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Project Details</h1>
            <p>Welcome to the project details page.</p>
        </div>
    );
}
