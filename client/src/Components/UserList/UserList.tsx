import React from "react";
import { User } from "Types";

const UserList = ({ users }: { users: User[] }) => {
  return (
    <div className="p-2" style={{ borderRadius: "5px" }}>
      {users.map((user) => (
        <p className="mb-1">
          {user.display_name || user.first_name + " " + user.last_name}
        </p>
      ))}
    </div>
  );
};

export default UserList;
