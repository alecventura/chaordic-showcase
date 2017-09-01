const PRODUCTS_URL = 'http://roberval.chaordicsystems.com/challenge/challenge.json';

const main = () => {
  const getJSONP = (url, callback) => {
    const script = document.createElement('script');
    const head = document.getElementsByTagName('head')[0] || document.documentElement;

    window.X = (data) => {
      head.removeChild(script);
      if (callback) callback(data);
    };

    script.src = url;
    head.appendChild(script);
  };

  const renderProducts = () => {

  };

  const getProductList = () => {
    getJSONP(PRODUCTS_URL, (data) => {
      renderProducts(data);
      console.log(data);
    });
  };

  const init = () => {
    getProductList();
  };

  init();
};

main();
