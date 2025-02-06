import GroupForm from '../components/group-form';
import { Container } from 'react-bootstrap';

export const metadata = {
  title: 'Create a Group',
}

export default function Page() {
  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 mb-3">Create Your Group</h1>
        <p className="lead text-muted">
          Create a group to start tracking Super Bowl props with friends and family
        </p>
      </div>
      <GroupForm />
    </Container>
  );
}