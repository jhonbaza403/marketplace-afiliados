document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.btn-afiliado');
    botones.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = e.target.getAttribute('data-url');
            if (url && url !== 'TU_LINK_DE_AFILIADO_AQUI') {
                window.open(url, '_blank', 'noopener,noreferrer');
            } else {
                alert('Configura el enlace de afiliado en el HTML.');
            }
        });
    });
});
