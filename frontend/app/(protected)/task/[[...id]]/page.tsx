interface TaskProps {
    params: Promise<{ id: string[] }>
}

export default async function TaskPage({ params }: TaskProps) {
    const resolvedParmas = await params
    const isArray = resolvedParmas.id
    const id = isArray ? isArray[0] : null


    if (!id) {
        return (
            <div className="p-4">
                <h1>Welcome to the tasks Page</h1>
                <p>This is the default content shown when no ID is in the URL.</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Task Details</h1>
            <p>Welcome to the task details page.</p>
        </div>
    );
}
