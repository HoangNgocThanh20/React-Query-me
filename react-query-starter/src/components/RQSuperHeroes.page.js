import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";

const fetchSuperHeroes = () => {
  return axios.get("http://localhost:4000/superheroes");
};

const addSuperHero = (hero) => {
  return axios.post("http://localhost:4000/superheroes", hero);
};

export const RQSuperHeroesPage = () => {
  const [name, setName] = useState("");
  const [alterEgo, setAlterEgo] = useState("");

  const { isLoading, data, isError, error, isFetching, refetch } = useQuery(
    "super-heroes",
    fetchSuperHeroes,
    {
      cacheTime: 5000,
      // staleTime: 3000,
      // refetchOnMount: true,
      // refetchOnWindowFocus: true,
      // refetchInterval: 1000,
      // refetchIntervalInBackground: true,
      // onSuccess: () => {
      //   console.log('call superheroes successfull !!')
      // },
      // onError: () => {
      //   console.log('call superheroes error !!')
      // }
    }
  );

  console.log({ isLoading, isFetching });

  const queryClient = useQueryClient();

  const { mutate: addHero } = useMutation(addSuperHero, {
    onSuccess: (data) => {
      // queryClient.invalidateQueries("super-heroes");
      queryClient.setQueryData('super-heroes', (oldQueryData) => {
        return {
          ...oldQueryData,
          data: [...oldQueryData.data, data.data]
        }
      })
    },
  });

  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
    return <h2>{error.message}</h2>;
  }

  const handleAddHeroClick = () => {
    const hero = { name, alterEgo };
    addHero(hero);
  };

  return (
    <>
      <h2>React Query Super Heroes Page</h2>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={alterEgo}
          onChange={(e) => setAlterEgo(e.target.value)}
        />
        <button onClick={handleAddHeroClick}>Add Hero</button>
      </div>
      <button onClick={refetch}>Fetch heroes</button>
      {data?.data.map((hero) => (
        <div key={hero?.name}>
          <Link to={`/rq-super-heroes/${hero?.id}`}>{hero?.name}</Link>
        </div>
      ))}
    </>
  );
};
