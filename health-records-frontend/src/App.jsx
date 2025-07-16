import { gql, useQuery } from '@apollo/client';
import {LoginPage} from './pages/LoginPage';
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
      {data?.me ? <Profile /> : <LoginPage />}
    </div>
  );
}

export default App;
