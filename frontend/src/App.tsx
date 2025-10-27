import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NotFoundPage } from "./components/NotFoundPage/NotFoundPage";
import PrivateRoute from "./components/PrivateRoute";
import { SocialRedirect } from "./components/Auth/GoogleRedirect/SocialRedirect";
import { LoginPage } from "./components/Auth/LoginPage/LoginPage";
import { HomePage } from "./pages/HomePage/HomePage";
import { LocationDetail } from "./components/User/Location/LocationDetail";
import { CreatePostPage } from "./components/User/Posts/CreatePostPage/CreatePostPage";
import { PostDetailPage } from "./components/User/Posts/PostDetail/PostDetailPage";
import { SearchPage } from "./components/User/SearchPage/SearchPage";
import { FacilitiesPage } from "./components/User/SearchPage/facilities_page/FacilitiesPage";
import { SessionsPage } from "./components/User/SearchPage/sessions_page/SessionsPage";
import { MyBookedCourts } from "./components/User/UserPage/MyBookedCourts";
import { MyPost } from "./components/User/UserPage/MyPost";
import { UserProfile } from "./components/User/UserPage/UserProfile";
import "./App.css";
import { LayoutPage } from "./components/Admin/Layout";
import { Dashboard } from "./components/Admin/Dashboard";
import { OverviewLocationPage } from "./components/Admin/Location/Overview";
import { AddLocationPage } from "./components/Admin/Location/Add";
import { ReviewPostPage } from "./components/Admin/Post/ReviewPostPage";
import { RejectPostPage } from "./components/Admin/Post/RejectPostPage";
import { CheckedPostPage } from "./components/Admin/Post/CheckedPostPage";
import { StatisticsPage } from "./components/Admin/statistics";
import MainLayout from "./components/Layout/MainLayout";

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
                        <Route path="my-post" element={<MyPost />} />
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
