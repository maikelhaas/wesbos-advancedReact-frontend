import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
// import { CURRENT_USER_QUERY } from '../lib/user';

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

// Remove the deleted cart item from cache
function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(REMOVE_FROM_CART_MUTATION, {
    variables: { id },
    update,
    /* Not working right now
    optimisticResponse: {
      deleteCartItem: {
        __typename: 'CartItem',
        id,
      }
    } */
    // When I tried from top of mind:
    // refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <button disabled={loading} type="button" onClick={removeFromCart}>
      &times;
    </button>
  );
}
