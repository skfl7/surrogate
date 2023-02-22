import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// async function checkLoggedinUser() {
//   localForage
//     .getItem('loggedinUser')
//     .then((value: any) => {
//       console.log(value);
//       if (value.id) {
//         return true;
//       }
//       return false;
//     })
//     .catch((err: any) => {
//       console.log(err);
//       return false;
//     });
// }

export default function RequireAuth() {
  // const auth = { user: false }; // This will change in the future
  const location = useLocation();

  // const [isLoggedin, setIsLoggedin] = useState(false);

  // useEffect(() => {
  //   localForage
  //     .getItem('loggedinUser')
  //     .then((value: any) => {
  //       console.log('RequireAuth value in auth', value);
  //       // if (value.id) {
  //       setIsLoggedin(true);
  //       // }
  //     })
  //     .catch((err: any) => {
  //       console.log(err);
  //     });
  // }, []);

  return localStorage.getItem('isLoggedin') === 'true' ? (
    <Outlet />
  ) : (
    <Navigate to={'/portal/login'} state={{ from: location }} replace />
  );
}
