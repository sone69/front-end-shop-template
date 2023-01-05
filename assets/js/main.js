import { basketContainer, eraseBasket, createBasket } from './basket.js';

const cartCounterLabel = document.querySelector('#cart-counter-label');
const contentContainer = document.querySelector('#content-container');
const basketCartBtn = document.querySelector('.navbar-shop');

let cartCounter = 0;
let productsInBasketArr = null;
let cartPrice = 0;
let restoreHTML = null;

const cartCounterLabelPrint = (cartCounter) => {
  if (cartCounter > 0) cartCounterLabel.innerHTML = `${cartCounter}`;
  cartCounterLabel.style.display = 'none';
};

const incrementCounter = () => {
  cartCounterLabel.innerHTML = `${++cartCounter}`;
  if (cartCounter === 1) cartCounterLabel.style.display = 'block';
  console.log(cartCounter);
};

const getMockData = (t) => +t.parentElement.previousElementSibling.innerHTML.replace(/^\$(\d+)\s\D+(\d+).*$/, '$1.$2');

const getPrice = (t, price) => Math.round((price + getMockData(t)) * 100) / 100;

const getProductName = (t) => t.parentElement.parentElement.querySelector('.item-title').innerHTML;

const disableControls = (t, fn) => {
  t.disabled = true;
  contentContainer.removeEventListener('click', fn);
};

const enableControls = (t, fn) => {
  t.disabled = false;
  contentContainer.addEventListener('click', fn);
};

const writeProductToBasket = (t, arr) => {
  let item = null;
  let product = {
    productName: getProductName(t),
    productCode: getProductName(t),
    price: getMockData(t),
    count: 1,
    sum: getMockData(t),
  };
  if (arr !== null) {
    let i = 0;
    while (item === null && i < arr.length) {
      arr[i].productCode === getProductName(t) ? (item = i) : i++;
    }
    if (item === null) arr.push(product);
    else {
      arr[item].count++;
      arr[item].sum = Math.round((arr[item].sum + arr[item].price) * 100) / 100;
    }
  } else arr = [product];
  return arr;
};

const btnClickHandler = (e) => {
  const target = e.target;
  const interval = 1000;

  if (target && target.matches('.item-actions__cart')) {
    if (basketContainer !== null) eraseBasket();

    incrementCounter();

    productsInBasketArr = writeProductToBasket(target, productsInBasketArr);

    cartPrice = getPrice(target, cartPrice);

    restoreHTML = target.innerHTML;

    target.innerHTML = `Added ${cartPrice.toFixed(2)} $`;

    disableControls(target, btnClickHandler);

    setTimeout(() => {
      target.innerHTML = restoreHTML;
      enableControls(target, btnClickHandler);
    }, interval);
  }
};

const basketBtnHandler = (e) => {
  const target = e.target;

  if (target) {
    eraseBasket();
    if (!target.classList.contains('basket__btn-next')) {
      if (target.classList.contains('basket__btn-order')) {
        receiveOrder();
      }
      cartPrice = 0;
      productsInBasketArr = null;
      cartCounter = 0;
      cartCounterLabelPrint(cartCounter);
    }
  }
};

const createBasketWork = (c, pArr) => {
  createBasket(c, pArr);
  const basketBtn = document.querySelector('#btn-container');
  basketBtn.addEventListener('click', basketBtnHandler);
  basketContainer.addEventListener('click', delProductHandler);
};

const delProductHandler = (e) => {
  const target = e.target;
  if (target && target.matches('.basket__item-del')) {
    let b = true;
    let i = 0;

    while (b && i < productsInBasketArr.length) {
      if (productsInBasketArr[i].productCode === target.parentElement.dataset.code) {
        cartPrice -= productsInBasketArr[i].sum;
        cartCounter -= productsInBasketArr[i].count;
        productsInBasketArr.splice(i, 1);
        b = false;
      } else i++;
    }
    eraseBasket();
    createBasketWork(cartCounter, productsInBasketArr);
    cartCounterLabelPrint(cartCounter);
  }
};

const basketClickHandler = (e) => {
  const target = e.target;
  if (target) {
    createBasketWork(cartCounter, productsInBasketArr);
  }
};

export const shopInit = () => {
  contentContainer.addEventListener('click', btnClickHandler);
  basketCartBtn.addEventListener('click', basketClickHandler);
};
shopInit();
