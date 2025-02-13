document.addEventListener('DOMContentLoaded', function() {
    const fields = ['sales', 'final-change', 'card', 'delivery', 'expense', 'signed-bill', 'voucher', 'initial-change', 'percentage'];
    const salesInput = document.getElementById('sales');
    const subtotalSpan = document.getElementById('subtotal');
    const totalSpan = document.getElementById('total');
    const differenceMessage = document.getElementById('difference-message');

    fields.forEach(field => {
        const input = document.getElementById(field);
        input.addEventListener('input', formatBRL);
        input.addEventListener('change', calculateTotals);
    });

    function formatBRL(event) {
        let input = event.target;
        let value = input.value.replace(/[^\d]/g, '');  // Remove everything except digits

        if (!value) {
            input.value = '';
            return;
        }

        value = (parseInt(value, 10) / 100).toFixed(2);
        value = value.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        input.value = `R$ ${value}`;

        calculateTotals();
    }

    function calculateTotals() {
        let sales = parseBRL(salesInput.value);
        let subtotal = 0;

        // Sum only the fields in the second section for the subtotal
        const detailsFields = ['final-change', 'card', 'delivery', 'expense', 'signed-bill', 'voucher'];
        detailsFields.forEach(field => {
            const input = document.getElementById(field);
            subtotal += parseBRL(input.value);
        });

        subtotalSpan.innerText = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Subtract the values of the other fields in the third section from the subtotal to calculate the total
        const resultsFields = ['initial-change', 'percentage'];
        let total = subtotal;
        resultsFields.forEach(field => {
            const input = document.getElementById(field);
            total -= parseBRL(input.value);
        });

        totalSpan.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Show the difference message with appropriate color and sign
        let difference = total - sales;
        differenceMessage.innerText = `Diferença: R$ ${difference < 0 ? '-' : ''}${Math.abs(difference).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (difference < 0) {
            differenceMessage.classList.remove('text-green-500');
            differenceMessage.classList.add('text-red-500');
        } else {
            differenceMessage.classList.remove('text-red-500');
            differenceMessage.classList.add('text-green-500');
        }
    }

    function parseBRL(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[R$ \.]/g, '').replace(',', '.')) || 0;
    }

    // Function to clear inputs in a section
    window.clearInputs = function(sectionId) {
        const section = document.getElementById(sectionId);
        const inputs = section.getElementsByTagName('input');
        for (let input of inputs) {
            input.value = '';
        }
        calculateTotals();
    };
});
