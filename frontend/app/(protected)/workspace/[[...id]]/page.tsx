interface workspaceProps {
    params: Promise<{ id: string[] }>
}

export default async function Workspace({ params }: workspaceProps) {

    const resolvedParmas = await params
    const isArray = resolvedParmas.id
    const id = isArray ? isArray[0] : null


    if (!id) {
        return (
            <div className="p-4">
                <h1>Welcome to the Workspace Page</h1>
                <p>This is the default content shown when no ID is in the URL.</p>
            </div>
        );
    }
    return (

        <div>workspace</div>
    )
}
