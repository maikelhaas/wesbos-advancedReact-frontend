import Reset from '../components/Reset';
import RequestReset from '../components/ResetRequest';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <>
        <h2>Sorry you must supply a token</h2>
        <RequestReset />
      </>
    );
  }
  return (
    <>
      <h2>Reset password {query.token} </h2>
      <Reset token={query.token} />
    </>
  );
}
