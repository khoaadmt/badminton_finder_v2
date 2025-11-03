import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { SocialRedirect } from "./pages/Auth/GoogleRedirect/SocialRedirect";
import { LoginPage } from "./pages/Auth/LoginPage/LoginPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { LocationDetail } from "./pages/User/Location/LocationDetail";
import { CreatePostPage } from "./pages/User/Posts/CreatePostPage/CreatePostPage";
import { PostDetailPage } from "./pages/User/Posts/PostDetail/PostDetailPage";
import { SearchPage } from "./pages/User/SearchPage/SearchPage";
import { FacilitiesPage } from "./pages/User/SearchPage/FacilitiesPage/FacilitiesPage";
import { SessionsPage } from "./pages/User/SearchPage/SessionsPage/SessionsPage";
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
import { MyPosts } from "./pages/User/Posts/MyPosts/MyPosts";
import PrivateRoute from "./utils/routes/adminPrivateRoute";

const App: React.FC = () => {
    return (
        <div className="App">
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="search" element={<SearchPage />}>
                        <Route path="facilities" element={<FacilitiesPage />} />
                        <Route path="sessions" element={<SessionsPage />} />
                    </Route>

                    <Route path="post">
                        <Route path="create" element={<PrivateRoute />}>
                            <Route path="" element={<CreatePostPage />} />
                        </Route>

                        <Route path=":postId" element={<PostDetailPage />} />
                    </Route>

                    <Route path="location">
                        <Route path=":locationId" element={<LocationDetail />} />
                    </Route>

                    <Route path="login" element={<LoginPage />} />
                    <Route path="auth">
                        <Route path="social/redirect" element={<SocialRedirect />} />
                    </Route>

                    <Route path="user" element={<PrivateRoute />}>
                        <Route path="update-profile" element={<UserProfile />} />
                        <Route path="my-post" element={<MyPosts />} />
                        <Route path="my-booked-courts" element={<MyBookedCourts />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />

                <Route path="admin" element={<LayoutPage />}>
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
            </Routes>
        </div>
    );
};

export default App;
