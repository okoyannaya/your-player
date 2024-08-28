import {useEffect, useState} from "react";

export interface User {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const useFetch = (url: string) => {
    const [data, setData] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
 
    useEffect(() => {
       let cancelled = false;
 
       setIsLoading(true);
       setData(null);
       setError(null);
       fetch(url)
          .then((res) => res.json())
          .then((respData: User) => {
             if (!cancelled) setData(respData);
          })
          .catch((e) => {
             if (!cancelled) setError(e);
          })
          .finally(() => {
             if (!cancelled) setIsLoading(false);
          });
 
       return () => {
          cancelled = true;
       };
    }, [url]);
 
    return {data, isLoading, error};
};
