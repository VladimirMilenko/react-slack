import { gql, useQuery } from '@apollo/client';

export const GET_MSG = gql`
  {
    hello
  }
`;
export const GET_RANDOM_MSG = gql`
  {
    random
  }
`;
