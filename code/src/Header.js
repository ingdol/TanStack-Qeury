import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
        <li>
          <Link to="/userInfo">User Info</Link>
        </li>
      </li>
    </ul>
  );
};
