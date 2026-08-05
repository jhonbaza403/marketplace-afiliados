<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Market Express - El Marketplace Global</title>
    <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased">

    <!-- BARRA SUPERIOR MULTI-IDIOMA Y MONEDA -->
    <header class="bg-slate-900 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
            <div class="flex items-center gap-4">
                <span class="flex items-center gap-1 font-semibold text-emerald-400">
                    <i class="fa-solid fa-earth-americas"></i> Cobertura Mundial
                </span>
                <span class="hidden md:inline text-slate-400">|</span>
                <span class="hidden md:inline text-slate-300">Envíos globales y enlaces oficiales verificados</span>
            </div>
            <div class="flex items-center gap-3">
                <!-- Selector de Idioma -->
                <div class="flex items-center bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
                    <i class="fa-solid fa-globe text-emerald-400 mr-2"></i>
                    <select id="langSelect" onchange="changeLanguage()" class="bg-transparent text-white focus:outline-none cursor-pointer">
                        <option value="es" class="bg-slate-800">Español</option>
                        <option value="en" class="bg-slate-800">English</option>
                        <option value="pt" class="bg-slate-800">Português</option>
                        <option value="fr" class="bg-slate-800">Français</option>
                    </select>
                </div>
            </div>
        </div>
    </header>

    <!-- NAVEGACIÓN PRINCIPAL -->
    <nav class="bg-white border-b border-slate-200 sticky top-[33px] z-40 shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <span class="bg-emerald-600 text-white font-black text-xl px-3 py-1.5 rounded-xl tracking-tight">GM</span>
                <span class="font-black text-xl tracking-tight text-slate-900 hidden sm:inline">Global Market</span>
            </div>

            <!-- Buscador Global -->
            <div class="flex-1 max-w-xl relative">
                <input type="text" id="searchInput" onkeyup="filterProducts()" placeholder="Buscar productos en Amazon, Shein, AliExpress, Alibaba..." class="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition">
                <i class="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-slate-400"></i>
            </div>

            <div class="flex items-center gap-3">
                <a href="#contacto" class="hidden sm:inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl transition">
                    Soporte
                </a>
            </div>
        </div>
    </nav>

    <!-- SECCIÓN HERO / DESTACADA -->
    <section class="max-w-7xl mx-auto px-4 py-8">
        <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-8 md:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div class="max-w-xl">
                <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Aliado Oficial Global
                </span>
                <h1 class="text-3xl md:text-5xl font-black mt-3 leading-tight">Las mejores ofertas del planeta a un solo clic</h1>
                <p class="text-slate-300 text-sm md:text-base mt-3">Acceso directo y seguro a los gigantes del comercio electrónico mundial con optimización de precios en tiempo real.</p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <a href="#productos" class="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold px-6 py-3.5 rounded-2xl text-center shadow-lg transition">
                    Ver Catálogo Global 🚀
                </a>
            </div>
        </div>
    </section>

    <!-- CATÁLOGO DE PRODUCTOS / AFILIADOS -->
    <main id="productos" class="max-w-7xl mx-auto px-4 py-8">
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-black text-slate-900">Plataformas y Ofertas Destacadas</h2>
            <span class="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1 rounded-full">Actualizado 2026</span>
        </div>

        <div id="productGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <!-- TARJETA 1: AMAZON -->
            <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 rounded-2xl bg-slate-100 overflow-hidden mb-4 flex items-center justify-center">
                        <span class="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow">Amazon Partner</span>
                        <i class="fa-brands fa-amazon text-6xl text-slate-700 group-hover:scale-110 transition duration-300"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Tecnología & Hogar</span>
                    <h3 class="font-black text-lg text-slate-900 mt-1">Amazon Global Store</h3>
                    <p class="text-xs text-slate-500 mt-1">Compra internacional asegurada con envíos globales rápidos y garantías de fabricante.</p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">Enlace Oficial</span>
                    <a href="https://amzn.to/4bJJq22" target="_blank" rel="noopener noreferrer" class="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow">
                        Comprar Ahora →
                    </a>
                </div>
            </div>

            <!-- TARJETA 2: SHEIN -->
            <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 rounded-2xl bg-slate-100 overflow-hidden mb-4 flex items-center justify-center">
                        <span class="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow">Shein Oficial</span>
                        <i class="fa-solid fa-shirt text-6xl text-slate-700 group-hover:scale-110 transition duration-300"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-rose-600">Moda & Tendencias</span>
                    <h3 class="font-black text-lg text-slate-900 mt-1">Shein Global Fashion</h3>
                    <p class="text-xs text-slate-500 mt-1">Las últimas tendencias en moda, ropa y accesorios con descuentos exclusivos para todo el mundo.</p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">Enlace Oficial</span>
                    <a href="https://onelink.shein.com/44/5wyleaujbj2iI" target="_blank" rel="noopener noreferrer" class="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow">
                        Ver Colección →
                    </a>
                </div>
            </div>

            <!-- TARJETA 3: ALIEXPRESS -->
            <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 rounded-2xl bg-slate-100 overflow-hidden mb-4 flex items-center justify-center">
                        <span class="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow">AliExpress Deal</span>
                        <i class="fa-solid fa-bag-shopping text-6xl text-slate-700 group-hover:scale-110 transition duration-300"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-red-600">Gadgets & Ofertas</span>
                    <h3 class="font-black text-lg text-slate-900 mt-1">AliExpress Direct</h3>
                    <p class="text-xs text-slate-500 mt-1">Productos innovadores, electrónica y accesorios con envíos directos a cualquier país.</p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">Enlace Oficial</span>
                    <a href="https://s.click.aliexpress.com/e/_c33p0iw" target="_blank" rel="noopener noreferrer" class="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow">
                        Aprovechar Oferta →
                    </a>
                </div>
            </div>

            <!-- TARJETA 4: ALIBABA -->
            <div class="bg-white border border-slate-200/80 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 rounded-2xl bg-slate-100 overflow-hidden mb-4 flex items-center justify-center">
                        <span class="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow">Alibaba Mayor</span>
                        <i class="fa-solid fa-boxes-stacked text-6xl text-slate-700 group-hover:scale-110 transition duration-300"></i>
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-orange-600">Al Mayor B2B</span>
                    <h3 class="font-black text-lg text-slate-900 mt-1">Alibaba Wholesale</h3>
                    <p class="text-xs text-slate-500 mt-1">Conecta directamente con fabricantes globales para compras al por mayor y emprendimientos.</p>
                </div>
                <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span class="text-sm font-black text-slate-900">Enlace Oficial</span>
                    <a href="https://offer.alibaba.com/cps/t9vapivb?" target="_blank" rel="noopener noreferrer" class="bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow">
                        Cotizar Mayorista →
                    </a>
                </div>
            </div>

        </div>
    </main>

    <!-- PIE DE PÁGINA -->
    <footer id="contacto" class="bg-white border-t border-slate-200 mt-16 py-8 px-4 text-center text-xs text-slate-500">
        <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; 2026 Global Market Express. Todos los derechos reservados.</p>
            <div class="flex gap-4">
                <span class="hover:text-slate-800 transition cursor-pointer">Términos de Servicio</span>
                <span class="hover:text-slate-800 transition cursor-pointer">Privacidad Global</span>
            </div>
        </div>
    </footer>

    <!-- SCRIPT DE TRADUCCIÓN BÁSICA Y FILTRADO -->
    <script>
        function filterProducts() {
            let input = document.getElementById('searchInput').value.toLowerCase();
            let cards = document.querySelectorAll('#productGrid > div');
            
            cards.forEach(card => {
                let text = card.innerText.toLowerCase();
                if(text.includes(input)) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        }

        const translations = {
            es: {
                subtitle: "Cobertura Mundial",
                bannerTitle: "Las mejores ofertas del planeta a un solo clic",
                bannerDesc: "Acceso directo y seguro a los gigantes del comercio electrónico mundial con optimización de precios en tiempo real.",
                catalogTitle: "Plataformas y Ofertas Destacadas",
                buyBtn: "Comprar Ahora →",
                viewBtn: "Ver Colección →",
                dealBtn: "Aprovechar Oferta →",
                quoteBtn: "Cotizar Mayorista →"
            },
            en: {
                subtitle: "Worldwide Coverage",
                bannerTitle: "The best deals on the planet with a single click",
                bannerDesc: "Direct and secure access to global e-commerce giants with real-time price optimization.",
                catalogTitle: "Featured Platforms & Deals",
                buyBtn: "Buy Now →",
                viewBtn: "View Collection →",
                dealBtn: "Get Deal →",
                quoteBtn: "Wholesale Quote →"
            },
            pt: {
                subtitle: "Cobertura Mundial",
                bannerTitle: "As melhores ofertas do planeta a um clique",
                bannerDesc: "Acesso direto e seguro aos gigantes do e-commerce global com otimização de preços em tempo real.",
                catalogTitle: "Plataformas e Ofertas em Destaque",
                buyBtn: "Comprar Agora →",
                viewBtn: "Ver Coleção →",
                dealBtn: "Aproveitar Oferta →",
                quoteBtn: "Cotação Atacado →"
            },
            fr: {
                subtitle: "Couverture Mondiale",
                bannerTitle: "Les meilleures offres de la planète en un seul clic",
                bannerDesc: "Accès direct et sécurisé aux géants du e-commerce mondial avec optimisation des prix en temps réel.",
                catalogTitle: "Plateformes et Offres en Vedette",
                buyBtn: "Acheter →",
                viewBtn: "Voir Collection →",
                dealBtn: "Profiter →",
                quoteBtn: "Devis Gros →"
            }
        };

        function changeLanguage() {
            const lang = document.getElementById('langSelect').value;
            const t = translations[lang];
            if (!t) return;
            
            // Text updates can be expanded according to elements
        }
    </script>
</body>
</html>
