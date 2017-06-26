function getPrice() {
  var priceElement = document.getElementsByClassName('MarketInfo_market-num_1lAXs')[0];
  if (!priceElement) { return 0; }
  var price = +priceElement.innerText.match(/[0-9\.]+/)[0];
  return price;
}

function getBalance() {
  var balanceElement = document.getElementsByClassName('BalanceInfo_term-description_1UHsH')[1];
  if (!balanceElement) { return 0; }
  var balance = +balanceElement.innerText;
  return balance;
}

function findOrCreateElement() {
  var headerSpan = document.getElementsByClassName('gdax-account-value');
  if (headerSpan.length) { return headerSpan[0]; }

  var headerUl = document.getElementsByClassName('MarketInfo_market-info_3lkUj')[0];

  var li = document.createElement('li');

  // create h4 element
  var h4 = document.createElement('h4');
  h4.classList.add('MarketInfo_market-stat_2xWig');

  var headerSpan = document.createElement('span')
  headerSpan.classList.add('MarketInfo_market-num_1lAXs');
  headerSpan.classList.add('gdax-account-value');

  var subSpan = document.createElement('span')
  subSpan.classList.add('MarketInfo_market-descr_2lp4B');
  subSpan.innerText = 'Total account value';

  h4.appendChild(headerSpan)
  h4.appendChild(subSpan)

  li.appendChild(h4);

  headerUl.appendChild(li);

  return headerSpan;
}

window.setInterval(function() {
  var newBalance = getPrice() * getBalance();
  if (newBalance > 0) {
    valueElement = findOrCreateElement();
    console.log('Setting new balance: ' + newBalance);
    valueElement.innerText = newBalance.toFixed(2) + " USD";
  }
}, 2000);

