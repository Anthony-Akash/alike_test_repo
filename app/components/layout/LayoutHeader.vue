<script setup lang="ts">
import { useWindowScroll } from '@vueuse/core'
import { ChevronDown, Menu, X } from 'lucide-vue-next'

const VD_BASE = 'https://www.visitdubai.com'

const { locale, locales, setLocale } = useI18n()
const { trackHeaderSelect, trackHeaderNestedLink } = useTracking()

type LocaleCode = 'en' | 'ar'

interface SubItem {
  title: string
  description: string
  href: string
}

interface FeaturedCard {
  title: string
  href: string
  image: string
  imageAlt: string
}

interface NavItem {
  title: string
  href: string
  children?: SubItem[]
  featured?: FeaturedCard
  mobileOnly?: boolean
  desktopClass?: string
}

interface Platform {
  id: string
  name: string
  href: string
  logo: string
  logoWidth: number
  logoHeight: number
  style: string
}

const platforms = computed<Platform[]>(() => {
  const lang = locale.value
  return [
    { id: 'visitdubai', name: 'Visit Dubai', href: `https://www.visitdubai.com/${lang}/`, logo: '/icons/dubai.svg', logoWidth: 79, logoHeight: 30, style: '' },
    { id: 'investindubai', name: 'Invest in Dubai', href: `https://www.investindubai.gov.ae/${lang}/`, logo: '/icons/invest-in-dubai.svg', logoWidth: 79, logoHeight: 30, style: 'max-w-20' },
    { id: 'dubaidet', name: 'Dubai DET', href: `https://www.dubaidet.gov.ae/${lang}/`, logo: '/icons/dubai-det.svg', logoWidth: 79, logoHeight: 100, style: 'max-h-12' },
    { id: 'dubaifoundershq', name: 'Dubai Founders HQ', href: `https://www.dubaifoundershq.com/${lang}/`, logo: '/icons/dubai-founders-hq.svg', logoWidth: 79, logoHeight: 100, style: 'max-h-14! min-w-10' },
  ]
})

const selectedPlatformId = ref<string>('visitdubai')
const selectedPlatform = computed(() => platforms.value.find((p) => p.id === selectedPlatformId.value) ?? platforms.value[0]!)

const activeMenu = ref<string | null>(null)
const showAdvisory = ref(true)

function selectPlatform(platform: Platform) {
  selectedPlatformId.value = platform.id
  window.open(platform.href, '_blank', 'noopener,noreferrer')
  // trackEvent({ event_name: 'platform_switch', label: platform.name })
}
const mobileOpen = ref(false)
const mobileExpandedItem = ref<string | null>(null)
const { smoothScrollTo } = useScroll()

const navItemsEn: NavItem[] = [
  {
    title: 'Home',
    href: `${VD_BASE}/en/`,
  },
  {
    title: 'Explore Dubai',
    href: `${VD_BASE}/en/explore-dubai`,
    children: [
      {
        title: 'About Dubai',
        description: 'Welcome to a sun-soaked metropolis like no other',
        href: `${VD_BASE}/en/explore-dubai/about-dubai`,
      },
      {
        title: 'Dubai Interactive Map',
        description: 'Discover nearby events, top attractions, restaurants and more',
        href: `${VD_BASE}/en/explore-dubai/dubai-interactive-map`,
      },
      {
        title: 'Real Madrid X Dubai',
        description: "Join Real Madrid stars as they uncover Dubai's top attractions",
        href: `${VD_BASE}/en/real-madrid`,
      },
      {
        title: 'Dubai Neighbourhoods',
        description: 'Every district in Dubai tells its own unique story',
        href: `${VD_BASE}/en/explore-dubai/dubai-neighbourhoods`,
      },
      {
        title: 'Local culture',
        description: "Admire the city's traditional arts, crafts and cultural gems",
        href: `${VD_BASE}/en/explore-dubai/local-culture-and-heritage`,
      },
      {
        title: 'Weddings & Celebrations',
        description: 'Plan your dream wedding in an unforgettable destination',
        href: `${VD_BASE}/en/explore-dubai/weddings-in-dubai`,
      },
      {
        title: 'Adventures in Hatta',
        description: 'Escape to the hills and explore nature',
        href: `${VD_BASE}/en/beyond-dubai/nature-adventures-in-hatta`,
      },
      {
        title: 'Discover Al Marmoom',
        description: 'Answer the call of the wild and experience desert thrills',
        href: `${VD_BASE}/en/beyond-dubai/bedouin-experience-in-al-marmoom`,
      },
    ],
    featured: {
      title: 'Meet our curators',
      href: `${VD_BASE}/en/explore-dubai/curators`,
      image: `${VD_BASE}/-/media/gathercontent/article/t/the-best-malls-in-dubai/media/the-best-malls-in-dubai-emirates-mall-shop-4.jpg?rev=ce17915ea257432ab84b837a2d28ba5e&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'Mall of the Emirates in Dubai',
    },
  },
  {
    title: 'Things to do',
    href: `${VD_BASE}/en/things-to-do`,
    children: [
      {
        title: 'Arts & Culture',
        description: "Uncover the city's rich heritage and vibrant arts scene",
        href: `${VD_BASE}/en/things-to-do/arts-and-culture`,
      },
      {
        title: 'Experiences',
        description: 'Embark on thrilling new adventures for all ages',
        href: `${VD_BASE}/en/things-to-do/experiences`,
      },
      {
        title: 'Food & Drink',
        description: 'Taste award-winning world flavours and local cuisine',
        href: `${VD_BASE}/en/things-to-do/eat-and-drink`,
      },
      {
        title: 'New & Trending',
        description: 'Visit the latest hotspots, openings and attractions',
        href: `${VD_BASE}/en/things-to-do/new-and-trending`,
      },
      {
        title: 'Shopping',
        description: 'Find new surprises at modern malls and traditional souks',
        href: `${VD_BASE}/en/things-to-do/shopping`,
      },
      {
        title: 'Sights & Attractions',
        description: 'Marvel at record-breaking venues and iconic landmarks',
        href: `${VD_BASE}/en/things-to-do/dubai-attractions`,
      },
      {
        title: 'Wellness in Dubai',
        description: 'Plan an active holiday with wellness experiences in Dubai',
        href: `${VD_BASE}/en/things-to-do/wellness-in-dubai`,
      },
      {
        title: 'Itineraries',
        description: 'What do you travel for? Find inspiration with our itineraries',
        href: `${VD_BASE}/en/things-to-do/itineraries`,
      },
    ],
    featured: {
      title: '99 things to do in Dubai',
      href: `${VD_BASE}/en/articles/99-things-to-do-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/poi/b/bluewaters-island/fallback-image/bluewater-dtcm-04.jpg?rev=7f670fa087ef407a98dadfb39458ca15&cx=0.57&cy=0.99&cw=216&ch=160`,
      imageAlt: 'Bluewaters Island Dubai',
    },
  },
  {
    title: 'Eat & Drink',
    href: `${VD_BASE}/en/things-to-do/eat-and-drink`,
    desktopClass: 'hidden xl:flex',
    children: [
      {
        title: 'Dubai Restaurant Week',
        description: 'Taste the best the city has to offer as Dubai Restaurant Week returns',
        href: `${VD_BASE}/en/things-to-do/eat-and-drink/dubai-restaurant-week`,
      },
      {
        title: 'New restaurants',
        description: 'Book a table at these fresh hotspots',
        href: `${VD_BASE}/en/articles/new-restaurants-to-try`,
      },
      {
        title: 'Michelin Guide Dubai 2025',
        description: 'See all the restaurants unveiled in the Dubai selection',
        href: `${VD_BASE}/en/things-to-do/eat-and-drink/michelin`,
      },
      {
        title: 'Dining deals',
        description: 'Reserve a table at top restaurants for incredible prices',
        href: `${VD_BASE}/en/deals-and-offers/dining-deals`,
      },
      {
        title: 'Restaurants in Dubai',
        description: "Discover Dubai's top dining experiences with our restaurant guide",
        href: `${VD_BASE}/en/things-to-do/eat-and-drink/dubai-best-restaurants`,
      },
    ],
    featured: {
      title: "Taste Dubai's best Emirati food",
      href: `${VD_BASE}/en/articles/emirati-food-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/article/e/emirati-food-in-dubai/fallback-image/emirati-food-in-dubai-emirati-fish-header.jpg?rev=b46c514a8bcb49a495b3c974754a743e&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'Emirati food in Dubai',
    },
  },
  {
    title: 'Events & Festivals',
    href: `${VD_BASE}/en/festivals-and-events`,
    desktopClass: 'hidden 2xl:flex',
    children: [
      {
        title: 'Dubai Calendar',
        description: "Don't miss a beat – live concerts, festivals, activities and more",
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar`,
      },
      {
        title: 'Dubai Restaurant Week',
        description: 'Dine at your favourite Dubai restaurants for less',
        href: `${VD_BASE}/en/things-to-do/eat-and-drink/dubai-restaurant-week`,
      },
      {
        title: 'Ivan Vasiliev: The Last Dance',
        description: 'Watch the farewell performance of the celebrated ballet dancer',
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/ivan-vasiliev-last-dance`,
      },
      {
        title: 'Dubai Esports and Games Festival',
        description: 'Get your controllers ready for the ultimate gaming festival',
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/dubai-esports-and-games-festival`,
      },
      {
        title: 'PFL Mena 9: Pride of Arabia',
        description: 'Enjoy a night of high-energy MMA action',
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/pfl-mena`,
      },
      {
        title: 'Dubai Summer Surprises',
        description: 'Experience the most value-packed edition ever',
        href: `${VD_BASE}/en/festivals-and-events/dss`,
      },
    ],
    featured: {
      title: 'La Perle by Dragone',
      href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/la-perle`,
      image: `${VD_BASE}/-/media/dotsite/images/5-0-newsroom/2021/la-perle.jpg?rev=9de5f9f7efc043d9a754e7f0415824b1&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'La Perle show in Dubai',
    },
  },
  {
    title: 'Plan your trip',
    href: `${VD_BASE}/en/plan-your-trip`,
    desktopClass: 'hidden 2xl:flex',
    children: [
      {
        title: 'Visa guide',
        description: 'Plan ahead for a hassle-free travel experience',
        href: `${VD_BASE}/en/plan-your-trip/visa-information`,
      },
      {
        title: 'Essentials',
        description: 'From etiquette to currency, we answer all your questions',
        href: `${VD_BASE}/en/plan-your-trip/practical-information`,
      },
      {
        title: 'Flights',
        description: 'Use our tool to book flight tickets to Dubai and plan your trip to the city',
        href: `${VD_BASE}/en/plan-your-trip/book-your-flight`,
      },
      {
        title: 'Accommodation',
        description: 'Dubai has an incredible range of stay options for every budget',
        href: `${VD_BASE}/en/plan-your-trip/places-to-stay`,
      },
      {
        title: 'Getting to Dubai',
        description: 'From take-off to touchdown, making your way to Dubai is a breeze',
        href: `${VD_BASE}/en/plan-your-trip/getting-to-dubai`,
      },
      {
        title: 'Getting around Dubai',
        description: 'Seamlessly travel across the city, hassle-free',
        href: `${VD_BASE}/en/plan-your-trip/getting-around-dubai`,
      },
      {
        title: 'Safety',
        description: "Your complete guide to enjoying one of the world's safest cities to the fullest",
        href: `${VD_BASE}/en/plan-your-trip/safety-in-dubai`,
      },
      {
        title: 'Weather',
        description: "Find out all about Dubai's climate throughout the year with our weather guide",
        href: `${VD_BASE}/en/plan-your-trip/weather-in-dubai`,
      },
      {
        title: 'Currency',
        description: 'All you need to know about the dirham, from exchange rates to helpful tips',
        href: `${VD_BASE}/en/plan-your-trip/currency`,
      },
      {
        title: 'Accessibility',
        description: 'Helpful information for travellers with special needs',
        href: `${VD_BASE}/en/plan-your-trip/travel-accessibility`,
      },
      {
        title: 'Dubai attractions passes',
        description: 'Unlock huge savings with pre-paid access to top spots',
        href: `${VD_BASE}/en/plan-your-trip/dubai-pass`,
      },
      {
        title: 'Download apps',
        description: 'Get our apps for the latest attractions, events & itineraries',
        href: `${VD_BASE}/en/plan-your-trip/dubai-apps`,
      },
    ],
    featured: {
      title: "Discover Dubai's best new hotels",
      href: `${VD_BASE}/en/articles/new-hotels-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/article/n/new-hotels-in-dubai/media/th8-palm-dubai-beach-resort-vignette-collection-2-official-website.jpeg?rev=6c5c0e5720fe43a9a04c82f8c94ec2c0&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'The Palm Dubai Beach Resort',
    },
  },
  {
    title: 'Deals & Offers',
    href: `${VD_BASE}/en/deals-and-offers`,
    children: [
      {
        title: 'Attraction deals',
        description: "Save big with great offers on Dubai's top sights and activities",
        href: `${VD_BASE}/en/deals-and-offers/attraction-deals`,
      },
      {
        title: 'Dining deals',
        description: 'Reserve a table at top restaurants for incredible prices',
        href: `${VD_BASE}/en/deals-and-offers/dining-deals`,
      },
      {
        title: 'Shopping deals',
        description: 'Indulge in retail therapy for less with big discounts',
        href: `${VD_BASE}/en/deals-and-offers/shopping-deals`,
      },
      {
        title: 'Hotel deals',
        description: 'Enjoy a trip to Dubai with incredible accommodation offers',
        href: `${VD_BASE}/en/deals-and-offers/hotel-deals`,
      },
    ],
  },
  {
    title: 'Dubai Calendar',
    href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar`,
    mobileOnly: true,
    children: [
      {
        title: 'Family-friendly events',
        description: 'Sign up for kid-friendly activities or attend a live show with the entire family',
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/family-events`,
      },
      {
        title: 'Live entertainment',
        description: 'Get tickets to the best concerts featuring A-list artists at world-class venues',
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/live-entertainment`,
      },
      {
        title: 'Sports events',
        description: "Join Dubai's community sporting activities and race to the finish line for a thrilling contest",
        href: `${VD_BASE}/en/festivals-and-events/dubai-events-calendar/sports-events`,
      },
    ],
  },
]

const navItemsAr: NavItem[] = [
  {
    title: 'الرئيسية',
    href: `${VD_BASE}/ar/`,
  },
  {
    title: 'اكتشف دبي',
    href: `${VD_BASE}/ar/explore-dubai`,
    children: [
      {
        title: 'نبذة عن دبي',
        description: 'أهلاً بك في مدينةٍ عصرية لا مثيل لها',
        href: `${VD_BASE}/ar/explore-dubai/about-dubai`,
      },
      {
        title: 'خريطة دبي التفاعلية',
        description: 'اكتشف أبرز الفعاليات والوجهات والمطاعم في أنحاء المدينة',
        href: `${VD_BASE}/ar/explore-dubai/dubai-interactive-map`,
      },
      {
        title: 'أحياء ومناطق دبي',
        description: 'لكل حيّ في دبي قصّته المُميّزة',
        href: `${VD_BASE}/ar/explore-dubai/dubai-neighbourhoods`,
      },
      {
        title: 'التاريخ والتراث',
        description: 'اكتشف الفنون والحرف والمعالم الثقافية في المدينة',
        href: `${VD_BASE}/ar/explore-dubai/local-culture-and-heritage`,
      },
      {
        title: 'حفلات الزفاف والاحتفالات',
        description: 'خطِّط لحفل زفاف مثالي في دبي',
        href: `${VD_BASE}/ar/explore-dubai/weddings-in-dubai`,
      },
      {
        title: 'المغامرات في حتا',
        description: 'اكتشف المناطق الجبليّة والطبيعة الرائعة',
        href: `${VD_BASE}/ar/beyond-dubai/nature-adventures-in-hatta`,
      },
      {
        title: 'صحراء المرموم',
        description: 'اكتشف الحياة البرية واختبر مغامراتٍ رائعة في الصحراء',
        href: `${VD_BASE}/ar/beyond-dubai/bedouin-experience-in-al-marmoom`,
      },
    ],
    featured: {
      title: 'تعرف على خبراء دبي',
      href: `${VD_BASE}/ar/explore-dubai/curators`,
      image: `${VD_BASE}/-/media/gathercontent/article/t/the-best-malls-in-dubai/media/the-best-malls-in-dubai-emirates-mall-shop-4.jpg?rev=ce17915ea257432ab84b837a2d28ba5e&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'Mall of the Emirates in Dubai',
    },
  },
  {
    title: 'الأنشطة والتجارب',
    href: `${VD_BASE}/ar/things-to-do`,
    children: [
      {
        title: 'الفنون والثقافة والتراث',
        description: 'تعرّف على تراث المدينة الغني وفنونها النابضة بالحياة',
        href: `${VD_BASE}/ar/things-to-do/arts-and-culture`,
      },
      {
        title: 'المغامرات والتجارب',
        description: 'استمتع بمغامرات استثنائية واحتفظ بذكريات لا تُنسى',
        href: `${VD_BASE}/ar/things-to-do/experiences`,
      },
      {
        title: 'تجارب الطعام',
        description: 'تذوق أشهى المأكولات والنكهات المحلية والعالمية',
        href: `${VD_BASE}/ar/things-to-do/eat-and-drink`,
      },
      {
        title: 'أحدث الوجهات والفعاليات',
        description: 'لا تفوّت زيارة أحدث الوجهات والمعالم السياحية في المدينة',
        href: `${VD_BASE}/ar/things-to-do/new-and-trending`,
      },
      {
        title: 'التسوّق',
        description: 'اختبر تجربة تسوق مُذهلة في مراكز التسوق العصرية والأسواق التراثية',
        href: `${VD_BASE}/ar/things-to-do/shopping`,
      },
      {
        title: 'المعالم السياحية',
        description: 'استكشف أبرز المعالم السياحية والترفيهية في المدينة',
        href: `${VD_BASE}/ar/things-to-do/dubai-attractions`,
      },
      {
        title: '"السبا" والمنتجعات الصحية',
        description: 'خطّط لإجازة مليئة بالهدوء والراحة واستمتع بعلاجات "السبا" المُميزة',
        href: `${VD_BASE}/ar/things-to-do/wellness-in-dubai`,
      },
      {
        title: 'برامج الرحلات',
        description: 'اطّلع على برامج رحلاتنا واستكشف دبي بالشكل الأمثل',
        href: `${VD_BASE}/ar/things-to-do/itineraries`,
      },
    ],
    featured: {
      title: '99 نشاطاً يمكنك القيام به في دبي',
      href: `${VD_BASE}/ar/articles/99-things-to-do-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/poi/b/bluewaters-island/fallback-image/bluewater-dtcm-04.jpg?rev=7f670fa087ef407a98dadfb39458ca15&cx=0.57&cy=0.99&cw=216&ch=160`,
      imageAlt: 'Bluewaters Island Dubai',
    },
  },
  {
    title: 'المطاعم والمأكولات',
    href: `${VD_BASE}/ar/things-to-do/eat-and-drink`,
    desktopClass: 'hidden xl:flex',
    children: [
      {
        title: 'أسبوع دبي للمطاعم',
        description: 'تذوقوا أفضل ما تقدمه المدينة مع أسبوع المطاعم في دبي',
        href: `${VD_BASE}/ar/things-to-do/eat-and-drink/dubai-restaurant-week`,
      },
      {
        title: 'مطاعم جديدة',
        description: 'احجز طاولتك في إحدى هذه الوجهات المميّزة',
        href: `${VD_BASE}/ar/articles/new-restaurants-to-try`,
      },
      {
        title: 'دليل ميشلان 2025',
        description: 'اطلع على المطاعم التي أُدرجت في النسخة الرابعة من دليل "ميشلان" لمطاعم دبي',
        href: `${VD_BASE}/ar/things-to-do/eat-and-drink/michelin`,
      },
      {
        title: 'المطاعم في دبي',
        description: 'تعرف على أفضل المطاعم في دبي من خلال هذا الدليل',
        href: `${VD_BASE}/ar/things-to-do/eat-and-drink/dubai-best-restaurants`,
      },
    ],
    featured: {
      title: 'تذوّق أشهى المأكولات الإماراتية في دبي',
      href: `${VD_BASE}/ar/articles/emirati-food-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/article/e/emirati-food-in-dubai/fallback-image/emirati-food-in-dubai-emirati-fish-header.jpg?rev=b46c514a8bcb49a495b3c974754a743e&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'Emirati food in Dubai',
    },
  },
  {
    title: 'المهرجانات والفعاليات',
    href: `${VD_BASE}/ar/festivals-and-events`,
    desktopClass: 'hidden 2xl:flex',
    children: [
      {
        title: 'جدول فعاليات دبي',
        description: 'حفلات موسيقية ومهرجانات ونشاطات ترفيهيّة وغير ذلك الكثير',
        href: `${VD_BASE}/ar/festivals-and-events/dubai-events-calendar`,
      },
      {
        title: 'أسبوع دبي للمطاعم',
        description: 'استمتع بأطباقٍ شهية مقابل أسعارٍ استثنائية',
        href: `${VD_BASE}/ar/things-to-do/eat-and-drink/dubai-restaurant-week`,
      },
      {
        title: 'مفاجآت صيف دبي',
        description: 'تخفيضات وعروض مُذهلة وجوائز قيمة في أنحاء المدينة',
        href: `${VD_BASE}/ar/festivals-and-events/dss`,
      },
    ],
    featured: {
      title: '"لا بيرل باي دراغون"',
      href: `${VD_BASE}/ar/festivals-and-events/dubai-events-calendar/la-perle`,
      image: `${VD_BASE}/-/media/dotsite/images/5-0-newsroom/2021/la-perle.jpg?rev=9de5f9f7efc043d9a754e7f0415824b1&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'La Perle show in Dubai',
    },
  },
  {
    title: 'خطّط لرحلتك',
    href: `${VD_BASE}/ar/plan-your-trip`,
    desktopClass: 'hidden 2xl:flex',
    children: [
      {
        title: 'التأشيرة ومعلومات الدخول',
        description: 'خطّط مسبقاً لتجربة سفرٍ مريحة',
        href: `${VD_BASE}/ar/plan-your-trip/visa-information`,
      },
      {
        title: 'معلومات مفيدة',
        description: 'نجيب على جميع أسئلتك التي تتعلّق بدبي',
        href: `${VD_BASE}/ar/plan-your-trip/practical-information`,
      },
      {
        title: 'احجز رحلتك',
        description: 'استخدم هذه الأداة للبحث عن تذاكر سفر إلى دبي وابدأ بالتخطيط لرحلتك المُقبلة',
        href: `${VD_BASE}/ar/plan-your-trip/book-your-flight`,
      },
      {
        title: 'الإقامة',
        description: 'اكتشف الكثير من خيارات الإقامة المناسبة لكل الميزانيات',
        href: `${VD_BASE}/ar/plan-your-trip/places-to-stay`,
      },
      {
        title: 'السفر إلى دبي',
        description: 'تتميز دبي بموقعها الاستراتيجي الذي يُتيح الوصول إليها بسهولة من مختلف أنحاء العالم',
        href: `${VD_BASE}/ar/plan-your-trip/getting-to-dubai`,
      },
      {
        title: 'التنقل في أنحاء دبي',
        description: 'تجوّل في المدينة واستكشف أبرز الأحياء والمناطق بمنتهى السهولة',
        href: `${VD_BASE}/ar/plan-your-trip/getting-around-dubai`,
      },
      {
        title: 'الأمان في دبي',
        description: 'اطلع على هذا الدليل الشامل للاستمتاع بإجازة رائعة في واحدة من أكثر مدن العالم أماناً',
        href: `${VD_BASE}/ar/plan-your-trip/safety-in-dubai`,
      },
      {
        title: 'الطقس',
        description: 'اكتشف المزيد عن الطقس في دبي خلال أشهر السنة باستخدام دليل الطقس الخاص بنا',
        href: `${VD_BASE}/ar/plan-your-trip/weather-in-dubai`,
      },
      {
        title: 'دليل العملة الرسمية',
        description: 'اطلع على أسعار الصرف والعديد من النصائح المفيدة الأخرى',
        href: `${VD_BASE}/ar/plan-your-trip/currency`,
      },
      {
        title: 'تسهيلات وخدمات السفر',
        description: 'معلومات مفيدة للمسافرين من ذوي الهمم',
        href: `${VD_BASE}/ar/plan-your-trip/travel-accessibility`,
      },
      {
        title: 'بطاقة دبي',
        description: 'بطاقة مسبقة الدفع تُتيح لك زيارة أبرز المعالم والوجهات الترفيهية في دبي بتكلفة أقل',
        href: `${VD_BASE}/ar/plan-your-trip/dubai-pass`,
      },
      {
        title: 'نزل تطبيقاتنا',
        description: 'اكتشف أحدث الوجهات السياحية والفعاليات وبرامج الرحلات عبر تطبيقاتنا',
        href: `${VD_BASE}/ar/plan-your-trip/dubai-apps`,
      },
    ],
    featured: {
      title: 'أفضل الفنادق الجديدة في دبي 2026',
      href: `${VD_BASE}/ar/articles/new-hotels-in-dubai`,
      image: `${VD_BASE}/-/media/gathercontent/article/n/new-hotels-in-dubai/media/th8-palm-dubai-beach-resort-vignette-collection-2-official-website.jpeg?rev=6c5c0e5720fe43a9a04c82f8c94ec2c0&cx=0.5&cy=0.5&cw=216&ch=160`,
      imageAlt: 'The Palm Dubai Beach Resort',
    },
  },
  {
    title: 'جدول فعاليات دبي',
    href: `${VD_BASE}/ar/festivals-and-events/dubai-events-calendar`,
    mobileOnly: true,
  },
]

const navItems = computed(() => locale.value === 'ar' ? navItemsAr : navItemsEn)

const desktopNavItems = computed(() => navItems.value.filter((item) => !item.mobileOnly))

const activeMenuItem = computed(() => {
  if (!activeMenu.value) return null
  return navItems.value.find((item) => item.title === activeMenu.value) ?? null
})

const normalizedLocales = computed(() =>
  locales.value.map((l) => (typeof l === 'string' ? { code: l, name: l } : l)),
)

const currentLocaleName = computed(() => {
  const found = normalizedLocales.value.find((l) => l.code === locale.value)
  return found ? (found.name ?? found.code) : locale.value
})

function trackLogoClick(label: string) {
  trackHeaderSelect(label)
}

const closeTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function openDesktopMenu(item: NavItem) {
  cancelClose()
  activeMenu.value = item.children ? item.title : null
}

function scheduleClose() {
  closeTimer.value = setTimeout(() => {
    activeMenu.value = null
  }, 150)
}

function cancelClose() {
  if (closeTimer.value) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
}

function closeDesktopMenu() {
  cancelClose()
  activeMenu.value = null
}

function handleDesktopNestedClick(child: SubItem) {
  const label = activeMenuItem.value?.title
  closeDesktopMenu()
  if (label) trackHeaderNestedLink(label, child.title)
}

function toggleMobileItem(item: NavItem) {
  if (!item.children) return
  mobileExpandedItem.value = mobileExpandedItem.value === item.title ? null : item.title
}

function selectLocale(code: string) {
  setLocale(code as LocaleCode)
  if (import.meta.client) {
    setTimeout(() => {
      window.location.reload()
    }, 1000)
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeDesktopMenu()
}

watch(mobileOpen, (isOpen) => {
  if (!isOpen) mobileExpandedItem.value = null
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})

const { y: scrollY } = useWindowScroll()

const showHeaderShadow = computed(() => scrollY.value >= 20 || !!activeMenuItem.value?.children)

const scrollToSection = (sectionId: string) => {
  const el = document.getElementById(sectionId)
  if (el) smoothScrollTo(el, 1000)
}
</script>

<template>
  <!-- Travel Advisory Ribbon -->
  <div
    v-if="showAdvisory"
    class="relative flex items-center justify-center bg-primary-vd px-2 py-3 text-sm text-white md:px-4 md:text-base"
  >
    <div class="container-main flex items-center justify-between px-6 text-start">
      <div class="text-body font-normal">
        {{ $t('header.advisoryText') }}
        <a
          :href="`https://www.visitdubai.com/${locale}/travel-advisory`"
          target="_blank"
          class="text-body font-normal underline underline-offset-4 hover:text-gray-200"
        >
          {{ $t('header.advisoryLinkText') }}
        </a>
      </div>
      <button
        class="flex text-white hover:cursor-pointer hover:text-gray-200"
        aria-label="Close"
        @click="showAdvisory = false"
      >
        <Icon
          name="lets-icons:close-square"
          class="size-4! md:size-5!"
        />
      </button>
    </div>
  </div>

  <!-- Sticky header + mega menu wrapper -->
  <div class="sticky top-0 z-50">
    <!-- Main header bar -->
    <header
      class="relative z-50 h-17.5 bg-white md:h-22"
      :class="showHeaderShadow ? 'border-b border-outline shadow-[0_8px_12px_rgba(0,0,0,0.04)]' : ''"
    >
      <div class="container-main flex h-full items-center px-xl">
        <!-- Left: Hamburger (mobile) + GOD logo -->
        <div class="flex shrink-0 items-center">
          <button
            class="flex items-center justify-center rounded-full border border-[#F3F4F6] p-1.75 md:hidden"
            aria-label="Open menu"
            @click="mobileOpen = true"
          >
            <!-- <Menu class="size-4.5" /> -->
            <Icon
              name="ic:round-menu"
              class="size-6! text-on-surface-variant md:text-muted-foreground"
            />
          </button>

          <a
            href="https://www.dubai.ae/"
            target="_blank"
            rel="noopener noreferrer"
            class="hidden shrink-0 items-center md:flex"
            @click="trackLogoClick('logo of dubai goverment')"
          >
            <img
              src="/icons/god.svg"
              :alt="$t('header.govOfDubai')"
              class="h-12 w-auto"
              width="120"
              height="48"
            >
          </a>
        </div>

        <!-- Center: Desktop navigation -->
        <nav
          class="ms-xl hidden items-center lg:flex"
          aria-label="Main navigation"
        >
          <template
            v-for="item in desktopNavItems"
            :key="item.title"
          >
            <a
              v-if="!item.children"
              :href="item.href"
              target="_blank"
              class="h-9 items-center rounded-pill px-md ps-lg text-caption font-medium text-black hover:text-primary"
              :class="item.desktopClass || 'flex'"
              @mouseenter="openDesktopMenu(item)"
              @click="trackHeaderSelect(item.title)"
            >
              {{ item.title }}
            </a>
            <a
              v-else
              :href="item.href"
              target="_blank"
              class="h-9 items-center gap-xs rounded-pill ps-lg pe-md text-caption! font-medium tracking-[1%]! transition-colors"
              :class="[
                item.desktopClass || 'flex',
                activeMenu === item.title ? 'text-primary' : 'text-black hover:bg-surface-dim',
                item.title?.toLowerCase()?.includes('deals & offers') && 'bg-primary text-white hover:bg-white hover:text-primary',
              ]"
              :aria-expanded="activeMenu === item.title"
              @mouseenter="openDesktopMenu(item)"
              @mouseleave="scheduleClose"
              @click="trackHeaderSelect(item.title)"
            >
              {{ item.title }}
              <ChevronDown
                class="size-5 transition-transform duration-200"
                :class="{ 'rotate-180': activeMenu === item.title }"
              />
            </a>
          </template>
        </nav>

        <!-- Right: Search + Language + VD logo -->
        <div class="flex w-full flex-row-reverse items-center justify-between md:ms-auto md:w-auto md:flex-row md:gap-md">
          <!-- Search icon (desktop) -->
          <button
            class="flex size-10 cursor-pointer items-center justify-center rounded-full  border border-[#F3F4F6] p-1.5 md:border-none md:p-2"
            aria-label="Search"
            @click="scrollToSection('explore-sec')"
          >
            <Icon
              name="ic:round-search"
              class="icon-chevron size-7! text-on-surface-variant md:size-6.5! md:text-on-surface"
            />
          </button>

          <!-- Language selector (desktop) -->
          <DropdownMenu>
            <DropdownMenuTrigger
              class="hidden items-center gap-sm text-caption font-medium text-on-surface outline-none md:flex"
            >
              {{ currentLocaleName }}
              <ChevronDown class="size-5 text-on-surface-variant" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                v-for="loc in normalizedLocales"
                :key="loc.code"
                @click="selectLocale(loc.code)"
              >
                {{ loc.name ?? loc.code }}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Platform selector -->
          <DropdownMenu>
            <DropdownMenuTrigger
              class="flex shrink-0 cursor-pointer items-center gap-sm ps-md outline-none"
              :aria-label="`Current platform: ${selectedPlatform.name}`"
            >
              <img
                :src="selectedPlatform.logo"
                :alt="selectedPlatform.name"
                class="max-h-8 min-h-7 w-auto"
                :width="selectedPlatform.logoWidth"
                :height="selectedPlatform.logoHeight"
                :class="selectedPlatform.style"
              >
              <ChevronDown class="size-5! min-w-5! text-on-surface-variant" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              class="flex w-full min-w-45 flex-col items-center p-2"
            >
              <DropdownMenuItem
                v-for="platform in platforms"
                :key="platform.id"
                class="flex w-full cursor-pointer items-center rounded p-2"
                :class="selectedPlatform.id === platform.id ? 'bg-surface-dim' : ''"
                @click="selectPlatform(platform)"
              >
                <img
                  :src="platform.logo"
                  :alt="platform.name"
                  class="mx-auto max-h-12 min-h-5"
                  :class="platform.style"
                  :width="platform.logoWidth"
                  :height="platform.logoHeight"
                >
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>

    <!-- Desktop mega menu panel -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="activeMenuItem?.children"
        class="absolute inset-x-0 top-full z-1 container-app hidden overflow-hidden rounded-b-lg bg-white shadow-[0_8px_12px_rgba(0,0,0,0.12)] lg:block"
        @mouseenter="cancelClose"
        @mouseleave="scheduleClose"
      >
        <div class="container-main px-3xl pt-xxl pb-12.5">
          <div class="flex">
            <!-- Sub-items grid -->
            <div class="flex-1 pr-5">
              <div class="grid grid-cols-4 gap-x-4 gap-y-4">
                {{ console.log('@something', activeMenuItem.title) }}
                <a
                  v-for="child in activeMenuItem.children"
                  :key="child.title"
                  target="_blank"
                  rel="noopener noreferrer"
                  :href="child.href"
                  class="group flex min-h-12 flex-col rounded-[8px] py-sm"
                  @click="handleDesktopNestedClick(child)"
                >
                  <span class="text-[18px] leading-[28px] font-medium text-black group-hover:text-primary-vd">
                    {{ child.title }}
                  </span>
                  <span class="line-clamp-2 text-caption leading-[20px] tracking-[0.14px] text-on-surface-variant">
                    {{ child.description }}
                  </span>
                </a>
              </div>
            </div>

            <!-- Featured card -->
            <div
              v-if="activeMenuItem.featured"
              class="w-69.25 shrink-0 border-s border-outline ps-13"
            >
              <a
                :href="activeMenuItem.featured.href"
                class="group block w-56.25 overflow-hidden rounded-lg"
                target="_blank"
                rel="noopener noreferrer"
                @click="closeDesktopMenu"
              >
                <div class="relative h-40 w-full overflow-hidden rounded-lg">
                  <img
                    :src="activeMenuItem.featured.image"
                    :alt="activeMenuItem.featured.imageAlt"
                    class="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  >
                  <div class="absolute inset-0 rounded-lg bg-black/10" />
                </div>
                <div class="bg-surface-bright p-xl">
                  <span class="text-[18px] font-medium text-black">
                    {{ activeMenuItem.featured.title }}
                  </span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>

  <!-- Backdrop overlay for desktop mega menu -->
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="activeMenu"
      class="fixed inset-0 z-40 hidden bg-black/5 lg:block"
      @click="closeDesktopMenu"
    />
  </Transition>

  <!-- Mobile drawer -->
  <Sheet v-model:open="mobileOpen">
    <SheetContent
      side="left"
      class="flex w-full max-w-lvw flex-col border-outline p-0 [&>button]:hidden"
    >
      <SheetTitle class="sr-only">
        Navigation menu
      </SheetTitle>
      <SheetDescription class="sr-only">
        Main site navigation
      </SheetDescription>

      <!-- Mobile drawer top bar -->
      <div class="flex h-18 shrink-0 items-center justify-between px-xl">
        <SheetClose as-child>
          <button
            class="flex size-10 items-center justify-center rounded-full border border-gray-100 bg-white/80 backdrop-blur-[4px]"
            aria-label="Close menu"
          >
            <X class="size-6 text-on-surface-variant" />
          </button>
        </SheetClose>

        <a
          href="https://www.dubai.ae/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/icons/god.svg"
            alt="Government of Dubai"
            class="h-12 w-auto"
            width="120"
            height="48"
          >
        </a>
      </div>

      <!-- Mobile nav items (scrollable) -->
      <div class="flex-1 overflow-y-auto px-xl pb-md">
        <div
          v-for="item in navItems"
          :key="item.title"
        >
          <!-- Nav item without children -->
          <a
            v-if="!item.children"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex min-h-10 items-center border-b border-outline px-lg text-body font-medium text-black"
            @click="trackHeaderSelect(item.title)"
          >
            {{ item.title }}
          </a>

          <!-- Nav item with children -->
          <template v-else>
            <button
              class="flex min-h-12 w-full items-center justify-between px-lg text-body font-medium transition-colors"
              :class="mobileExpandedItem === item.title
                ? 'rounded-[8px] bg-primary-vd text-white'
                : 'border-b border-outline text-black'"
              :aria-expanded="mobileExpandedItem === item.title"
              @click="toggleMobileItem(item); trackHeaderSelect(item.title)"
            >
              {{ item.title }}
              <ChevronDown
                class="size-6 transition-transform duration-200"
                :class="{ 'rotate-180': mobileExpandedItem === item.title }"
              />
            </button>

            <!-- Expanded sub-items -->
            <div v-if="mobileExpandedItem === item.title">
              <a
                v-for="(child, idx) in item.children"
                :key="child.title"
                :href="child.href"
                target="_blank"
                class="flex min-h-12 items-center bg-[#f0f5fc] px-lg text-body font-medium text-black"
                :class="{
                  'rounded-t-[8px]': idx === 0,
                  'rounded-b-[8px]': idx === (item.children?.length ?? 0) - 1,
                  'border-b border-white': idx < (item.children?.length ?? 0) - 1,
                }"
                @click="trackHeaderNestedLink(item.title, child.title)"
              >
                {{ child.title }}
              </a>
            </div>
          </template>
        </div>
      </div>

      <!-- Mobile bottom bar: Language pill -->
      <div class="shrink-0 border-t border-outline bg-white px-xl pt-lg pb-xxl shadow-[0_-24px_28px_rgba(0,0,0,0.02)]">
        <DropdownMenu>
          <DropdownMenuTrigger
            class="flex h-10 w-full items-center justify-center gap-xs rounded-pill border border-outline text-body font-medium text-primary-vd"
          >
            {{ currentLocaleName }}
            <ChevronDown class="size-6 text-primary-vd" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem
              v-for="loc in normalizedLocales"
              :key="loc.code"
              @click="selectLocale(loc.code)"
            >
              {{ loc.name ?? loc.code }}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </SheetContent>
  </Sheet>
</template>
