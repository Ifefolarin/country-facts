import { useEffect, useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function getCountries() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://restcountries.com/v3.1/name/${name}`
          );
          if (!res.ok)
            throw new Error("Something went wrong with fetching countries");

          const data = await res.json();
          if (data.Response === "False") throw new Error("Country not Found");

          console.log(data);
          setCountries(data);
          setError("");
        } catch (err) {
          console.error(err);
          if (err.namee !== "AbortError") {
            console.log(err.message);
            setError(err.message);
          }
        } finally {
          setIsLoading(false);
        }
      }
      if (name.length < 3) {
        setCountries([]);
        setError("");
        return;
      }
      getCountries();
    },
    [name]
  );
  return (
    <div className="app">
      <NavBar>
        <Search name={name} setName={setName} countries={countries} />
        <SearchResults countries={countries} name={name} />
        <ToggleMode />
      </NavBar>

      <Main>
        {isLoading && !error ? <Loader /> : <Countries countries={countries} />}{" "}
        {error && <ErrorMessage message={error} />}
      </Main>
    </div>
  );
}

function Loader() {
  return <div className="loader">Loading...</div>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️ </span>
      {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Logo() {
  return <h1 className="logo">🌏 Facts</h1>;
}

function Search({ name, setName }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search for country..."
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  );
}

function SearchResults({ countries, name }) {
  return <p className="search-results">Found: {countries.length} Results</p>;
}

function ToggleMode() {
  const [darkMode, setDarkMode] = useState(false);

  function handleToggleMode() {
    setDarkMode((on) => !on);
  }
  const darkModeStyle = {
    float: "right",
    backgroundColor: "cyan",
  };

  useEffect(
    function () {
      if (darkMode === true) {
        document.body.style.backgroundColor = "#212529";
        document.body.style.color = "cyan";
        document.querySelector(".nav-bar ").style.backgroundColor = "#6741d9";
        document.querySelector(".search").style.backgroundColor = "#7950f2";
      }
      return () => {
        document.body.style.backgroundColor = "";
        document.body.style.color = "";
        document.querySelector(".nav-bar ").style.backgroundColor = "";
        document.querySelector(".search").style.backgroundColor = "";
      };
    },
    [darkMode]
  );

  return (
    <div className="container" onClick={handleToggleMode}>
      <div className="ball" style={darkMode ? darkModeStyle : {}}></div>
    </div>
  );
}

function Countries({ countries }) {
  return (
    <ul className="country-list">
      {countries.map((country) => (
        <Country country={country} key={country.cca3} />
      ))}
    </ul>
  );
}

function Country({ country }) {
  const [showFacts, setShowFacts] = useState(false);

  function handleShowDetails() {
    setShowFacts((show) => !show);
  }

  return (
    <li className="country">
      <img src={country.flags.png} alt={country.flag.alt} />
      <h3>
        {country.name.common} {country.flag}
      </h3>
      <span>Capital: {country.capital}</span>
      <div className="facts" onClick={handleShowDetails}>
        {showFacts ? (
          <p className="hide-facts">Hide facts</p>
        ) : (
          <p className="show-facts">Show facts</p>
        )}
      </div>
      {showFacts && <CountryFacts country={country} />}
    </li>
  );
}

function CountryFacts({ country }) {
  const {
    name,
    languages,
    continents,
    borders,
    population,
    timezones,
    area,
    altSpellings,
  } = country;

  return (
    <div className="country-facts">
      <p>
        <strong>Names </strong>: {name.official},{" "}
        {name.nativeName.ita?.official}
      </p>
      <p>
        <strong>Languages Spoken</strong>: {languages?.eng}
      </p>
      <p>
        <strong>Land size</strong>:{" "}
        {area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}km
      </p>
      <p>
        <strong>Other Names</strong>: {altSpellings.slice("").join(", ")}
      </p>
      <p>
        <strong>Continent</strong>: {continents}
      </p>
      <p>
        <strong>Borders</strong>: {borders?.slice("").join(", ")}
      </p>
      <p>
        <strong>Population</strong>:{" "}
        {population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ", ")}
      </p>

      <p>
        <strong>Timezones</strong>: {timezones?.slice("").join(", ")}
      </p>
    </div>
  );
}
