import { useRouter } from 'next/dist/client/router';
import Pagination from '../../components/Pagination';
import PleaseSignIn from '../../components/PleaseSignIn';
import Products from '../../components/Products';

export default function OrderPage() {
  const { query } = useRouter();
  const page = parseInt(query.page);
  return (
    <div>
      <PleaseSignIn>
        <Pagination page={page || 1} />
        <Products page={page || 1} />
        <Pagination page={page || 1} />
      </PleaseSignIn>
    </div>
  );
}
