'use strict';

(function () {
    const ASC_ORDER = 'asc';
    const DESC_ORDER = 'desc';
    let data = {};

    const TABLE_CONTAINER = document.getElementById('data_table');
    loadData().then(() => {
        showTable(TABLE_CONTAINER, createTable(getData()));
    });

    function loadData() {
        return new Promise((resolve) => {
	    const req = new XMLHttpRequest();
	    req.onload = () => {
	        data = JSON.parse(req.responseText);
	        resolve();
	    };
	    req.open('GET', './item');
	    req.send();
	});
    }

    function getData () {
        return data;
    }

    function calcAmount(item) {
        return item.price * item.count;
    }

    function getFieldsToShow() {
        return ['name', 'price', 'count', 'amount'];
    }

    function showTable (container, table) {
        container.firstChild ? container.replaceChild(table, container.firstChild) : container.appendChild(table);
        //TABLE_CONTAINER.querySelector("thead").onclick = sort;
    }

    function createTable (data) {
        const tableHeader = createHeader();
        const tableBody = createBody(data);
        const table = document.createElement('table');
        table.innerHTML = tableHeader + tableBody;
        table.querySelector("thead").onclick = sort;

        return table;
    }

    function createHeader () {
        const headerNames = getFieldsToShow();
        const headers = headerNames.map(name => `<th data-field="${name}">${name}</th>`);

        return `<thead><tr>${headers.join('')}</tr><thead>`;
    }

    function createBody(data) {
        const keys = getFieldsToShow();
        const rows = data.map(rowData => {
            const name = `<td>${rowData.name}</td>`;
            const price = `<td class="amount">${rowData.price}</td>`;
            const count = `<td class="amount">${rowData.count}</td>`;
            const amount = `<td class="amount">${rowData.count * rowData.price}</td>`;

            return `<tr id="${rowData.id}">${name + price + count + amount}</tr>`;
        });

        return '<tbody>' + rows.join('') + '</tbody>';
    }

    function getComparator(field) {
        switch (field) {
            case 'name': return (a, b) => a.name.localeCompare(b.name);
            case 'price':
            case 'count': return (a, b) => a[field] - b[field];
            case 'amount': return (a, b) => a.price * a.count - b.price * b.count;
        }
    }

    function sort(event) {
        const field = event.target.dataset.field;
        const order = event.target.dataset.order;
        const sortedData = getData().sort(getComparator(field));
        showTable(TABLE_CONTAINER, createTable(sortedData));
    }

})()
