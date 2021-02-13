import { PAGINATION_QUERY } from '../components/Pagination';

export default function paginationField() {
  return {
    keyArgs: false, // Tells Apollo we wil take care of everything
    read(existing = [], { args, cache }) {
      // args = skip and first variables from Products.js
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const data = cache.readQuery({ query: PAGINATION_QUERY });
      const count = data?._allProductsMeta?.count;

      // Get the current page and total pages
      const page = skip / first + 1;
      const pageCount = Math.ceil(count / first);

      // Check if we have existing items
      const items = existing.slice(skip, skip + first).filter((x) => x);

      // If there are items AND there aren't enough to satisfy how many were requested AND we are on the last page, then just send it
      if (items.length && items.length !== first && page === pageCount) {
        return items;
      }
      if (items.length !== first) {
        // We don't have any items, we must go the network to fetch them
        return false;
      }
      // If the are items, return them from the cache and we don't have to go the network
      if (items.length) {
        console.log(
          `There are ${items.length} items in the cache! Gonna send them to Apollo!`
        );
        return items;
      }

      // The other thing we can do is to return false from here (network request)
      return false;
    },
    merge(existing, incoming, { args }) {
      const { skip } = args;
      // This runs when the Apollo client comes back from the network with our product
      console.log(`Merging items from the network: ${incoming.length}`);
      // * console.log(incoming);

      const merged = existing ? existing.slice(0) : [];

      for (let i = skip; i < skip + incoming.length; i += 1) {
        merged[i] = incoming[i - skip];
      }

      // * console.log(merged);

      // Goes back to read and Apollo tries read() again
      return merged;
    },
  };
}
