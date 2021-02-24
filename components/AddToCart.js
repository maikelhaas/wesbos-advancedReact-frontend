import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { useCart } from '../lib/cartState';
import { CURRENT_USER_QUERY } from '../lib/user';

const ADD_TO_CART_MUTATION = gql`
  mutation($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const [addToCart, { loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const { openCart } = useCart();

  return (
    <button
      disabled={loading}
      onClick={() => {
        addToCart();
        openCart();
      }}
      type="button"
    >
      Add{loading && 'ing'} to cart +
    </button>
  );
}
