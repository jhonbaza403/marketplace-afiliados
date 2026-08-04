{/* Botón para redirigir al enlace de afiliado o red social */}
{product.affiliate_link && (
  <a 
    href={product.affiliate_link}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-3 block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
  >
    🔗 Ver Oferta / Comprar
  </a>
)}
