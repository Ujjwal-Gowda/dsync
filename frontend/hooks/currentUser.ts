import { getCurrentUser } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";
export default function CurrentUser() {
    return useQuery({
        queryKey: ['userInfo'],
        queryFn: getCurrentUser,
        staleTime: 1000 * 60 * 5,
    })

}
