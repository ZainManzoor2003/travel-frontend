import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export type SupportedLanguage = 'en' | 'es';

type Translations = Record<string, Record<SupportedLanguage, string>>;

const TRANSLATIONS: Translations = {
	// Common nav labels
	Home: { en: 'Home', es: 'Inicio' },
	About: { en: 'About', es: 'Nosotros' },
	Packages: { en: 'Packages', es: 'Paquetes' },
	Gallery: { en: 'Gallery', es: 'Galería' },
	Blog: { en: 'Blog', es: 'Blog' },
	Contact: { en: 'Contact', es: 'Contacto' },
	Login: { en: 'Login', es: 'Ingresar' },
	'Sign Up': { en: 'Sign Up', es: 'Registrarse' },
	'Admin Dashboard': { en: 'Admin Dashboard', es: 'Panel Admin' },
	'My Dashboard': { en: 'My Dashboard', es: 'Mi Panel' },
	Logout: { en: 'Logout', es: 'Salir' },
	Menu: { en: 'MENU', es: 'MENÚ' },
	English: { en: 'English', es: 'Inglés' },
	Spanish: { en: 'Spanish', es: 'Español' },
	EN: { en: 'EN', es: 'EN' },
	ES: { en: 'ES', es: 'ES' },
	CLOSE: { en: 'CLOSE', es: 'CERRAR' },
	Dashboard: { en: 'Dashboard', es: 'Panel' },
	'Hero Title': { en: 'The Journey Begins Here', es: 'La aventura comienza aquí' },
	'Where Time Title': { en: 'Where Time and Space are Yours to Own', es: 'Donde el tiempo y el espacio son tuyos' },
	'Where Time Paragraph': { en: "At Awasi, our lodges are designed to feel like the home of an old friend, guiding you through stunning landscapes, native flavors and hidden gems. It's a fusion of friendship, admiration for the place, and personal hospitality that creates a genuine connection with each guest.", es: 'En Awasi, nuestros alojamientos se sienten como la casa de un viejo amigo, guiándote por paisajes increíbles, sabores nativos y rincones ocultos. Es una fusión de amistad, admiración por el lugar y hospitalidad personal que crea una conexión genuina con cada huésped.' },
	'A Meaningful Exploration': { en: 'A Meaningful Exploration', es: 'Una exploración con sentido' },
	'Centered Around You': { en: 'Centered Around You', es: 'Centrada en ti' },
	'Centered Paragraph': { en: 'At Awasi, every stay is fully tailor-made. Each room is assigned a private guide and a 4x4 vehicle, allowing guests the freedom to explore at their own pace and according to their individual interests and rhythms. Our personalized approach ensures immersive, flexible experiences designed to connect you with the essence of each unique location.', es: 'En Awasi, cada estadía es totalmente a medida. Cada habitación cuenta con guía privado y vehículo 4x4, dando libertad para explorar al propio ritmo e intereses. Nuestro enfoque personalizado garantiza experiencias inmersivas y flexibles para conectar con la esencia de cada lugar.' },
	'Discover Our Destinations': { en: 'Discover Our Destinations', es: 'Descubre nuestros destinos' },
	'Discover Paragraph': { en: "Experience the world's most extraordinary places with our carefully curated collection of luxury lodges", es: 'Vive lugares extraordinarios con nuestra cuidada colección de alojamientos de lujo' },
	'Loading destinations...': { en: 'Loading destinations...', es: 'Cargando destinos...' },
	'No featured destinations available': { en: 'No featured destinations available', es: 'No hay destinos destacados disponibles' },
	'VIEW TOUR DETAILS': { en: 'VIEW TOUR DETAILS', es: 'VER DETALLES DEL TOUR' },
	'BOOK THIS TOUR': { en: 'BOOK THIS TOUR', es: 'RESERVAR ESTE TOUR' },
	'Combine Lodges Line 1': { en: 'Combine two or more of our lodges', es: 'Combina dos o más de nuestros alojamientos' },
	'Combine Lodges Line 2': { en: 'for the perfect South American', es: 'para la perfecta aventura sudamericana' },
	'Combine Lodges Line 3': { en: 'Adventure', es: 'de aventura' },
	'Combine Lodges Paragraph 1': { en: 'When combining our destinations, enjoy complimentary stays at our favourite hotels in connecting cities, plus benefit from the local know-how from our experts who will help create your tailor-made experience.', es: 'Al combinar nuestros destinos, disfruta de noches de cortesía en hoteles seleccionados en ciudades de conexión y del conocimiento local de nuestros expertos para crear tu experiencia a medida.' },
	'Combine Lodges Paragraph 2': { en: 'Our rates include a fully hosted experience: private excursions, refined local cuisine, and elegant accommodations come together seamlessly to create meaningful and unforgettable journeys.', es: 'Nuestras tarifas incluyen una experiencia completamente acompañada: excursiones privadas, gastronomía local y alojamientos elegantes se combinan para crear viajes memorables.' },
	'AIRPORTS': { en: 'AIRPORTS', es: 'AEROPUERTOS' },
	'FLIGHTS & CONNECTIONS': { en: 'FLIGHTS & CONNECTIONS', es: 'VUELOS Y CONEXIONES' },
	'Explore more stories': { en: 'Explore more Awasi stories', es: 'Explora más historias de Awasi' },
	'Loading stories...': { en: 'Loading stories...', es: 'Cargando historias...' },
	'No featured stories available': { en: 'No featured stories available', es: 'No hay historias destacadas disponibles' },
	'SEE OUR BLOG': { en: 'SEE OUR BLOG', es: 'VER NUESTRO BLOG' },
	'Follow us on Instagram': { en: 'Follow us on Instagram', es: 'Síguenos en Instagram' },

	// Packages page
	'All Tours': { en: 'All Tours', es: 'Todos los tours' },
	'Travel Beyond Tours': { en: 'Travel Beyond Tours', es: 'Viajes Travel Beyond' },
	'Packages Hero Blurb': { en: 'Discover our carefully curated selection of travel experiences around the world', es: 'Descubre nuestra cuidada selección de experiencias de viaje alrededor del mundo' },
	'Search destinations, activities, or tours...': { en: 'Search destinations, activities, or tours...', es: 'Busca destinos, actividades o tours...' },
	'Most Popular': { en: 'Most Popular', es: 'Más populares' },
	'Price: Low to High': { en: 'Price: Low to High', es: 'Precio: menor a mayor' },
	'Price: High to Low': { en: 'Price: High to Low', es: 'Precio: mayor a menor' },
	'Highest Rated': { en: 'Highest Rated', es: 'Mejor valorados' },
	'Shortest Duration': { en: 'Shortest Duration', es: 'Menor duración' },
	'Sort by:': { en: 'Sort by:', es: 'Ordenar por:' },
	'Loading tours...': { en: 'Loading tours...', es: 'Cargando tours...' },
	'Unable to load tours': { en: 'Unable to load tours', es: 'No se pueden cargar los tours' },
	'No tours found': { en: 'No tours found', es: 'No se encontraron tours' },
	'Try adjusting your search or filter criteria': { en: 'Try adjusting your search or filter criteria', es: 'Prueba ajustando tu búsqueda o filtros' },
	'Available Tours': { en: 'Available Tours', es: 'Tours disponibles' },
	'Search Results': { en: 'Search Results', es: 'Resultados de búsqueda' },
	'Showing results for': { en: 'Showing results for', es: 'Mostrando resultados para' },
	"Can't Find What You're Looking For?": { en: "Can't Find What You're Looking For?", es: '¿No encuentras lo que buscas?' },
	'We can create a custom travel package tailored to your specific needs and preferences': { en: 'We can create a custom travel package tailored to your specific needs and preferences', es: 'Podemos crear un paquete a medida según tus necesidades y preferencias' },
	'Contact Us': { en: 'Contact Us', es: 'Contáctanos' },
	'Learn More': { en: 'Learn More', es: 'Saber más' },

	// Footer
	'Destinations': { en: 'Destinations', es: 'Destinos' },
	'CONTACT US': { en: 'CONTACT US', es: 'CONTÁCTANOS' },
	'CAREERS': { en: 'CAREERS', es: 'TRABAJA CON NOSOTROS' },
	"LET'S STAY IN TOUCH": { en: "LET'S STAY IN TOUCH", es: 'SIGAMOS EN CONTACTO' },
	'Travel Beyond BRAND': { en: 'Travel Beyond BRAND', es: 'Marca Travel Beyond' },
  'Travel Beyond': { en: 'Travel Beyond', es: 'Viajes Travel Beyond' },

	// Contact page
	'First Name*': { en: 'First Name*', es: 'Nombre*' },
	'Last Name*': { en: 'Last Name*', es: 'Apellido*' },
	'Email*': { en: 'Email*', es: 'Correo*' },
	'Phone Number*': { en: 'Phone Number*', es: 'Teléfono*' },
	'Your Country*': { en: 'Your Country*', es: 'Tu país*' },
	'How did you hear about us?*': { en: 'How did you hear about us?*', es: '¿Cómo te enteraste de nosotros?*' },
	'Message': { en: 'Message', es: 'Mensaje' },
	'Tell us about your trip...': { en: 'Tell us about your trip...', es: 'Cuéntanos sobre tu viaje...' },
	'Sending...': { en: 'Sending...', es: 'Enviando...' },
	'Send Message': { en: 'Send Message', es: 'Enviar mensaje' },
	'Maria': { en: 'Maria', es: 'María' },
	'Cruz': { en: 'Cruz', es: 'Cruz' },
	'youremail@gmail.com': { en: 'youremail@gmail.com', es: 'tucorreo@gmail.com' },
	'+1 000 000 00': { en: '+1 000 000 00', es: '+34 000 000 00' },
	'USA': { en: 'USA', es: 'EE. UU.' },
	'Instagram': { en: 'Instagram', es: 'Instagram' },

	// Login page
	'Welcome Back': { en: 'Welcome Back', es: 'Bienvenido de nuevo' },
	'Log in to manage your tailor-made journeys': { en: 'Log in to manage your tailor-made journeys', es: 'Inicia sesión para gestionar tus viajes a medida' },
	'Email': { en: 'Email', es: 'Correo' },
	'you@example.com': { en: 'you@example.com', es: 'tucorreo@ejemplo.com' },
	'Password': { en: 'Password', es: 'Contraseña' },
	'••••••••': { en: '••••••••', es: '••••••••' },
	'Forgot password?': { en: 'Forgot password?', es: '¿Olvidaste tu contraseña?' },
	'Signing in...': { en: 'Signing in...', es: 'Iniciando sesión...' },
	'Login': { en: 'Login', es: 'Ingresar' },
	'New here?': { en: 'New here?', es: '¿Eres nuevo?' },
	'Create account': { en: 'Create account', es: 'Crear cuenta' },

	// Signup page
	'Create Account': { en: 'Create Account', es: 'Crear cuenta' },
	'Start crafting your fully tailor‑made experience': { en: 'Start crafting your fully tailor‑made experience', es: 'Comienza a crear tu experiencia totalmente a medida' },
	'Username (Optional)': { en: 'Username (Optional)', es: 'Usuario (opcional)' },
	'Enter your username (optional)': { en: 'Enter your username (optional)', es: 'Introduce tu usuario (opcional)' },
	'Email address': { en: 'Email address', es: 'Correo electrónico' },
	'Enter your email address': { en: 'Enter your email address', es: 'Introduce tu correo electrónico' },
	'Enter your password (min 6 characters)': { en: 'Enter your password (min 6 characters)', es: 'Introduce tu contraseña (mín. 6 caracteres)' },
	'Creating your account...': { en: 'Creating your account...', es: 'Creando tu cuenta...' },
	'Create your account': { en: 'Create your account', es: 'Crea tu cuenta' },
	'Already have an account?': { en: 'Already have an account?', es: '¿Ya tienes cuenta?' },
	'Sign in to your account': { en: 'Sign in to your account', es: 'Inicia sesión en tu cuenta' },

	// Homepage packages (marketing-style) page
	'Homepage Packages Hero Sub': { en: 'Hand-crafted stays including private guiding, full board, and immersive excursions.', es: 'Estadías hechas a mano con guía privado, pensión completa y excursiones inmersivas.' },
	'Choose Your Journey': { en: 'Choose Your Journey', es: 'Elige tu viaje' },
	'Location, inclusions and nightly price at a glance': { en: 'Location, inclusions and nightly price at a glance', es: 'Ubicación, inclusiones y precio por noche de un vistazo' },
	'DETAILS': { en: 'DETAILS', es: 'DETALLES' },

	// Gallery page
	'Discover Timeless Landscapes': { en: 'Discover Timeless Landscapes', es: 'Descubre paisajes atemporales' },
	'Loading gallery...': { en: 'Loading gallery...', es: 'Cargando galería...' },

	// Blog page
	'Blog Hero Blurb': { en: 'At Travel Beyond Tours, we believe that Nature and Art are deeply intertwined. They are both valuable, fragile and essential for human beings.', es: 'En Travel Beyond Tours creemos que la Naturaleza y el Arte están profundamente entrelazados. Ambos son valiosos, frágiles y esenciales para las personas.' },
	'Travel Beyond Stories': { en: 'Travel Beyond Stories', es: 'Historias de Travel Beyond' },
	'Discover the world through our immersive experiences': { en: 'Discover the world through our immersive experiences', es: 'Descubre el mundo a través de nuestras experiencias inmersivas' },
  // User Dashboard
  'Dashboard': { en: 'Dashboard', es: 'Panel' },
  'Welcome back,': { en: 'Welcome back,', es: 'Bienvenido, ' },
  'New Booking': { en: 'New Booking', es: 'Nueva reserva' },
  'Total Bookings': { en: 'Total Bookings', es: 'Reservas totales' },
  'Pending Payment': { en: 'Pending Payment', es: 'Pago pendiente' },
  'Confirmed': { en: 'Confirmed', es: 'Confirmadas' },
  'Total Spent': { en: 'Total Spent', es: 'Total gastado' },
  'My Bookings': { en: 'My Bookings', es: 'Mis reservas' },
  'No bookings yet': { en: 'No bookings yet', es: 'Aún no tienes reservas' },
  'Start your adventure by booking your first tour': { en: 'Start your adventure by booking your first tour', es: 'Comienza tu aventura reservando tu primer tour' },
  'Explore Tours': { en: 'Explore Tours', es: 'Explorar tours' },
  'Travel Date': { en: 'Travel Date', es: 'Fecha de viaje' },
  'Booked On': { en: 'Booked On', es: 'Reservado el' },
  'Participants': { en: 'Participants', es: 'Participantes' },
  'Person': { en: 'Person', es: 'Persona' },
  'People': { en: 'People', es: 'Personas' },
  'Total Price': { en: 'Total Price', es: 'Precio total' },
  'Pay Now': { en: 'Pay Now', es: 'Pagar ahora' },
  'Cancel': { en: 'Cancel', es: 'Cancelar' },
  'Leave Review': { en: 'Leave Review', es: 'Dejar reseña' },
  'Review Submitted': { en: 'Review Submitted', es: 'Reseña enviada' },
  'View Tour': { en: 'View Tour', es: 'Ver tour' },
  'Are you sure you want to cancel this booking?': { en: 'Are you sure you want to cancel this booking?', es: '¿Seguro que deseas cancelar esta reserva?' },
};

interface LanguageContextValue {
	language: SupportedLanguage;
	setLanguage: (lang: SupportedLanguage) => void;
	// translate helper
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_KEY = 'app_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguageState] = useState<SupportedLanguage>('en');

	useEffect(() => {
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
			if (saved === 'en' || saved === 'es') setLanguageState(saved);
		} catch {}
	}, []);

	const setLanguage = (lang: SupportedLanguage) => {
		setLanguageState(lang);
		try {
			localStorage.setItem(STORAGE_KEY, lang);
		} catch {}
	};

	const t = useMemo(() => {
		return (key: string) => {
			const dict = TRANSLATIONS[key];
			if (dict) return dict[language] || key;
			return key;
		};
	}, [language]);

	const value = useMemo(() => ({ language, setLanguage, t }), [language]);

	return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		// Graceful fallback to avoid crashing if a page renders outside the provider
		let lang: SupportedLanguage = 'en';
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage | null;
			if (saved === 'en' || saved === 'es') lang = saved;
		} catch {}
		const t = (key: string) => {
			const dict = TRANSLATIONS[key];
			return dict ? (dict[lang] || key) : key;
		};
		const setLanguage = (l: SupportedLanguage) => {
			try { localStorage.setItem(STORAGE_KEY, l); } catch {}
		};
		return { language: lang, setLanguage, t } as LanguageContextValue;
	}
	return ctx;
}
