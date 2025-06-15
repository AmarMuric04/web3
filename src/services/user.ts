import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface RandomUserResponse {
  results: Array<{
    gender: string;
    name: {
      title: string;
      first: string;
      last: string;
    };
    location: {
      street: {
        number: number;
        name: string;
      };
      city: string;
      state: string;
      country: string;
      postcode: string | number;
      coordinates: {
        latitude: string;
        longitude: string;
      };
      timezone: {
        offset: string;
        description: string;
      };
    };
    email: string;
    login: {
      uuid: string;
      username: string;
      password: string;
      salt: string;
      md5: string;
      sha1: string;
      sha256: string;
    };
    dob: {
      date: string;
      age: number;
    };
    registered: {
      date: string;
      age: number;
    };
    phone: string;
    cell: string;
    id: {
      name: string;
      value: string;
    };
    picture: {
      large: string;
      medium: string;
      thumbnail: string;
    };
    nat: string;
  }>;
  info: {
    seed: string;
    results: number;
    page: number;
    version: string;
  };
}

interface GetUsersParams {
  results?: number;
  gender?: "male" | "female";
  nat?: string;
  seed?: string;
  page?: number;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://randomuser.me/api/",
  }),
  endpoints: (builder) => ({
    getRandomUsers: builder.query<RandomUserResponse, GetUsersParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();

        if (params.results)
          searchParams.append("results", params.results.toString());
        if (params.gender) searchParams.append("gender", params.gender);
        if (params.nat) searchParams.append("nat", params.nat);
        if (params.seed) searchParams.append("seed", params.seed);
        if (params.page) searchParams.append("page", params.page.toString());

        const queryString = searchParams.toString();
        return queryString ? `?${queryString}` : "";
      },
    }),

    getSingleUser: builder.query<RandomUserResponse, void>({
      query: () => "?results=1",
    }),

    getUsers: builder.query<RandomUserResponse, number>({
      query: (count) => `?results=${count}`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetRandomUsersQuery,
  useGetSingleUserQuery,
  useGetUsersQuery,
} = userApi;
