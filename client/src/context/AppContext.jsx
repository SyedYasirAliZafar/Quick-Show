import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  /* ---------------- STATE ---------------- */
  const [isAdmin, setIsAdmin] = useState(false);
  const [shows, setShows] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);

  /* ---------------- CLERK ---------------- */
  const { user, isLoaded } = useUser();
  const { isSignedIn, getToken } = useAuth();

  /* ---------------- ROUTER ---------------- */
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {
    console.log("CLERK LOADED:", isLoaded);
    console.log("SIGNED IN:", isSignedIn);
    console.log("USER ID:", user?.id);
    console.log("CURRENT PATH:", location.pathname);
  }, [isLoaded, isSignedIn, user?.id, location.pathname]);

  /* ---------------- ADMIN CHECK ---------------- */
  const fetchIsAdmin = async () => {
    try {
      if (!user?.id) return;

      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/admin/is-admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setIsAdmin(data.isAdmin);

      // ❌ non-admin accessing admin routes
      if (data.isAdmin && location.pathname.startsWith("/admin")) {
        navigate("/");
        toast.error("You are not Authorized to access admin dashboard");
      }
    } catch (error) {
      console.log("Admin check error:", error);
    }
  };

  /* ---------------- SHOWS (PUBLIC) ---------------- */
  const fetchShows = async () => {
    try {
      const { data } = await axios.get("/api/show/all");
      if (data.success) {
        setShows(data.shows);
      }
    } catch (error) {
      console.log("Fetch shows error:", error);
    }
  };

  /* ---------------- FAVORITES ---------------- */
  const fetchFavoriteMovies = async () => {
    try {
      if (!user?.id) return;

      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setFavoriteMovies(data.movies);
      }
    } catch (error) {
      console.log("Favorites error:", error);
    }
  };

  /* ---------------- EFFECTS ---------------- */

  // Public data (no login needed)
  useEffect(() => {
    fetchShows();
  }, []);

  // Protected data (login + clerk fully ready)
  useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      fetchIsAdmin();
      fetchFavoriteMovies();
    }
  }, [isLoaded, isSignedIn, user?.id, location.pathname]);

  /* ---------------- CONTEXT VALUE ---------------- */
  const value = {
    isAdmin,
    shows,
    favoriteMovies,
    fetchShows,
    fetchIsAdmin,
    fetchFavoriteMovies,
    user,
    navigate,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

/* ---------------- CUSTOM HOOK ---------------- */
export const useAppContext = () => {
  return useContext(AppContext);
};