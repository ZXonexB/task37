document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const errorMessages = document.getElementById('errorMessages');
    const dataTable = document.getElementById('dataTable');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');
    const itemsPerPageSelect = document.getElementById('itemsPerPage');

    let currentPage = 1;
    let totalPages = 1;
    let itemsPerPage = parseInt(itemsPerPageSelect.value);

    const constraints = {
        name: {
            presence: { allowEmpty: false, message: "^Name is required" },
            length: { minimum: 3, message: "^Name must be at least 3 characters long" }
        },
        email: {
            presence: { allowEmpty: false, message: "^Email is required" },
            email: { message: "^Please enter a valid email address" }
        },
        message: {
            presence: { allowEmpty: false, message: "^Message is required" }
        }
    };

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const formValues = {
            name: form.elements.name.value,
            email: form.elements.email.value,
            message: form.elements.message.value
        };

        const errors = validate(formValues, constraints);

        if (errors) {
            errorMessages.innerHTML = Object.values(errors).map(error => `<p>${error[0]}</p>`).join('');
        } else {
            errorMessages.innerHTML = '';
            submitForm();
        }
    });

    function submitForm() {
        const formData = new FormData(form);
        fetch('process.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            console.log(result);
            form.reset();
            fetchData(1);
        })
        .catch(error => console.error('Error:', error));
    }

    function fetchData(page) {
        fetch(`display.php?page=${page}&limit=${itemsPerPage}`)
            .then(response => response.json())
            .then(result => {
                updateTable(result.data);
                updatePagination(result.currentPage, Math.ceil(result.totalRecords / result.itemsPerPage));
            })
            .catch(error => console.error('Error:', error));
    }

    function updateTable(data) {
        let tableHTML = '<table><tr><th>Name</th><th>Email</th><th>Message</th></tr>';
        data.forEach(row => {
            tableHTML += `<tr><td>${row.name}</td><td>${row.email}</td><td>${row.message}</td></tr>`;
        });
        tableHTML += '</table>';
        dataTable.innerHTML = tableHTML;
    }

    function updatePagination(current, total) {
        currentPage = current;
        totalPages = total;
        pageInfo.textContent = `Page ${current} of ${total}`;
        prevPageBtn.disabled = current === 1;
        nextPageBtn.disabled = current === total;
    }

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            fetchData(currentPage - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
            fetchData(currentPage + 1);
        }
    });

    itemsPerPageSelect.addEventListener('change', () => {
        itemsPerPage = parseInt(itemsPerPageSelect.value);
        fetchData(1);
    });

    fetchData(1);
});