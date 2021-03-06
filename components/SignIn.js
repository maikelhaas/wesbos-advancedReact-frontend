import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from '../lib/user';
import ErrorMessage from './ErrorMessage';
import Form from './styles/Form';

// GraphQL Mutation
const SIGNIN_MUTATION = gql`
  # Create mutation and set the incoming variables and types
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    # Try to log in with provided email and password
    authenticateUserWithPassword(email: $email, password: $password) {
      # If login is ok, return id, email and name of user
      ... on UserAuthenticationWithPasswordSuccess {
        item {
          id
          email
          name
        }
      }
      # If login fails, return error message and code
      ... on UserAuthenticationWithPasswordFailure {
        code
        message
      }
    }
  }
`;

export default function SignIn() {
  // Custom hook for form handling
  // Set form default values to nothing initially
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
  });

  // Send the email and password to the GraphQL api
  const [signin, { data, loading }] = useMutation(SIGNIN_MUTATION, {
    variables: inputs,
    // Refetch the currently logged in user
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  if (loading) return <p>Loading...</p>;
  // if (error) return <ErrorMessage error={error} />;

  async function handleSubmit(e) {
    e.preventDefault(); // stop the form from submitting
    console.log(inputs);
    const res = await signin();
    console.log(res);
    resetForm();
  }

  const error =
    data?.authenticateUserWithPassword.__typename ===
    'UserAuthenticationWithPasswordFailure'
      ? data.authenticateUserWithPassword
      : undefined;

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Sign into your account!</h2>
      <ErrorMessage error={error} />
      <fieldset>
        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            placeholder="Email"
            autoComplete="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Submit</button>
      </fieldset>
    </Form>
  );
}
