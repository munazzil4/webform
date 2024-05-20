// app.js

document.addEventListener('DOMContentLoaded', () => {
    // Open IndexedDB
    let db;
    const request = indexedDB.open('ordersDB', 1);

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const objectStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('customerName', 'customerName', { unique: false });
        objectStore.createIndex('orderValue', 'orderValue', { unique: false });
        objectStore.createIndex('orderDate', 'orderDate', { unique: false });
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        displayData();
    };

    request.onerror = (event) => {
        console.error('Database error:', event.target.errorCode);
    };

    // Handle form submission
    document.getElementById('orderForm').addEventListener('submit', (event) => {
        event.preventDefault();

        const newOrder = {
            customerName: event.target.customerName.value,
            orderValue: parseFloat(event.target.orderValue.value),
            orderDate: event.target.orderDate.value
        };

        const transaction = db.transaction(['orders'], 'readwrite');
        const objectStore = transaction.objectStore('orders');
        const request = objectStore.add(newOrder);

        request.onsuccess = () => {
            displayData();
        };

        request.onerror = (event) => {
            console.error('Error adding new order:', event.target.errorCode);
        };

        // Reset the form
        event.target.reset();
    });

    // Display data from IndexedDB
    function displayData() {
        const transaction = db.transaction(['orders'], 'readonly');
        const objectStore = transaction.objectStore('orders');
        const request = objectStore.getAll();

        request.onsuccess = (event) => {
            const orders = event.target.result;
            const tableBody = document.getElementById('ordersTableBody');
            tableBody.innerHTML = '';

            orders.forEach((order) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.customerName}</td>
                    <td>${order.orderValue}</td>
                    <td>${order.orderDate}</td>
                `;
                tableBody.appendChild(row);
            });
        };
    }
});
