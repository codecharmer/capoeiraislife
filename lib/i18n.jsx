'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

export const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'pt', label: 'Português' },
];

export const toastStrings = {
  en: { added: (n) => `${n} added to bag` },
  es: { added: (n) => `${n} añadido a la bolsa` },
  pt: { added: (n) => `${n} adicionado à sacola` },
};

export const dict = {
  en: {
    nav: { shop: 'Shop', collections: 'Collections', best: 'Best Sellers', about: 'About', instagram: 'Instagram' },
    announce: ['Free worldwide shipping over $75', 'Join the Roda — 10% off your first order', 'New drop live now — limited quantities'],
    hero: { eyebrow: 'Afro-Brazilian Movement · Rooted in Bahia', sub: 'Wear the culture. Live the movement.', cta1: 'Shop Collection', cta2: 'Best Sellers' },
    social: { heading: 'Loved by thousands of capoeiristas worldwide', sub: 'Join a global movement across 40+ countries' },
    collections: { eyebrow: 'Shop by category', title: 'Featured Collections', viewAll: 'View all' },
    cat: {
      't-shirts': { name: 'T-Shirts', tagline: 'Everyday movement' },
      'hoodies': { name: 'Hoodies', tagline: 'Warmth & weight' },
      'tank-tops': { name: 'Tank Tops', tagline: 'Train freely' },
      'hats': { name: 'Hats', tagline: 'Top it off' },
      'accessories': { name: 'Accessories', tagline: 'Carry it with you' },
    },
    best: { eyebrow: 'Most wanted', title: 'Best Sellers' },
    lifestyle: { eyebrow: 'More than a martial art', titleA: 'More than', titleB: 'a martial art.', lines: ['Capoeira is music.', 'Capoeira is history.', 'Capoeira is resistance.', 'Capoeira is family.'], closing: 'Capoeira is Life.', cta: 'Our Story' },
    insta: { eyebrow: '@capoeira.is.life', title: 'Follow the Movement', follow: 'Follow @capoeira.is.life' },
    tst: { eyebrow: 'Global family', title: 'What They Say' },
    reviews: {
      t1: "The quality is unreal. I train in it, live in it, and everyone in my group asked where I got it. This is the culture, done right.",
      t2: "Finally apparel that feels like us. The hoodie is heavy, warm and beautiful. Axé to whoever designed this.",
      t3: "Bought the tee off an Instagram reel. Shipping was fast and the print still looks brand new after 20 washes.",
      t4: "More than clothing — it feels like belonging to something bigger. The fit is perfect and the fabric is premium.",
      t5: "I get compliments every single time. It moves with me in the roda and looks clean on the street.",
      t6: "This brand gets it. Capoeira is life, and now I can wear it. Instant fan.",
    },
    faq: { eyebrow: 'Good to know', title: 'FAQ' },
    faqs: [
      { q: 'How long does shipping take?', a: "Orders are made-to-order and ship worldwide within 5–8 business days. You'll receive tracking the moment it leaves our facility. Free shipping on orders over $75." },
      { q: 'What is your return policy?', a: "We offer 30-day hassle-free returns on unworn, unwashed items. Wrong size? We'll swap it, no drama." },
      { q: 'How do I choose the right size?', a: 'Every product page includes a detailed size guide. Our tees run true to size; hoodies are relaxed, so size down for a slimmer look.' },
      { q: 'What materials do you use?', a: 'Premium ring-spun combed cotton for tees and heavyweight brushed fleece for hoodies. Everything is chosen to move with you and last.' },
      { q: 'Is the print quality durable?', a: 'Yes. We use high-density screen and DTG printing designed to resist cracking and fading wash after wash.' },
      { q: 'How long is production time?', a: 'Because each piece is made to order to reduce waste, production takes 2–4 business days before shipping.' },
    ],
    news: { title: 'Join the Roda', sub: 'Exclusive releases, early drops, and member-only discounts.', placeholder: 'Enter your email', button: 'Sign Up', disclaimer: 'No spam. Unsubscribe anytime.', toastTitle: 'Welcome to the Roda!', toastDesc: 'Check your inbox for your 10% code.' },
    footer: { tagline: 'Wear the culture. Live the movement. Premium apparel for capoeiristas worldwide.', shop: 'Shop', company: 'Company', support: 'Support', rights: 'All rights reserved.', privacy: 'Privacy', terms: 'Terms', about: 'About', bestSellers: 'Best Sellers', contact: 'Contact', shipping: 'Shipping', returns: 'Returns', sizing: 'Sizing', faq: 'FAQ' },
    cart: { title: 'Your Bag', empty: 'Your bag is empty.', continue: 'Continue Shopping', awayPre: 'You are', awayPost: 'away from free shipping', unlocked: 'You have unlocked free shipping!', alsoLike: 'You may also like', add: 'Add', subtotal: 'Subtotal', checkout: 'Checkout', taxes: 'Shipping & taxes calculated at checkout' },
    search: { placeholder: 'Search products...', popular: 'Popular', no: 'No results for' },
    stickyShop: 'Shop the Collection',
    badges: { 'Best Seller': 'Best Seller', 'New Arrival': 'New Arrival', 'Limited Drop': 'Limited Drop', 'Almost Gone': 'Almost Gone' },
    colors: { Black: 'Black', Bone: 'Bone', Olive: 'Olive', Charcoal: 'Charcoal', Navy: 'Navy' },
    oneSize: 'One Size',
    product: { home: 'Home', shop: 'Shop', reviews: 'reviews', save: 'Save', color: 'Color', size: 'Size', sizeGuide: 'Size guide', selectSizePre: 'Select a size (defaults to', selectSizePost: ').', qty: 'Qty', add: 'Add to Cart', buy: 'Buy Now', freeShip: 'Free shipping $75+', ret30: '30-day returns', secure: 'Secure checkout', ships: 'Ships worldwide in 5–8 business days', complete: 'Complete the Look', guideTitle: 'Size Guide (inches)', gSize: 'Size', gChest: 'Chest', gWaist: 'Waist', notFound: 'Product not found', shopAll: 'Shop all', storySuffix: 'Every piece is designed for movement and made to live in — from the roda to the street, carrying the axé of Capoeira with you.', sections: { story: 'The Story', features: 'Features', materials: 'Materials', fit: 'Fit', care: 'Care', shipping: 'Shipping', returns: 'Returns' }, features: ['Premium mid-weight fabric', 'Reinforced stitching built for movement', 'High-density print that resists cracking & fading', 'Pre-shrunk, true-to-size'], care: 'Machine wash cold, inside out. Tumble dry low. Do not iron directly on the print. Do not bleach.', shippingBody: 'Made to order and shipped worldwide in 5–8 business days. Free shipping on orders over $75.', returnsBody: "30-day hassle-free returns on unworn items. Wrong size? We'll swap it, no questions asked." },
    pc: {
      p1: { tagline: 'The everyday staple built for the ginga.', material: '100% ring-spun combed cotton · 220 gsm.', fit: 'Regular fit, true to size. Model is 6\'1" wearing size M.' },
      p2: { tagline: 'Heavyweight warmth carrying the energy of the roda.', material: '80% cotton / 20% recycled polyester brushed fleece · 350 gsm.', fit: 'Relaxed fit. Size down for a cleaner silhouette.' },
      p3: { tagline: 'Draped, dropped and made for movement.', material: '100% heavyweight cotton loopback · 400 gsm.', fit: 'Oversized drop-shoulder fit. Take your usual size.' },
      p4: { tagline: 'Train free. Move freer.', material: 'Airlume combed & ring-spun cotton · 150 gsm.', fit: 'Athletic cut for full range of motion.' },
      p5: { tagline: 'An ode to the instrument that leads the game.', material: '100% ring-spun combed cotton · 220 gsm.', fit: 'Regular fit, true to size.' },
      p6: { tagline: 'Top off the look, low-key.', material: '100% brushed cotton twill with adjustable metal buckle.', fit: 'One size fits most. Low-profile unstructured crown.' },
      p7: { tagline: 'Long sleeve, deep meaning.', material: '100% ring-spun combed cotton · 240 gsm.', fit: 'Regular fit with ribbed cuffs.' },
      p8: { tagline: 'Carry the culture everywhere.', material: '16oz heavyweight canvas cotton with reinforced handles.', fit: 'Roomy everyday carry.' },
    },
    collPage: { all: 'All Products', products: 'products', product: 'product', home: 'Home', soon: 'New pieces dropping soon. Check back shortly.' },
    about: { eyebrow: 'Our Story', h1: 'Born in the Roda', headline: 'We do not sell clothing. We build belonging.', lead1: 'Capoeira is Life started with a single truth: this is more than a martial art. It is music, history, resistance and family woven into every movement. Our apparel is a way to carry that spirit off the mat and into the world — designed with the same intention, energy and respect that the roda demands.', lead2: 'Every piece is a nod to the mestres who came before, and an invitation to the capoeiristas still finding their ginga. Axé.', values: [{ title: 'Music', body: 'The berimbau leads. Every movement answers the rhythm of the roda.' }, { title: 'History', body: 'Born from resistance in Brazil, disguised as dance, carried through generations.' }, { title: 'Movement', body: 'The ginga never stops. Fluid, unpredictable, alive.' }, { title: 'Family', body: 'A global circle. Wherever there is a roda, there is home.' }], join: 'Join the movement.', cta: 'Shop the Collection' },
  },

  es: {
    nav: { shop: 'Tienda', collections: 'Colecciones', best: 'Más Vendidos', about: 'Nosotros', instagram: 'Instagram' },
    announce: ['Envío gratis a todo el mundo desde $75', 'Únete a la Roda — 10% de descuento en tu primer pedido', 'Nuevo lanzamiento ya disponible — cantidades limitadas'],
    hero: { eyebrow: 'Movimiento Afrobrasileño · Con raíces en Bahía', sub: 'Viste la cultura. Vive el movimiento.', cta1: 'Ver Colección', cta2: 'Más Vendidos' },
    social: { heading: 'Amado por miles de capoeiristas en todo el mundo', sub: 'Únete a un movimiento global en más de 40 países' },
    collections: { eyebrow: 'Comprar por categoría', title: 'Colecciones Destacadas', viewAll: 'Ver todo' },
    cat: {
      't-shirts': { name: 'Camisetas', tagline: 'Movimiento diario' },
      'hoodies': { name: 'Sudaderas', tagline: 'Calidez y peso' },
      'tank-tops': { name: 'Camisetas sin Mangas', tagline: 'Entrena libre' },
      'hats': { name: 'Gorras', tagline: 'El toque final' },
      'accessories': { name: 'Accesorios', tagline: 'Llévalo contigo' },
    },
    best: { eyebrow: 'Los más deseados', title: 'Más Vendidos' },
    lifestyle: { eyebrow: 'Más que un arte marcial', titleA: 'Más que', titleB: 'un arte marcial.', lines: ['La capoeira es música.', 'La capoeira es historia.', 'La capoeira es resistencia.', 'La capoeira es familia.'], closing: 'La capoeira es vida.', cta: 'Nuestra Historia' },
    insta: { eyebrow: '@capoeira.is.life', title: 'Sigue el Movimiento', follow: 'Seguir @capoeira.is.life' },
    tst: { eyebrow: 'Familia global', title: 'Lo Que Dicen' },
    reviews: {
      t1: "La calidad es increíble. Entreno con ella, vivo con ella, y todos en mi grupo preguntaron dónde la conseguí. Esto es la cultura, bien hecha.",
      t2: "Por fin ropa que se siente como nosotros. La sudadera es gruesa, cálida y hermosa. Axé a quien diseñó esto.",
      t3: "Compré la camiseta desde un reel de Instagram. El envío fue rápido y el estampado sigue como nuevo después de 20 lavados.",
      t4: "Más que ropa — se siente como pertenecer a algo más grande. El ajuste es perfecto y la tela es premium.",
      t5: "Recibo cumplidos siempre. Se mueve conmigo en la roda y luce impecable en la calle.",
      t6: "Esta marca lo entiende. La capoeira es vida, y ahora puedo vestirla. Fan al instante.",
    },
    faq: { eyebrow: 'Bueno saber', title: 'Preguntas Frecuentes' },
    faqs: [
      { q: '¿Cuánto tarda el envío?', a: 'Los pedidos se fabrican bajo demanda y se envían a todo el mundo en 5–8 días hábiles. Recibirás el seguimiento en cuanto salga de nuestras instalaciones. Envío gratis en pedidos superiores a $75.' },
      { q: '¿Cuál es su política de devoluciones?', a: 'Ofrecemos devoluciones sin complicaciones durante 30 días en artículos sin usar ni lavar. ¿Talla equivocada? La cambiamos, sin dramas.' },
      { q: '¿Cómo elijo la talla correcta?', a: 'Cada página de producto incluye una guía de tallas detallada. Nuestras camisetas son de talla estándar; las sudaderas son holgadas, así que elige una talla menos para un look más ajustado.' },
      { q: '¿Qué materiales usan?', a: 'Algodón peinado premium para las camisetas y felpa cepillada pesada para las sudaderas. Todo elegido para moverse contigo y durar.' },
      { q: '¿La calidad del estampado es duradera?', a: 'Sí. Usamos serigrafía de alta densidad e impresión DTG diseñadas para resistir grietas y decoloración lavado tras lavado.' },
      { q: '¿Cuánto tarda la producción?', a: 'Como cada pieza se fabrica bajo demanda para reducir residuos, la producción tarda de 2 a 4 días hábiles antes del envío.' },
    ],
    news: { title: 'Únete a la Roda', sub: 'Lanzamientos exclusivos, preventas y descuentos solo para miembros.', placeholder: 'Ingresa tu correo', button: 'Suscribirme', disclaimer: 'Sin spam. Cancela cuando quieras.', toastTitle: '¡Bienvenido a la Roda!', toastDesc: 'Revisa tu correo para tu código del 10%.' },
    footer: { tagline: 'Viste la cultura. Vive el movimiento. Ropa premium para capoeiristas de todo el mundo.', shop: 'Tienda', company: 'Empresa', support: 'Ayuda', rights: 'Todos los derechos reservados.', privacy: 'Privacidad', terms: 'Términos', about: 'Nosotros', bestSellers: 'Más Vendidos', contact: 'Contacto', shipping: 'Envíos', returns: 'Devoluciones', sizing: 'Tallas', faq: 'Preguntas Frecuentes' },
    cart: { title: 'Tu Bolsa', empty: 'Tu bolsa está vacía.', continue: 'Seguir Comprando', awayPre: 'Te faltan', awayPost: 'para envío gratis', unlocked: '¡Has desbloqueado el envío gratis!', alsoLike: 'También te puede gustar', add: 'Añadir', subtotal: 'Subtotal', checkout: 'Pagar', taxes: 'Envío e impuestos calculados al pagar' },
    search: { placeholder: 'Buscar productos...', popular: 'Popular', no: 'Sin resultados para' },
    stickyShop: 'Ver la Colección',
    badges: { 'Best Seller': 'Más Vendido', 'New Arrival': 'Novedad', 'Limited Drop': 'Edición Limitada', 'Almost Gone': 'Casi Agotado' },
    colors: { Black: 'Negro', Bone: 'Hueso', Olive: 'Oliva', Charcoal: 'Carbón', Navy: 'Marino' },
    oneSize: 'Talla Única',
    product: { home: 'Inicio', shop: 'Tienda', reviews: 'reseñas', save: 'Ahorra', color: 'Color', size: 'Talla', sizeGuide: 'Guía de tallas', selectSizePre: 'Selecciona una talla (por defecto', selectSizePost: ').', qty: 'Cant.', add: 'Añadir al Carrito', buy: 'Comprar Ahora', freeShip: 'Envío gratis +$75', ret30: 'Devoluciones 30 días', secure: 'Pago seguro', ships: 'Envío mundial en 5–8 días hábiles', complete: 'Completa el Look', guideTitle: 'Guía de Tallas (pulgadas)', gSize: 'Talla', gChest: 'Pecho', gWaist: 'Cintura', notFound: 'Producto no encontrado', shopAll: 'Ver todo', storySuffix: 'Cada pieza está diseñada para el movimiento y hecha para vivirla — de la roda a la calle, llevando el axé de la capoeira contigo.', sections: { story: 'La Historia', features: 'Características', materials: 'Materiales', fit: 'Ajuste', care: 'Cuidado', shipping: 'Envío', returns: 'Devoluciones' }, features: ['Tejido premium de peso medio', 'Costuras reforzadas pensadas para el movimiento', 'Estampado de alta densidad que resiste grietas y decoloración', 'Preencogido, talla estándar'], care: 'Lavar a máquina en frío, del revés. Secar a baja temperatura. No planchar directamente sobre el estampado. No usar lejía.', shippingBody: 'Hecho bajo pedido y enviado a todo el mundo en 5–8 días hábiles. Envío gratis en pedidos superiores a $75.', returnsBody: 'Devoluciones sin complicaciones durante 30 días en artículos sin usar. ¿Talla equivocada? La cambiamos, sin preguntas.' },
    pc: {
      p1: { tagline: 'El básico de cada día hecho para la ginga.', material: '100% algodón peinado · 220 g/m².', fit: 'Ajuste regular, talla estándar. El modelo mide 1,85 m y usa talla M.' },
      p2: { tagline: 'Calidez de peso pesado con la energía de la roda.', material: '80% algodón / 20% poliéster reciclado, felpa cepillada · 350 g/m².', fit: 'Ajuste relajado. Elige una talla menos para una silueta más limpia.' },
      p3: { tagline: 'Holgada, caída y hecha para el movimiento.', material: '100% algodón pesado tipo loopback · 400 g/m².', fit: 'Ajuste oversized con hombros caídos. Usa tu talla habitual.' },
      p4: { tagline: 'Entrena libre. Muévete más libre.', material: 'Algodón peinado Airlume · 150 g/m².', fit: 'Corte atlético para total libertad de movimiento.' },
      p5: { tagline: 'Una oda al instrumento que guía el juego.', material: '100% algodón peinado · 220 g/m².', fit: 'Ajuste regular, talla estándar.' },
      p6: { tagline: 'El toque final, con discreción.', material: '100% sarga de algodón cepillado con hebilla metálica ajustable.', fit: 'Talla única para la mayoría. Corona baja sin estructura.' },
      p7: { tagline: 'Manga larga, significado profundo.', material: '100% algodón peinado · 240 g/m².', fit: 'Ajuste regular con puños acanalados.' },
      p8: { tagline: 'Lleva la cultura a todas partes.', material: 'Lona de algodón pesada de 16 oz con asas reforzadas.', fit: 'Amplia para el día a día.' },
    },
    collPage: { all: 'Todos los Productos', products: 'productos', product: 'producto', home: 'Inicio', soon: 'Nuevas piezas muy pronto. Vuelve en breve.' },
    about: { eyebrow: 'Nuestra Historia', h1: 'Nacido en la Roda', headline: 'No vendemos ropa. Creamos pertenencia.', lead1: 'Capoeira is Life nació de una sola verdad: esto es más que un arte marcial. Es música, historia, resistencia y familia tejidas en cada movimiento. Nuestra ropa es una forma de llevar ese espíritu fuera de la roda y al mundo — diseñada con la misma intención, energía y respeto que exige la roda.', lead2: 'Cada pieza es un guiño a los mestres que vinieron antes, y una invitación a los capoeiristas que aún buscan su ginga. Axé.', values: [{ title: 'Música', body: 'El berimbau guía. Cada movimiento responde al ritmo de la roda.' }, { title: 'Historia', body: 'Nacida de la resistencia en Brasil, disfrazada de danza, transmitida por generaciones.' }, { title: 'Movimiento', body: 'La ginga nunca para. Fluida, impredecible, viva.' }, { title: 'Familia', body: 'Un círculo global. Donde hay una roda, hay hogar.' }], join: 'Únete al movimiento.', cta: 'Ver la Colección' },
  },

  pt: {
    nav: { shop: 'Loja', collections: 'Coleções', best: 'Mais Vendidos', about: 'Sobre', instagram: 'Instagram' },
    announce: ['Frete grátis para todo o mundo acima de $75', 'Entre na Roda — 10% de desconto no primeiro pedido', 'Novo lançamento disponível — quantidades limitadas'],
    hero: { eyebrow: 'Movimento Afro-Brasileiro · Raízes na Bahia', sub: 'Vista a cultura. Viva o movimento.', cta1: 'Ver Coleção', cta2: 'Mais Vendidos' },
    social: { heading: 'Amado por milhares de capoeiristas no mundo todo', sub: 'Faça parte de um movimento global em mais de 40 países' },
    collections: { eyebrow: 'Comprar por categoria', title: 'Coleções em Destaque', viewAll: 'Ver tudo' },
    cat: {
      't-shirts': { name: 'Camisetas', tagline: 'Movimento diário' },
      'hoodies': { name: 'Moletons', tagline: 'Aconchego e peso' },
      'tank-tops': { name: 'Regatas', tagline: 'Treine livre' },
      'hats': { name: 'Bonés', tagline: 'O toque final' },
      'accessories': { name: 'Acessórios', tagline: 'Leve com você' },
    },
    best: { eyebrow: 'Os mais desejados', title: 'Mais Vendidos' },
    lifestyle: { eyebrow: 'Mais que uma arte marcial', titleA: 'Mais que', titleB: 'uma arte marcial.', lines: ['Capoeira é música.', 'Capoeira é história.', 'Capoeira é resistência.', 'Capoeira é família.'], closing: 'Capoeira é vida.', cta: 'Nossa História' },
    insta: { eyebrow: '@capoeira.is.life', title: 'Siga o Movimento', follow: 'Seguir @capoeira.is.life' },
    tst: { eyebrow: 'Família global', title: 'O Que Dizem' },
    reviews: {
      t1: "A qualidade é surreal. Treino com ela, vivo nela, e todo mundo do meu grupo perguntou onde comprei. Isso é a cultura, feita do jeito certo.",
      t2: "Enfim uma roupa com a nossa cara. O moletom é pesado, quentinho e lindo. Axé para quem desenhou isso.",
      t3: "Comprei a camiseta por um reel do Instagram. A entrega foi rápida e a estampa continua como nova depois de 20 lavagens.",
      t4: "Mais que roupa — é sentir que pertence a algo maior. O caimento é perfeito e o tecido é premium.",
      t5: "Recebo elogios toda vez. Acompanha meu movimento na roda e fica impecável na rua.",
      t6: "Essa marca entende. Capoeira é vida, e agora posso vestir isso. Fã na hora.",
    },
    faq: { eyebrow: 'Bom saber', title: 'Perguntas Frequentes' },
    faqs: [
      { q: 'Quanto tempo leva a entrega?', a: 'Os pedidos são feitos sob demanda e enviados para todo o mundo em 5–8 dias úteis. Você recebe o rastreio assim que sai da nossa unidade. Frete grátis em pedidos acima de $75.' },
      { q: 'Qual é a política de devolução?', a: 'Oferecemos devolução sem burocracia em até 30 dias para itens não usados e não lavados. Tamanho errado? A gente troca, sem drama.' },
      { q: 'Como escolho o tamanho certo?', a: 'Cada página de produto tem um guia de tamanhos detalhado. Nossas camisetas seguem o tamanho padrão; os moletons são folgados, então escolha um número a menos para um caimento mais justo.' },
      { q: 'Quais materiais vocês usam?', a: 'Algodão penteado premium nas camisetas e moletom felpado pesado nos moletons. Tudo escolhido para acompanhar seu movimento e durar.' },
      { q: 'A qualidade da estampa é durável?', a: 'Sim. Usamos serigrafia de alta densidade e impressão DTG feitas para resistir a rachaduras e desbotamento lavagem após lavagem.' },
      { q: 'Quanto tempo leva a produção?', a: 'Como cada peça é feita sob demanda para reduzir desperdício, a produção leva de 2 a 4 dias úteis antes do envio.' },
    ],
    news: { title: 'Entre na Roda', sub: 'Lançamentos exclusivos, prévias e descontos só para membros.', placeholder: 'Digite seu e-mail', button: 'Inscrever-se', disclaimer: 'Sem spam. Cancele quando quiser.', toastTitle: 'Bem-vindo à Roda!', toastDesc: 'Confira seu e-mail para o código de 10%.' },
    footer: { tagline: 'Vista a cultura. Viva o movimento. Roupas premium para capoeiristas do mundo todo.', shop: 'Loja', company: 'Empresa', support: 'Suporte', rights: 'Todos os direitos reservados.', privacy: 'Privacidade', terms: 'Termos', about: 'Sobre', bestSellers: 'Mais Vendidos', contact: 'Contato', shipping: 'Envios', returns: 'Devoluções', sizing: 'Tamanhos', faq: 'Perguntas Frequentes' },
    cart: { title: 'Sua Sacola', empty: 'Sua sacola está vazia.', continue: 'Continuar Comprando', awayPre: 'Faltam', awayPost: 'para frete grátis', unlocked: 'Você desbloqueou o frete grátis!', alsoLike: 'Você também pode gostar', add: 'Adicionar', subtotal: 'Subtotal', checkout: 'Finalizar', taxes: 'Frete e impostos calculados no checkout' },
    search: { placeholder: 'Buscar produtos...', popular: 'Popular', no: 'Nenhum resultado para' },
    stickyShop: 'Ver a Coleção',
    badges: { 'Best Seller': 'Mais Vendido', 'New Arrival': 'Novidade', 'Limited Drop': 'Edição Limitada', 'Almost Gone': 'Quase Esgotado' },
    colors: { Black: 'Preto', Bone: 'Osso', Olive: 'Oliva', Charcoal: 'Grafite', Navy: 'Marinho' },
    oneSize: 'Tamanho Único',
    product: { home: 'Início', shop: 'Loja', reviews: 'avaliações', save: 'Economize', color: 'Cor', size: 'Tamanho', sizeGuide: 'Guia de tamanhos', selectSizePre: 'Selecione um tamanho (padrão', selectSizePost: ').', qty: 'Qtd.', add: 'Adicionar ao Carrinho', buy: 'Comprar Agora', freeShip: 'Frete grátis +$75', ret30: 'Devolução 30 dias', secure: 'Pagamento seguro', ships: 'Envio mundial em 5–8 dias úteis', complete: 'Complete o Look', guideTitle: 'Guia de Tamanhos (polegadas)', gSize: 'Tamanho', gChest: 'Peito', gWaist: 'Cintura', notFound: 'Produto não encontrado', shopAll: 'Ver tudo', storySuffix: 'Cada peça é desenhada para o movimento e feita para viver — da roda à rua, levando o axé da capoeira com você.', sections: { story: 'A História', features: 'Características', materials: 'Materiais', fit: 'Caimento', care: 'Cuidados', shipping: 'Envio', returns: 'Devoluções' }, features: ['Tecido premium de peso médio', 'Costura reforçada feita para o movimento', 'Estampa de alta densidade que resiste a rachaduras e desbotamento', 'Pré-encolhido, tamanho padrão'], care: 'Lavar à máquina em água fria, do avesso. Secadora em temperatura baixa. Não passar ferro diretamente na estampa. Não usar alvejante.', shippingBody: 'Feito sob demanda e enviado para todo o mundo em 5–8 dias úteis. Frete grátis em pedidos acima de $75.', returnsBody: 'Devolução sem burocracia em até 30 dias para itens não usados. Tamanho errado? A gente troca, sem perguntas.' },
    pc: {
      p1: { tagline: 'O básico do dia a dia feito para a ginga.', material: '100% algodão penteado · 220 g/m².', fit: 'Caimento regular, tamanho padrão. O modelo tem 1,85 m e veste M.' },
      p2: { tagline: 'Aconchego pesado com a energia da roda.', material: '80% algodão / 20% poliéster reciclado, moletom felpado · 350 g/m².', fit: 'Caimento relaxado. Escolha um número a menos para uma silhueta mais limpa.' },
      p3: { tagline: 'Solto, caído e feito para o movimento.', material: '100% algodão pesado loopback · 400 g/m².', fit: 'Caimento oversized com ombro caído. Use seu tamanho habitual.' },
      p4: { tagline: 'Treine livre. Mova-se mais livre.', material: 'Algodão penteado Airlume · 150 g/m².', fit: 'Corte atlético para total liberdade de movimento.' },
      p5: { tagline: 'Uma ode ao instrumento que conduz o jogo.', material: '100% algodão penteado · 220 g/m².', fit: 'Caimento regular, tamanho padrão.' },
      p6: { tagline: 'O toque final, no low profile.', material: '100% sarja de algodão escovado com fivela metálica ajustável.', fit: 'Tamanho único para a maioria. Copa baixa sem estrutura.' },
      p7: { tagline: 'Manga longa, significado profundo.', material: '100% algodão penteado · 240 g/m².', fit: 'Caimento regular com punhos canelados.' },
      p8: { tagline: 'Leve a cultura para todo lugar.', material: 'Lona de algodão pesada de 16 oz com alças reforçadas.', fit: 'Ampla para o dia a dia.' },
    },
    collPage: { all: 'Todos os Produtos', products: 'produtos', product: 'produto', home: 'Início', soon: 'Novas peças em breve. Volte logo.' },
    about: { eyebrow: 'Nossa História', h1: 'Nascido na Roda', headline: 'Não vendemos roupa. Construímos pertencimento.', lead1: 'A Capoeira is Life nasceu de uma única verdade: isto é mais que uma arte marcial. É música, história, resistência e família tecidas em cada movimento. Nossas roupas são uma forma de levar esse espírito para fora da roda e para o mundo — desenhadas com a mesma intenção, energia e respeito que a roda exige.', lead2: 'Cada peça é uma homenagem aos mestres que vieram antes, e um convite aos capoeiristas que ainda encontram sua ginga. Axé.', values: [{ title: 'Música', body: 'O berimbau conduz. Cada movimento responde ao ritmo da roda.' }, { title: 'História', body: 'Nascida da resistência no Brasil, disfarçada de dança, atravessando gerações.' }, { title: 'Movimento', body: 'A ginga nunca para. Fluida, imprevisível, viva.' }, { title: 'Família', body: 'Um círculo global. Onde há uma roda, há um lar.' }], join: 'Entre no movimento.', cta: 'Ver a Coleção' },
  },
};

const LangCtx = createContext(null);
export const useLang = () => useContext(LangCtx);

export function LangProvider({ children }) {
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cil_lang');
      if (saved && dict[saved]) setLocale(saved);
    } catch (e) {}
  }, []);

  const change = useCallback((code) => {
    if (!dict[code]) return;
    setLocale(code);
    try { localStorage.setItem('cil_lang', code); } catch (e) {}
    if (typeof document !== 'undefined') document.documentElement.lang = code;
  }, []);

  useEffect(() => { if (typeof document !== 'undefined') document.documentElement.lang = locale; }, [locale]);

  const value = { locale, setLocale: change, t: dict[locale] };
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}
