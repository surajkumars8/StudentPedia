import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";


const useShowToast = () => {
    const toast = useToast();
    //usecallback is used to prevent infinite loop by caching the function
    const ShowToast = useCallback(
        (title, description, status) => {
            toast({
                toast: title,
                description: description,
                status: status,
                Duration: 3000,
                isClosable: true,
            });
        }, [toast]);
    return ShowToast;
};

export default useShowToast;