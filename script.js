document.addEventListener('DOMContentLoaded', function() {
    const vendaInput = document.getElementById('venda');
    const subtotalSpan = document.getElementById('subtotal');
    const totalInput = document.getElementById('total');
    const differenceMessage = document.getElementById('difference-message');
    const vendaError = document.getElementById('venda-input-error');

    const detailsFields = ['troco-final', 'cartao', 'entrega', 'despesa', 'fatura-assinada', 'voucher'];

    detailsFields.forEach(field => {
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

        detailsFields.forEach(field => {
            const input = document.getElementById(field);
            subtotal += parseBRL(input.value);
        });

        subtotalSpan.innerText = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Maintain the current functionality for other fields
        const trocoInicial = subtotal * 0.10;
        const percentage = subtotal * 0.20;
        let total = subtotal;

        document.getElementById('troco-inicial').value = trocoInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        document.getElementById('percentage').value = percentage.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        totalInput.value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        if (total < venda) {
            differenceMessage.innerText = `Diferença negativa: ${(venda - total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            differenceMessage.classList.remove('hidden');
        } else {
            differenceMessage.innerText = `Diferença positiva: ${(total - venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            differenceMessage.classList.remove('hidden');
        }
    }

    function parseBRL(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[R$ \.]/g, '').replace(',', '.')) || 0;
    }
});
