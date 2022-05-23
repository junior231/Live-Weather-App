import Head from "next/head";
import SearchBox from "../components/SearchBox";
import FamousPlaces from "../components/FamousPlaces";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Weather App</title>
      </Head>

      <div className="home">
        <div className="container">
        <div style={{textAlign: "center", marginBottom: 20, paddingBottom: 20}}>
        <h3 className="weekly__title">
          Live <span>Weather App</span>
        </h3>
        <p>Get the current weather update of any city you can find in next to no time. </p>
        </div>
          <SearchBox placeholder="Search for a city..." />
          <FamousPlaces />
        </div>
      </div>
    </div>
  );
}
