import { getWorkspace, getWorkspaces } from "@/services/workspace.service";
import { useQuery } from "@tanstack/react-query";

export default function Useworkspace(id?: number | string) {

    return useQuery({

        queryKey: id ? ['workspaces', id] : ['workspaces'],
        queryFn: () => id ? getWorkspace(Number(id)) : getWorkspaces(),
        staleTime: 1000 * 60 * 5,
    })
}
