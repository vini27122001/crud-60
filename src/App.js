import { Route, BrowserRouter, Routes } from "react-router-dom";
import NewMeetup from "./pages/NewMeetup";
import AllMeetupsPage from "./pages/AllMeetups";
import FavoritesPage from "./pages/Favorites";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
    <Layout>
        <Routes>
          <Route path="/new" element={<NewMeetup />} />
          <Route path="/" element={<AllMeetupsPage />}  />
          <Route path="/fav" element={<FavoritesPage />} />
        </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;
