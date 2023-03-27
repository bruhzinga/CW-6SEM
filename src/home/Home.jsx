import { useSelector } from 'react-redux';


export { Home };

function Home() {
    const { user: authUser } = useSelector(x => x.auth);





    return (
        <div>
            <h1>Hi {authUser?.username}!</h1>

           {/* <h3>Users from secure api end point:</h3>*/}
           {/* {users.length &&
                <ul>
                    {users.map(user =>
                        <li key={user.id}>{user.firstName} {user.lastName}</li>
                    )}
                </ul>
            }
            {users.loading && <div className="spinner-border spinner-border-sm"></div>}
            {users.error && <div className="text-danger">Error loading users: {users.error.message}</div>}*/}
        </div>
    );
}
