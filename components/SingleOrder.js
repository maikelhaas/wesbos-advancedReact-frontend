import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import ErrorMessage from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      charge
      total
      user {
        id
      }
      items {
        id
        name
        description
        quantity
        price
        photo {
          altText
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <ErrorMessage error={error} />;

  const { Order } = data;

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits | Order details</title>
      </Head>
      <h2>Thank you for your order!</h2>
      <p>
        <span>Order Id:</span>
        <span>{Order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{Order.charge}</span>
      </p>
      <p>
        <span>Order Total:</span>
        <span>{formatMoney(Order.total)}</span>
      </p>
      <p>
        <span>Total items:</span>
        <span>{Order.items.length}</span>
      </p>
      <div>
        {Order.items.map((item) => {
          console.log(item);
          return (
            <div className="order-item" key={item.id}>
              <img
                src={item.photo.image.publicUrlTransformed}
                alt={item.name}
              />
              <div className="item-details">
                <h2>{item.name}</h2>
                <p>Amount: {item.quantity}</p>
                <p>Each: {formatMoney(item.price)}</p>
                <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
                <p>{item.description}</p>
              </div>
            </div>
          );
        })}
        <em>{formatMoney(Order.total)}</em>
      </div>
    </OrderStyles>
  );
}
