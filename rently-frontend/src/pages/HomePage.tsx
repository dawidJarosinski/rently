import Navbar from "../component/Navbar";
import SearchBar from "../component/SearchBar";
import TopRatedFeed from "../component/TopRatedFeed";
const HomePage = () => {
    return (
        <>
            <Navbar />
            <SearchBar />
            <hr className="border-pink-300 my-4 mx-8" />
            <TopRatedFeed />
        </>
    );
};

export default HomePage;
