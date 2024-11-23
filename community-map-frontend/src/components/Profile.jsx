import React from "react";



const Profile = ({user}) => {
    console.log(user); // Output: "John Doe"
    return (
        <div>
            <h1>Profile Page</h1>
            <p>Welcome to your profile page, `{user}`!</p>
        </div>
    )
}

export default Profile;