// Screen for buying and selling goods
"use strict";
// globals: document, window, setTimeout, setInterval, GHOST, Android, navigator

var SC = window.SC || {}

SC.shopTable = function (aRows, aBuyCallback, aSellCallback) {
    // render one goods table
    var table, tr, td, btn, r, buyPrice, sellPrice,
        amount = {}, buy = {}, sell = {}, first;

    // table
    table = document.createElement('table');
    table.style.borderTop = '2px solid black';
    table.style.width = '100%';
    table.style.width = '100%';
    for (r = 0; r < aRows.length; r++) {
        // row
        tr = document.createElement('tr');
        tr.style.borderBottom = '1px dotted black';
        table.appendChild(tr);

        buyPrice = parseInt(SC.goods[aRows[r].id].price, 10);
        sellPrice = Math.ceil(buyPrice / 2);

        // tile
        td = document.createElement('td');
        SC.standAloneTile(td, [aRows[r].tile]);
        tr.appendChild(td);

        // description
        td = document.createElement('td');
        td.style.width = '100%';
        td.style.verticalAlign = 'top';
        td.textContent = aRows[r].description;
        tr.appendChild(td);

        // player's amount
        td = document.createElement('td');
        td.textContent = SC.inventory.amount(aRows[r].id) + 'x';
        tr.appendChild(td);
        amount[aRows[r].id] = td;

        // buy button
        td = document.createElement('td');
        btn = document.createElement('button');
        btn.innerHTML = 'Buy\n' + buyPrice + ',-';
        btn.onclick = aBuyCallback;
        btn.data = aRows[r];
        td.appendChild(btn);
        tr.appendChild(td);
        buy[aRows[r].id] = btn;
        if (r === 0) {
            first = btn;
        }

        // sell button
        td = document.createElement('td');
        btn = document.createElement('button');
        btn.textContent = 'Sell\n' + sellPrice + ',-';
        btn.onclick = aSellCallback;
        btn.data = aRows[r];
        td.appendChild(btn);
        tr.appendChild(td);
        sell[aRows[r].id] = btn;

        // disable buttons
        buy[aRows[r].id].disabled = SC.wallet.gold < SC.goods[aRows[r].id].price;
        sell[aRows[r].id].disabled = SC.inventory.amount(aRows[r].id) <= 0;
    }

    return { html: table, amount: amount, buy: buy, sell: sell, first: first };
};

SC.shopVisible = false;

SC.shop = function (aTitle, aBuyGoods, aSellGoods) {
    // create main part
    if (SC.shopVisible) {
        console.log('Another shop still visible');
        return;
    }
    SC.shopVisible = true;
    SC.player.lock = true;

    SC.type.isArrayOfString(aSellGoods, "aSellGoods");
    SC.type.isArrayOfString(aBuyGoods, "aBuyGoods");
    var table, g, rows, row, i, n;

    // check valid goods names
    for (i = 0; i < aBuyGoods; i++) {
        if (!SC.goods.hasOwnProperty(aBuyGoods[i])) {
            console.error('Invalid shop goods name:' + aBuyGoods[i]);
        }
    }
    for (i = 0; i < aSellGoods; i++) {
        if (!SC.goods.hasOwnProperty(aSellGoods[i])) {
            console.error('Invalid shop goods name:' + aSellGoods[i]);
        }
    }

    function updateTitle(aTile) {
        // update price and availability of buttons
        if (aTile) {
            table.amount[aTile].textContent = SC.inventory.amount(aTile) + 'x';
        }
        // disable buttons
        var k;
        if (table) {
            for (k in table.amount) {
                if (table.amount.hasOwnProperty(k)) {
                    table.buy[k].disabled = SC.wallet.gold < SC.goods[k].price;
                    table.sell[k].disabled = SC.inventory.amount(k) <= 0;
                }
            }
        }
    }
    updateTitle();

    // converts goods into rows
    rows = [];
    for (g in SC.goods) {
        if (SC.goods.hasOwnProperty(g)) {
            if (!g.match(/^tag:/) && ((aSellGoods.indexOf(g) >= 0) || (aBuyGoods.indexOf(g) >= 0))) {
                row = SC.goods[g];
                row.id = g;
                row.tile = SC.goods[g].tile || g;
                rows.push(row);
            }
        }
    }

    function onBuy(event) {
        //console.log('buy', event.target.data);
        SC.cmd.run('#buy ' + event.target.data.tile + ' 1 ' + event.target.data.price);
        updateTitle(event.target.data.tile);
    }

    function onSell(event) {
        //console.log('sell', event.target.data);
        SC.cmd.run('#sell ' + event.target.data.tile + ' 1 ' + Math.ceil(event.target.data.price / 2));
        updateTitle(event.target.data.tile);
    }

    // table
    table = SC.shopTable(rows, onBuy, onSell);

    function onClose() {
        console.log('Closing shop');
        SC.shopVisible = false;
        SC.player.lock = false;
    }

    // show newspaper
    n = SC.newspaperFromData(aTitle, table.html, onClose);

    // table cannot shrink so make the whole newspaper scroll
    n.main.style.display = 'block';
    n.main.style.overflowY = 'scroll';

    // some keyboard hacks (perhaps #hk would suffice)
    SC.cmd.hideKeyboard();
};

