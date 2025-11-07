import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { SocialRedirect } from "./pages/Auth/GoogleRedirect/SocialRedirect";
import { LoginPage } from "./pages/Auth/LoginPage/LoginPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { PostDetailPage } from "./pages/User/PostsPage/PostDetail/PostDetailPage";
import { UserProfile } from "./pages/User/Profile/UserProfile";
import "./App.css";
import { LayoutPage } from "./pages/Admin/Layout";
import { Dashboard } from "./pages/Admin/Dashboard";
import { OverviewLocationPage } from "./pages/Admin/Location/Overview";
import { AddLocationPage } from "./pages/Admin/Location/Add";
import { ReviewPostPage } from "./pages/Admin/Post/ReviewPostPage";
import { RejectPostPage } from "./pages/Admin/Post/RejectPostPage";
import { CheckedPostPage } from "./pages/Admin/Post/CheckedPostPage";
import { StatisticsPage } from "./pages/Admin/statistics";
import MainLayout from "./components/Layout/MainLayout";
import { MyBookedCourts } from "./pages/User/MyBookedCourt/MyBookedCourts";
import { MyPosts } from "./pages/User/PostsPage/MyPosts/MyPosts";
import PrivateRoute from "./utils/routes/adminPrivateRoute";
import { LocationsPage } from "./pages/User/LocationsPage/LocationsPage";
import { LocationDetail } from "./pages/User/LocationsPage/LocationDetail/LocationDetail";
import { PostsPage } from "./pages/User/PostsPage/PostsPage";
import { CreatePostPage } from "./pages/User/PostsPage/CreatePostPage/CreatePostPage";

const App: React.FC = () => {
  return (
    <div className="App">
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />

          <Route path="posts">
            <Route path="" element={<PostsPage />} />
            <Route path="create" element={<CreatePostPage />} />

            <Route path=":postId" element={<PostDetailPage />} />
          </Route>

          <Route path="locations">
            <Route path="" element={<LocationsPage />} />
            <Route path=":locationId" element={<LocationDetail />} />
          </Route>

          <Route path="user" element={<PrivateRoute />}>
            <Route path="update-profile" element={<UserProfile />} />
            <Route path="my-post" element={<MyPosts />} />
            <Route path="my-booked-courts" element={<MyBookedCourts />} />
          </Route>
        </Route>
        <Route path="login" element={<LoginPage />} />
        <Route path="auth">
          <Route path="social/redirect" element={<SocialRedirect />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />

        <Route path="admin" element={<LayoutPage />}>
          <Route path="" element={<PrivateRoute />}>
            <Route path="" element={<Navigate to="dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="location">
              <Route path="" element={<Navigate to="overview" />} />
              <Route path="overview" element={<OverviewLocationPage />} />
              <Route path="add" element={<AddLocationPage />} />
            </Route>
            <Route path="post">
              <Route path="review" element={<ReviewPostPage />} />
              <Route path="checked" element={<CheckedPostPage />} />
              <Route path="reject" element={<RejectPostPage />} />
            </Route>
            <Route path="statistics" element={<StatisticsPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
