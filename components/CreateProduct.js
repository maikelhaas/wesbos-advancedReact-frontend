import gql from 'graphql-tag';
import Router from 'next/router';
import { useMutation } from '@apollo/client';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import ErrorMessage from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from './Products';

// Create a mutation in GraphQL
const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    # Set variables are being passed in and types
    $name: String!
    $description: String!
    $price: Int!
    $image: Upload
  ) {
    # Create the product
    createProduct(
      # Data that is being passed in
      data: {
        name: $name
        description: $description
        price: $price
        status: "AVAILABLE"
        # Photo is different, because it stored in a seperate schema
        photo: { create: { image: $image, altText: $name } }
      }
    ) {
      # Return values once item has been added
      id
      name
      description
      price
    }
  }
`;

export default function CreateProduct() {
  // Get data from hook set up in the lib and add default input values
  const { inputs, handleChange, clearForm } = useForm({
    name: '',
    price: 2000,
    description: '',
    image: '',
  });

  // Create a function called createProduct the use the mutation (called for on form submit)
  const [createProduct, { data, loading, error }] = useMutation(
    // Use the create product mutation
    CREATE_PRODUCT_MUTATION,
    {
      // Send the data from the inputs
      variables: inputs,
      // Fetch all products, so the new one shows up without refreshing the page
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
    }
  );

  // Handle submitting the form
  async function handleSubmit(e) {
    // Prevent refresh
    e.preventDefault();

    // Create the product from inputs and clear the form afterwards
    // Could also use {data} from useMutation above
    const res = await createProduct();

    // Go to the product detail page
    Router.push({ pathname: `/product/${res.data.createProduct.id}` });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <ErrorMessage error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <label htmlFor="image">
          Image
          <input
            required
            type="file"
            name="image"
            id="image"
            onChange={handleChange}
          />
        </label>
        <label htmlFor="name">
          Name
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={inputs.name}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="price">
          Price
          <input
            type="number"
            name="price"
            id="price"
            placeholder="Price"
            value={inputs.price}
            onChange={handleChange}
          />
        </label>
        <label htmlFor="description">
          Description
          <textarea
            name="description"
            id="description"
            placeholder="Description"
            value={inputs.description}
            onChange={handleChange}
          />
        </label>
        <button type="button" onClick={clearForm}>
          - Clear form
        </button>
        <button type="submit">+ Add product</button>
      </fieldset>
    </Form>
  );
}
