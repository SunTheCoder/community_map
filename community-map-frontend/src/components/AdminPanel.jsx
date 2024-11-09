import { useSelector } from 'react-redux';

const AdminPanel = () => {
  const { user, isAdmin } = useSelector((state) => state.auth);

  return (
    <div>
      {isAdmin? (
        <button>Admin Actions</button>
      ) : (
        <p>Access restricted to admin users only</p>
      )}
    </div>
  );
};

export default AdminPanel;