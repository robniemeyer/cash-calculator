document.addEventListener('DOMContentLoaded', function() {
    const fields = ['venda', 'troco-final', 'cartao', 'entrega', 'despesa', 'fatura-assinada', 'voucher', 'troco-inicial', 'percentage', 'total'];
    const vendaInput = document.getElementById('venda');
    const subtotalInput = document.getElementById('subtotal');
    const totalInput = document.getElementById('total');
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

        fields.slice(1, 7).forEach(field => { // Sum only the second section fields for the subtotal
            const input = document.getElementById(field);
            subtotal += parseBRL(input.value);
        });

        subtotalInput.value = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        // Calculate the total
        let total = parseBRL(document.getElementById('total').value);

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
