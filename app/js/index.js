'use strict';

const PRODUCTS_URL = 'http://roberval.chaordicsystems.com/challenge/challenge.json';

const index = () => {
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

  const createProductHTML = (product) => {
    const oldPriceHTML = product.oldPrice ? `<p class="product-old-price">De: ${product.oldPrice}</p>` : '<p class="product-old-price">&nbsp;</p>';
    const html = `<a class="product" href="${product.detailUrl.replace('//', 'http://')}" target="_blank">
                    <img src="http:\\${product.imageName.replace('//', '')}" alt="" class="product-img">
                    <div class="product-description">
                      <p>
                      ${product.name}
                      </p>
                    </div>
                    ${oldPriceHTML}
                    <p class="product-new-price">
                      Por: <span class="product-new-price-big"><strong> ${product.price} </strong></span>
                      <br><strong> ${product.productInfo.paymentConditions.replace(/<\/?strong>/g, '')}</strong>
                      <br>sem juros
                    </p>
                </a>`;
    return html;
  };

  const renderProducts = (data) => {
    const referenceProduct = createProductHTML(data.data.reference.item);
    document.getElementById('reference').innerHTML = referenceProduct;

    let productsList = '';
    data.data.recommendation.forEach((item) => {
      productsList += createProductHTML(item);
    });
    document.getElementById('recomendation-products').innerHTML = productsList;
  };

  const croplines = () => {
    const containers = document.querySelectorAll('.product-description');
    Array.prototype.forEach.call(containers, (container) => {
      const p = container.querySelector('p');
      const divh = container.clientHeight;
      while (p.offsetHeight > divh) {
        p.textContent = p.textContent.replace(/\W*\s(\S)*$/, '...');
      }
    });
  };

  const getProductList = () => {
    getJSONP(PRODUCTS_URL, (data) => {
      renderProducts(data);
      croplines();
    });
  };

  const moveScroll = (elem, destiny, direction, callback) => {
    let left = elem.scrollLeft;

    const frame = () => {
      if (direction === 'left') {
        left -= 1;
      } else {
        left += 1;
      }
      elem.scrollLeft = left;

      if (left === destiny) {
        if (callback) {
          callback();
        }
        clearInterval(id);
      }
    };
    const id = setInterval(frame, 1);
  };

  const registerSlideEvents = () => {
    const leftButton = document.getElementsByClassName('navigate-left')[0];
    const rightButton = document.getElementsByClassName('navigate-right')[0];
    let canEnableRightButton = false;

    leftButton.addEventListener('click', () => {
      const productsDiv = document.getElementById('recomendation-products');
      if (canEnableRightButton) {
        rightButton.removeAttribute('disabled');
      }
      if (productsDiv.scrollLeft - 200 <= 0) {
        moveScroll(productsDiv, 0, 'left');
        // It reached the end so we disable the button
        leftButton.setAttribute('disabled', true);
      } else {
        moveScroll(productsDiv, productsDiv.scrollLeft - 200, 'left');
      }
    });

    rightButton.addEventListener('click', () => {
      const productsDiv = document.getElementById('recomendation-products');
      const productsDivScrollPosition = productsDiv.scrollLeft;
      if (productsDiv.scrollLeft === 0) {
        leftButton.removeAttribute('disabled');
      }
      moveScroll(productsDiv, productsDiv.scrollLeft + 200, 'right', () => {
        if (productsDiv.scrollLeft === productsDivScrollPosition ||
          productsDiv.offsetWidth + productsDiv.scrollLeft === productsDiv.scrollWidth) {
          // It reached the end so we disable the button
          rightButton.setAttribute('disabled', true);
          canEnableRightButton = true;
        }
      });
    });
  };

  const init = () => {
    getProductList();
    registerSlideEvents();
  };

  init();
};

index();
