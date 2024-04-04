import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/userInfo">User Info</Link>
      </li>
    </ul>
  );
};
