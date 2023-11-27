import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Input from "@mui/material/Input";
import Avatar from "@mui/material/Avatar";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { storage } from "../firebase.config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, auth } from "../firebase.config";
import { useNavigate } from "react-router-dom";

const UserDetails = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    imageUrl: "",
  });

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const navigate = useNavigate();
  let userInfo;
  const userDetails = localStorage.getItem("userInfo");
  let userId;
  useEffect(() => {
    if (JSON.parse(userDetails) == null) {
      navigate("/");
    } else {
      userId = JSON.parse(userDetails).uid;
    }
  }, [userDetails]);

  const fetchUserData = async () => {
    userInfo = JSON.parse(userDetails);

    if (userInfo && userInfo.uid) {
      const userDoc = await getDoc(doc(db, "users", userInfo.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        setUser({
          name: userData.name,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          imageUrl: userData.imageUrl || "",
        });
        setImageUrl(userData.imageUrl || "");
      }
    }
  };

  useEffect(() => {
    fetchUserData();

    if (!userInfo || !userInfo.uid) {
      navigate("/");
      return;
    }
  }, [userInfo, navigate, imageUrl]); // Include imageUrl in the dependency array

  const signOutAndNavigate = async () => {
    try {
      await auth.signOut();
      navigate("/");
      localStorage.removeItem("userInfo");
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];

    if (selectedImage) {
      setImage(selectedImage);

      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };
  const addUser = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = user.imageUrl;
      if (image) {
        const imageRef = ref(storage, `images/${userId}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const updatedUser = {
        ...user,
        imageUrl: imageUrl,
      };

      await setDoc(doc(db, "users", userId), updatedUser, { merge: true });
      console.log("User details updated successfully");
      // navigate("/userList");
    } catch (error) {
      console.error("Error updating user details: ", error);
    }
  };

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen">
      <Stack
        component="form"
        sx={{
          width: "50ch",
        }}
        spacing={4}
        noValidate
        autoComplete="off"
      >
        <div className="text-center font-bold text-white text-2xl">
          <span>Enter your details</span>
        </div>
        {imageUrl && (
          <Avatar
            alt="User Image"
            src={imageUrl}
            sx={{ width: 100, height: 100, mt: 2 }}
          />
        )}
        <TextField
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          className="bg-emerald-600"
          placeholder="Enter your Name here"
          variant="filled"
        />
        <TextField
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="bg-emerald-600"
          placeholder="Enter your email here"
          variant="filled"
        />

        <TextField
          className="bg-emerald-600"
          value={user.phoneNumber}
          onChange={(e) => setUser({ ...user, phoneNumber: e.target.value })}
          variant="filled"
        />

        {/* Image Upload */}
        <Input type="file" accept="image/*" onChange={handleImageChange} />

        <button
          onClick={addUser}
          className="bg-emerald-700 w-full font-bold flex gap-1 items-center justify-center py-2 text-white rounded hover:bg-emerald-900"
        >
          <span>Update user Details</span>
        </button>
        <button
          onClick={signOutAndNavigate}
          className="bg-red-600 w-full m-2 font-bold flex gap-1 items-center justify-center pb-2 py-1.5 text-white rounded hover:bg-red-700"
        >
          <span>Sign Out</span>
        </button>
      </Stack>
    </section>
  );
};

export default UserDetails;
