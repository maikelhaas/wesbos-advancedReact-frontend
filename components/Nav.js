import Link from 'next/link';
import NavStyles from './styles/NavStyles';
import { useUser } from '../lib/user';
import SignOut from './SignOut';

export default function Nav() {
  const user = useUser();

  return (
    <NavStyles>
      {user && (
        <>
          <Link href="/products">Products</Link>
          <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link>
          <SignOut />
        </>
      )}
      {!user && <Link href="/signin">Sign in</Link>}
    </NavStyles>
  );
}
