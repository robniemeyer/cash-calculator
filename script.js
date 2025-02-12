document.addEventListener('DOMContentLoaded', function() {
    const fields = ['troco-final', 'cartao', 'entrega', 'despesa', 'fatura-assinada', 'voucher'];
    const vendaInput = document.getElementById('venda');
    const subtotalSpan = document.getElementById('subtotal');
    const totalInput = document.getElementById('total');
    const differenceMessage = document.getElementById('difference-message');
    const grossProfitError = document.getElementById('venda-input-error');
    
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

        fields.forEach(field => {
            const input = document.getElementById(field);
            subtotal += parseBRL(input.value);
        });

        subtotalSpan.innerText = subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        let total = subtotal * 0.90;
        totalInput.value = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        if (total < venda) {
            grossProfitError.innerText = `Diferença negativa: ${(venda - total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            grossProfitError.classList.remove('hidden');
        } else {
            grossProfitError.innerText = `Diferença positiva: ${(total - venda).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            grossProfitError.classList.remove('hidden');
        }
    }

    function parseBRL(value) {
        if (!value) return 0;
        return parseFloat(value.replace(/[R$ \.]/g, '').replace(',', '.')) || 0;
    }
});
