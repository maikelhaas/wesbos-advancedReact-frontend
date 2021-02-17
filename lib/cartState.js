// Provider, going to live high level
// Consumer, is able to talk to the provider, without having a direct link to eachother

import { createContext, useState } from 'react';
import { useContext } from 'react/cjs/react.development';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is our own custom provider, we will store data (state) and functionality (updaters) in here and anyone can access it via the consumer

  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// Make a custom hook for accessing the cart local state
function useCart() {
  // We use a consumer to access the local state
  // So you don't have to import both usecontext and the context itself
  // this will internally access it for us
  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };
