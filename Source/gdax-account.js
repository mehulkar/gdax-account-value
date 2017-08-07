const accountMap = new Map();
accountMap.set('USD', {});
accountMap.set('ETH', {});
accountMap.set('BTC', {});

function updateTotal(total) {
  var header = document.querySelector('.MarketInfo_market-info_3lkUj');

  var totalValueSpan = header.querySelector('.usd-total-value .MarketInfo_market-num_1lAXs');

  if (!totalValueSpan) {
    var liTotal = document.createElement('li');
    liTotal.classList.add('usd-total-value');
    var subHeader = document.createElement('h4')
    subHeader.classList.add('MarketInfo_market-stat_2xWig');
    var totalValueSpan = document.createElement('span');
    var span2 = document.createElement('span');
    totalValueSpan.classList.add('MarketInfo_market-num_1lAXs');
    span2.classList.add('MarketInfo_market-descr_2lp4B');
    span2.innerText = 'Total Account Value';
    subHeader.appendChild(totalValueSpan);
    subHeader.appendChild(span2);
    liTotal.appendChild(subHeader);
    header.appendChild(liTotal);
  }

  totalValueSpan.innerText = `${total} USD`;
}

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

function updateAccountMap() {
  var parent = document.querySelector('.BalanceInfo_term-list_-3tTQ');

  if (!parent) { return accountMap; }

  parent.childNodes.forEach(function(li) {
    var walletBalanceSpan = li.childNodes[1].getElementsByTagName('span')[0];
    var usdValueSpan = li.getElementsByClassName('usd-balance')[0];

    var walletName = li.childNodes[0].innerText;
    var walletBalance = walletBalanceSpan.innerText;

    if (accountMap.has(walletName)) {
      var currentPrice = getWalletPrice();

      var accountValue;

      if (walletName === 'USD') {
        accountValue = walletBalance.replace(',', '')
      } else {
        accountValue = (walletBalance * currentPrice).toFixed(2);
      }

      accountMap.set(walletName, {
        name: walletName,
        balanceSpan: walletBalanceSpan,
        usdValueSpan: usdValueSpan,
        parentSpan: li,
        currentPrice: getWalletPrice(),
        balance: Number(walletBalance),
        accountValue: Number(accountValue),
      });
    } else {
      console.log('Unknown wallet: ' + walletName);
    }
  });

  return accountMap;
}

function updateUSDValueForWallet() {

  var accountMap = updateAccountMap();

  var currentWallet = getCurrentWallet();
  var walletInfo = accountMap.get(currentWallet);

  if (!walletInfo || !Object.keys(walletInfo).length) { return; }

  var usdValueSpan = walletInfo.usdValueSpan;
  if (!usdValueSpan) {
    usdValueSpan = document.createElement('span');
    usdValueSpan.classList.add('usd-balance');
    usdValueSpan.style.marginLeft = '5px';
    walletInfo.parentSpan.appendChild(usdValueSpan)
  }

  usdValueSpan.innerText = walletInfo.accountValue + ' USD';

  updateTotalValue(accountMap);
}

function updateTotalValue(accountMap) {
  var total = Array.from(accountMap.values())
                    .map(x => x.accountValue)
                    .filter(x => x)
                    .reduce((sum, x) => sum + x)
                    .toFixed(2);

  updateTotal(total);
}


window.setInterval(function() {
  updateUSDValueForWallet();
}, 2000);
