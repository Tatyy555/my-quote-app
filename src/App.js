import { useState, useEffect } from "react";

function App() {
  const [quote, setQuote] = useState({});
  const [quoteJp, setQuoteJp] = useState("");
  const [authorJp, setAuthorJp] = useState("");
  const [authorImg, setAuthorImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetching an image from Google or Wikipedia using text
  const pictureApi = (text) => {
    // // The Google Custom Api is 100 times for a day. So, use the following for sample.
    // setAuthorImg(
    //   "https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg"
    // );

    // The Following is for Wikipedia
    let url = `https://en.wikipedia.org//w/api.php?action=opensearch&format=json&origin=*&search=${text}&limit=3`;

    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        let title = response[1][0].replace(/ /g, "_");
        url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
        fetch(url)
          .then((response) => response.json())
          .then((response) => {
            setAuthorImg(response.originalimage.source);
          });
      })
      .catch((err) => {
        console.error(err);

        // The Follwing is for Google. It runs if Wiki is not available
        let url = `https://www.googleapis.com/customsearch/v1/siterestrict?key=${
          process.env.REACT_APP_GOOGLE_API_KEY
        }&cx=51654d013c4c24926&q=${text + " portlait"}&searchType=image&num=1`;
        fetch(url)
          .then((response) => response.json())
          .then((response) => {
            console.log(response);
            console.log(response.items[0].link);
            setAuthorImg(response.items[0].link);
          })
          .catch((err) => {
            console.log("ERRORR!!!!");
            console.error(err);
          });
      });
  };

  // Fetching translation from DeepL using English text
  const translateApi = (entext, string) => {
    const API_KEY = process.env.REACT_APP_DEEPL_API_KEY;
    const API_URL = process.env.REACT_APP_DEEPL_URL;
    let content = encodeURI(
      "auth_key=" +
        API_KEY +
        "&text=" +
        entext +
        "&source_lang=EN&target_lang=JA"
    );
    let url = API_URL + "?" + content;

    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        if (string === "quote") {
          setQuoteJp(response.translations[0].text);
        } else if (string === "author") {
          setAuthorJp(response.translations[0].text);
        }
      })
      .catch((err) => console.error(err));
  };

  // Fetching famous quote from Ninja API
  const quoteApi = () => {
    // Show loading
    setIsLoading(true);

    const options = {
      headers: {
        "X-Api-Key": process.env.REACT_APP_NINJA_API_KEY,
      },
    };
    let url = "https://api.api-ninjas.com/v1/quotes?category=hope";

    fetch(url, options)
      .then((response) => response.json())
      .then((response) => {
        translateApi(response[0].quote, "quote");
        translateApi(response[0].author, "author");
        pictureApi(response[0].author);
        setQuote(response);
        setTimeout(function () {
          setIsLoading(false);
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  };

  // Run quoteApi for the first mount
  useEffect(() => {
    quoteApi();
    // eslint-disable-next-line
  }, []);

  return (
    <section className="text-gray-400 bg-gradient-to-tr from-green-800 via-blue-800 to-purple-900 body-font min-h-screen min-w-screen">
      {/* Title */}
      <p
        className="flex items-center px-10 pt-9 lg:px-20 xl:px-32 text-indigo-400  font-bold text-4xl sm:text-6xl lg:text-8xl"
        href="#"
      >
        Quote
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-pink-500 to-purple-500">
          Translator
        </span>
      </p>

      {/* Content */}
      {isLoading === false && quote[0] !== undefined ? (
        <div className="container mx-auto flex px-5 pt-12 pb-20 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 md:mb-0 mb-10">
            <img
              className="object-contain bg-white object-center rounded-3xl w-[720] h-[600]"
              alt="authorImg"
              src={authorImg}
            />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
              {quote[0].quote}
            </h1>
            <p className="mb-8 leading-relaxed text-2xl">{quote[0].author}</p>
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-white">
              {quoteJp}
            </h1>
            <p className="mb-8 leading-relaxed text-2xl">{authorJp}</p>
            <div className="flex justify-center">
              <button
                className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg"
                onClick={quoteApi}
              >
                New Quote
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Show Loading
        <div className="flex justify-center my-32">
          <span className="circle animate-loader"></span>
          <span className="circle animate-loader animation-delay-200"></span>
          <span className="circle animate-loader animation-delay-400"></span>
          <span className="circle animate-loader animation-delay-600"></span>
        </div>
      )}
      {/* Footer */}
      <p className="font-extralight text-white text-xl text-center pb-16">
        Designed and Coded by Yamaguchi
      </p>
    </section>
  );
}

export default App;
