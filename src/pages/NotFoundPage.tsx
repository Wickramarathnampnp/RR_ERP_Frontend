import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="not-found">
      <p>404</p>
      <h1>Page not found</h1>
      <span>The page you requested does not exist or has moved.</span>
      <Link to="/"><Button icon={<Home size={17} />}>Return to overview</Button></Link>
    </div>
  );
}
