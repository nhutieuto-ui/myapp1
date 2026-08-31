import { Button } from '@/components/ui/button';
import { logout } from '@/app/actions/sign-out';

export function LogoutButton() {
  return (
    <form action={logout}>
      <Button type="submit" variant="outline" size="sm">
        Log out
      </Button>
    </form>
  );
}
