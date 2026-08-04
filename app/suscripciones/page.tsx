export default function SubscriptionsPage() {
  const plans = [
    {
      name: 'Plan Gratis',
      price: '$0',
      period: 'para siempre',
      description: 'Ideal para comenzar a publicar ofertas básicas y explorar el marketplace.',
      features: [
        'Hasta 5 productos activos',
        'Contacto directo por WhatsApp',
        'Comisión estándar por venta (8%)',
        'Soporte comunitario'
      ],
      cta: 'Plan Actual',
      highlighted: false,
      paypalUrl: null,
    },
    {
      name: 'Plan Premium',
      price: '$19',
      period: 'mes',
      description: 'Diseñado para vendedores activos que buscan mayor visibilidad y menores comisiones.',
      features: [
        'Productos ilimitados en catálogo',
        'Vitrina de tienda personalizable',
        'Comisión reducida por venta (4%)',
        'Prioridad en el buscador',
        'Soporte prioritario'
      ],
      cta: 'Elegir Premium ($19/mes)',
      highlighted: true,
      // Enlace de pago directo a PayPal (se puede usar un enlace "me" de PayPal o botón de compra)
      paypalUrl: 'https://www.paypal.com/ncp/payment?hosted_button_id=TU_BUTTON_ID_PREMIUM', 
    },
    {
      name: 'Plan Empresa',
      price: '$49',
      period: 'mes',
      description: 'Solución corporativa para grandes comercios, ofertas al mayor y empleos.',
      features: [
        'Publicación masiva de productos y empleo',
        'Verificación comercial prioritaria (KYC)',
        'Comisión mínima por venta (2%)',
        'Acceso a herramientas de analítica avanzada',
        'Gerente de cuenta dedicado'
      ],
      cta: 'Elegir Empresa ($49/mes)',
      highlighted: false,
      paypalUrl: 'https://www.paypal.com/ncp/payment?hosted_button_id=TU_BUTTON_ID_EMPRESA',
    },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Modelo de Negocio & Monetización
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 tracking-tight mt-2">
            💎 Planes y Suscripciones Credi Marketplace
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu crecimiento comercial y reduce tus comisiones por transacción. Los pagos se procesan de forma segura a través de PayPal (<span className="font-semibold text-indigo-600">bazwjhon@gmail.com</span>).
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-2xl p-8 flex flex-col justify-between border transition-all ${
                plan.highlighted 
                  ? 'border-indigo-600 shadow-xl ring-2 ring-indigo-600/20 relative' 
                  : 'border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Más Popular
                </span>
              )}

              <div>
                <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                
                <div className="my-6 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-gray-950">{plan.price}</span>
                  <span className="text-gray-500 text-sm">/ {plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-indigo-600 font-bold">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {plan.paypalUrl ? (
                <a
                  href={plan.paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-semibold text-sm text-center transition-colors block ${
                    plan.highlighted 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  {plan.cta} 💳
                </a>
              ) : (
                <button 
                  disabled
                  className="w-full py-3 rounded-xl font-semibold text-sm bg-gray-100 text-gray-400 cursor-not-allowed"
                >
                  {plan.cta}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
