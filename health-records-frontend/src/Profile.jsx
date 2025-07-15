import { gql, useQuery } from '@apollo/client';

const ME_QUERY = gql`
  query {
    me {
      id
      name
      email
      role
    }
  }
`;

function Profile() {
  const { data, loading, error } = useQuery(ME_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Welcome, {data.me.name}</h2>
      <p>Email: {data.me.email}</p>
      <p>Role: {data.me.role}</p>
      <button onClick={() => {
        fetch('http://localhost:4000/logout', {
          method: 'GET',
          credentials: 'include'
        }).then(() => window.location.reload());
      }}>
        Logout
      </button>
    </div>
  );
}

export default Profile;
