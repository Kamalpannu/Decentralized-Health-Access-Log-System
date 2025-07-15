import { gql, useQuery } from '@apollo/client';
import Login from './Login';
import Profile from './Profile';

const ME_QUERY = gql`
  query {
    me {
      id
      name
    }
  }
`;

function App() {
  const { data, loading } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {data?.me ? <Profile /> : <Login />}
    </div>
  );
}

export default App;
