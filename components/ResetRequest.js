import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import Error from './ErrorMessage';
import Form from './styles/Form';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    sendUserPasswordResetLink(email: $email) {
      message
    }
  }
`;

export default function RequestReset() {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
  });

  const [signup, { data, loading, error }] = useMutation(
    REQUEST_RESET_MUTATION,
    {
      variables: inputs,
    }
  );

  async function handleSubmit(e) {
    e.preventDefault();
    await signup().catch(console.error);
    resetForm();
  }
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request password reset</h2>
      <Error error={error} />
      <fieldset>
        {data?.sendUserPasswordResetLink === null && (
          <p>Succes, check your email for a link!</p>
        )}
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Your Email Address"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Request reset!</button>
      </fieldset>
    </Form>
  );
}
