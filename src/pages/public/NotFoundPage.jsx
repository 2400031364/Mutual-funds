import { ButtonLink } from '../../components/ui/Button/Button';

export default function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Page not found</h1>

      <p>
        The page you are looking for does not exist.
        Use the navigation or go back to the platform home.
      </p>

      <div style={{ marginTop: '20px' }}>
        <ButtonLink to="/">Go to Home</ButtonLink>
        <ButtonLink to="/funds" style={{ marginLeft: '10px' }}>
          Browse Funds
        </ButtonLink>
      </div>
    </div>
  );
}