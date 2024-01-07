import React, { useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { FaUserFriends } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

import { Navbar, PostForm, Post, LoadingOverlay } from "../../Components";
import { useAppDispatch, useAppSelector } from "../../Hooks/utils";
import { fetchPosts, selectAllPosts } from "../../Store/posts";
import { User } from "../../Types/types";
import { ProtectedRoute } from "../../Components/ProtectedRoute/ProtectedRoute";
import { IUser } from "../../../../server/models/users";

const Home = () => {
  const { ref, inView } = useInView();
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => selectAllPosts(state.posts));
  const user = useAppSelector((state) => state.auth.user) as IUser;
  const loading = useAppSelector((state) => state.posts.loading);
  const hasMoreData = useAppSelector((state) => state.posts.hasMoreData);

  const postInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    if (inView && !loading && hasMoreData) {
      dispatch(fetchPosts());
    }
  }, [inView, loading, hasMoreData]);

  if (!user) return;

  return (
    <div className="w-full h-dvh gap-5 grid grid-cols-12 pt-14">
      <CSSTransition in={loading} timeout={300} classNames="fade" unmountOnExit>
        <LoadingOverlay />
      </CSSTransition>
      <Navbar key="home" />
      <div className="md:hidden overflow-scroll lg:block lg:col-span-3">
        <Link
          className="flex items-center p-2 rounded-md text-black text-md cursor-pointer hover:bg-black"
          href={`/users/${user._id}`}
        >
          <img className="rounded-full w-9 h-9" src={user.profile_photo} />
          &nbsp;{user.display_name || user.first_name + " " + user.last_name}
        </Link>
        <Link
          className="flex items-center p-2 rounded-md text-black text-md cursor-pointer hover:bg-black"
          href="/friends"
        >
          <FaUserFriends size={36} fill="royalblue" />
          &nbsp;Friends
        </Link>
      </div>
      <div className="sm:col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 overflow-scroll -mx-6 px-6">
        <PostForm postInputRef={postInputRef} user={user} />
        {posts.map((post) => (
          <Post key={`post-${post._id}`} post={post} />
        ))}
        {!posts.length && (
          <div className="p-2 w-full rounded bg-white flex items-center justify-center">
            <p style={{ display: "inline-block" }} className="mb-0">
              No posts yet. Find{" "}
              <Link style={{ color: "royalblue" }} href="/friends">
                Friends
              </Link>{" "}
              or
            </p>
            <div
              className="inline-block text-blue-500 cursor-pointer hover:text-underline"
              onClick={() => postInputRef?.current?.focus()}
            >
              &nbsp;create a post!
            </div>
          </div>
        )}
        <div ref={ref} style={{ width: "10px", height: "2px" }} />
      </div>
      <div className="md:hidden lg:block lg:col-span-3 overflow-scroll">
        <h5 style={{ color: "darkgray" }}>Contacts</h5>
        <hr className="my-2" style={{ backgroundColor: "lightgray" }}></hr>
        {user.friends.map((friend) => (
          <Link
            className="flex items-center p-2 rounded-md text-black text-md cursor-pointer hover:bg-black"
            href={`/users/${friend._id}`}
          >
            {/*@ts-ignore*/}
            <img className="rounded-full w-9 h-9" src={friend.profile_photo} />
            &nbsp;
            {/*@ts-ignore*/}
            {friend.display_name ||
              //@ts-ignore
              friend.first_name + " " + friend.last_name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProtectedRoute(Home);
