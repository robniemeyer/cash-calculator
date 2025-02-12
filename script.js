document.addEventListener('DOMContentLoaded', function() {
    const fields = ['venda', 'troco-final', 'cartao', 'entrega', 'despesa', 'fatura-assinada', 'voucher', 'troco-inicial', 'percentage'];
    const vendaInput = document.getElementById('venda');
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
        let venda = parseBRL(vendaInput.value);
        let subtotal = 0;

        // Sum only the fields in the second section for the subtotal
        const detailsFields = ['troco-final', 'cartao', 'entrega', 'despesa', 'fatura-assinada', 'voucher'];
        detailsFields.forEach(field => {
            const input = document.getElementById(field);
            subtotal += parseBRL(input.value);
        });

        subtotalSpan.innerText = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Subtract the values of the other fields in the third section from the subtotal to calculate the total
        const resultsFields = ['troco-inicial', 'percentage'];
        let total = subtotal;
        resultsFields.forEach(field => {
            const input = document.getElementById(field);
            total -= parseBRL(input.value);
        });

        totalSpan.innerText = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Show the difference message with appropriate color
        if (total < venda) {
            differenceMessage.innerText = `Diferença negativa: ${(venda - total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            differenceMessage.classList.remove('text-green-500');
            differenceMessage.classList.add('text-red-500');
        } else {
            differenceMessage.innerText = `Diferença positiva: ${(total - venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            differenceMessage.classList.remove('text-red-500');
            differenceMessage.classList.add('text-green-500');
        }
    }

    function parseBRL(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[R$ \.]/g, '').replace(',', '.')) || 0;
    }
});
