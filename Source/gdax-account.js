function getWalletPrice() {
  var priceElement = document.getElementsByClassName('MarketInfo_market-num_1lAXs')[0];
  if (!priceElement) { return 0; }

  // parse just the number from the text (removing commas)
  var priceString = priceElement.innerText.match(/[0-9\.,]+/)[0].replace(',', '');

  // returna  number
  return Number(priceString);
}

function getCurrentWallet() {
  var wallets = Array.from(
    document.querySelectorAll('.BalanceInfo_term-name_1snxS')
  ).map(el => el.innerText);

  // First element is always USD, so use the second one
  // Should be BTC or ETH or LTC
  return wallets[1];
}

function getAccountMap() {
  map = new Map();
  map.set('USD', {});
  map.set('ETH', {});
  map.set('BTC', {});

  var parent = document.getElementsByClassName('BalanceInfo_term-list_-3tTQ')[0];
  if (!parent) { return map; }

  parent.childNodes.forEach(function(li) {
    var walletName = li.childNodes[0].innerText;
    var walletBalanceSpan = li.childNodes[1].getElementsByTagName('span')[0];
    var walletBalance = walletBalanceSpan.innerText;
    var usdValueSpan = li.getElementsByClassName('usd-balance')[0];
    if (map.has(walletName)) {
      map.set(walletName, {
        name: walletName,
        currentPrice: getWalletPrice(),
        balance: walletBalance,
        balanceSpan: walletBalanceSpan,
        usdValueSpan: usdValueSpan,
        parentSpan: li,
      });
    } else {
      console.log('Unknown wallet: ' + walletName);
    }
  });

  return map;
}

function updateUSDValueForWallet() {

  var accountMap = getAccountMap();

  var currentWallet = getCurrentWallet();
  var walletInfo = accountMap.get(currentWallet);

  if (!Object.keys(walletInfo).length) { return; }

  var accountValue = (walletInfo.balance * walletInfo.currentPrice).toFixed(2);

  var usdValueSpan = walletInfo.usdValueSpan;
  if (!usdValueSpan) {
    usdValueSpan = document.createElement('span');
    usdValueSpan.classList.add('usd-balance');
    usdValueSpan.style.marginLeft = '5px';
    walletInfo.parentSpan.appendChild(usdValueSpan)
  }

  usdValueSpan.innerText = accountValue + ' USD';
}


window.setInterval(function() {
  updateUSDValueForWallet();
}, 2000);
