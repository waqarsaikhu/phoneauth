import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = await getDocs(collection(db, "users"));

        const userList = await Promise.all(
          usersCollection.docs.map(async (doc) => {
            const userData = doc.data();
            const imageUrl = userData.imageUrl;

            const imageRef = imageUrl ? ref(storage, `images/${doc.id}`) : null;

            const imageUrlSrc = imageRef
              ? await getDownloadURL(imageRef)
              : null;

            return {
              id: doc.id,
              ...userData,
              imageUrl: imageUrlSrc,
            };
          })
        );

        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <div className="font-sans">
        <h2 className="text-3xl mb-4 text-center font-bold text-gray-800">
          User List
        </h2>
        <ul className="list-none p-0">
          {users.map((user) => (
            <li
              key={user.id}
              className="border border-gray-300 rounded p-4 mb-4 flex items-center"
            >
              <div className="mr-4">
                {user.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt={`User ${user.name}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <div className="mb-2">
                  <strong className="mr-2">Name:</strong>
                  {user.name}
                </div>
                <div className="mb-2">
                  <strong className="mr-2">Email:</strong>
                  {user.email}
                </div>
                <div>
                  <strong className="mr-2">Phone:</strong>
                  {user.phoneNumber}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default UserList;
