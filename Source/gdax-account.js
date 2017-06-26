function getEthPrice() {
  var priceElement = document.getElementsByClassName('MarketInfo_market-num_1lAXs')[0];
  if (!priceElement) { return 0; }
  var price = +priceElement.innerText.match(/[0-9\.]+/)[0];
  return price;
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
        currentPrice: getEthPrice(),
        balance: walletBalance,
        balanceSpan: walletBalanceSpan,
        usdValueSpan: usdValueSpan,
        parentSpan: li,
      });
    } else {
      console.log('Unknown wallet: ' + walletName);
    }
  });

  window.accountMap = map;
  return map;
}

function updateUSDValueForETH() {

  var accountMap = getAccountMap();

  var ethInfo = accountMap.get('ETH');

  if (!Object.keys(ethInfo).length) { return; }

  var accountValue = (ethInfo.balance * ethInfo.currentPrice).toFixed(2);

  var usdValueSpan = ethInfo.usdValueSpan;
  if (!usdValueSpan) {
    usdValueSpan = document.createElement('span');
    usdValueSpan.classList.add('usd-balance');
    usdValueSpan.style.marginLeft = '5px';
    ethInfo.parentSpan.appendChild(usdValueSpan)
  }

  usdValueSpan.innerText = accountValue + ' USD';
}


window.setInterval(function() {
  updateUSDValueForETH();
}, 2000);
