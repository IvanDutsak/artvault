

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: number;
  category: ArtCategory;
  description: string;
  price: number;
  image: string;
  dimensions: string;
  medium: string;
  featured: boolean;
}

export type ArtCategory =
  | "Ренесанс"
  | "Імпресіонізм"
  | "Бароко"
  | "Модернізм"
  | "Сюрреалізм"
  | "Абстракціонізм";

export const categories: ArtCategory[] = [
  "Ренесанс",
  "Імпресіонізм",
  "Бароко",
  "Модернізм",
  "Сюрреалізм",
  "Абстракціонізм",
];

export const artworks: Artwork[] = [
  {
    id: "1",
    title: "Тосканський Захід",
    artist: "Марко Россетті",
    year: 1487,
    category: "Ренесанс",
    description: "Величний пейзаж Тоскани з кіпарисами та середньовічним замком на пагорбі. Теплі золоті відтінки заходу сонця створюють атмосферу спокою та вічності. Класична композиція з глибиною та перспективою у стилі великих майстрів Відродження.",
    price: 45000,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390828783/42KexusuZjroriTj2ubQwq/painting-renaissance-3VQ5fJgToiqGPYtXNAYy45.webp",
    dimensions: "120 × 180 см",
    medium: "Олія на полотні",
    featured: true,
  },
  {
    id: "2",
    title: "Весняний Сад",
    artist: "Клод Дюваль",
    year: 1889,
    category: "Імпресіонізм",
    description: "Паризький сад у розквіті весни з квітучими трояндами та бузком. Кам'яний фонтан у центрі композиції оточений фігурами у світлому одязі. Легкі мазки пензля передають гру сонячного світла крізь листя дерев.",
    price: 38000,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390828783/42KexusuZjroriTj2ubQwq/painting-impressionist-VevViRD2V8oyBeS94cqcv4.webp",
    dimensions: "100 × 150 см",
    medium: "Олія на полотні",
    featured: true,
  },
  {
    id: "3",
    title: "Хроматичний Діалог",
    artist: "Олександр Вебер",
    year: 1962,
    category: "Абстракціонізм",
    description: "Сміливий абстрактний твір з геометричними формами у глибоких синіх та малинових тонах з акцентами сусального золота. Динамічна композиція з широкими мазками пензля створює відчуття руху та енергії.",
    price: 52000,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390828783/42KexusuZjroriTj2ubQwq/painting-modern-QemwKUXChrz7aU4okLxvTe.webp",
    dimensions: "200 × 250 см",
    medium: "Змішана техніка на полотні",
    featured: true,
  },
  {
    id: "4",
    title: "Квіти у Золотій Вазі",
    artist: "Ян ван Хейсум",
    year: 1726,
    category: "Бароко",
    description: "Розкішний натюрморт з трояндами, тюльпанами та піонами у золотій вазі на мармуровому столі. Драматичне освітлення кьяроскуро підкреслює багатство кольорів та текстур квітів на темному тлі.",
    price: 67000,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663390828783/42KexusuZjroriTj2ubQwq/painting-baroque-Fz6aYQRWawqQGZoUFgLuCM.webp",
    dimensions: "90 × 130 см",
    medium: "Олія на дубовій панелі",
    featured: true,
  },
  {
    id: "5",
    title: "Зоряна Мелодія",
    artist: "Софія Лаврентьєва",
    year: 1934,
    category: "Сюрреалізм",
    description: "Мрійливий пейзаж де зірки перетворюються на музичні ноти, що пливуть над фантастичним містом. Поєднання реальності та уяви створює магічну атмосферу нічного концерту під відкритим небом.",
    price: 41000,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80",
    dimensions: "110 × 160 см",
    medium: "Олія на полотні",
    featured: false,
  },
  {
    id: "6",
    title: "Венеціанський Карнавал",
    artist: "Джованні Тьєполо",
    year: 1753,
    category: "Бароко",
    description: "Яскрава сцена венеціанського карнавалу з масками та костюмами. Пишність та розкіш бароко передані через багату палітру кольорів та складну композицію з безліччю деталей.",
    price: 73000,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80",
    dimensions: "150 × 200 см",
    medium: "Фреска, перенесена на полотно",
    featured: false,
  },
  {
    id: "7",
    title: "Ранкова Сутінь",
    artist: "Ельза Бергман",
    year: 1912,
    category: "Імпресіонізм",
    description: "Ніжний ранковий пейзаж з туманом над озером. Пастельні тони рожевого та блакитного створюють відчуття тиші та спокою перших хвилин нового дня.",
    price: 35000,
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=800&q=80",
    dimensions: "80 × 120 см",
    medium: "Олія на полотні",
    featured: false,
  },
  {
    id: "8",
    title: "Геометрія Душі",
    artist: "Пауль Клейн",
    year: 1955,
    category: "Модернізм",
    description: "Мінімалістична композиція з чистими геометричними формами та обмеженою палітрою. Кожен елемент ретельно вивірений для створення ідеального балансу між простотою та глибиною.",
    price: 48000,
    image: "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=800&q=80",
    dimensions: "100 × 100 см",
    medium: "Акрил на полотні",
    featured: false,
  },
  {
    id: "9",
    title: "Портрет Незнайомки",
    artist: "Леонардо Бьянкі",
    year: 1512,
    category: "Ренесанс",
    description: "Загадковий портрет молодої жінки з ледь помітною посмішкою. Техніка сфумато створює м'які переходи між тінями та світлом, надаючи обличчю майже живого вигляду.",
    price: 89000,
    image: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=800&q=80",
    dimensions: "60 × 80 см",
    medium: "Олія на тополевій панелі",
    featured: true,
  },
  {
    id: "10",
    title: "Танець Кольорів",
    artist: "Міро Танака",
    year: 1978,
    category: "Абстракціонізм",
    description: "Експресивний абстрактний твір з яскравими сплесками кольору на чорному тлі. Спонтанні мазки та крапання фарби створюють відчуття музичного ритму та свободи.",
    price: 56000,
    image: "https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=800&q=80",
    dimensions: "180 × 220 см",
    medium: "Акрил та емаль на полотні",
    featured: false,
  },
  {
    id: "11",
    title: "Сон Метелика",
    artist: "Рене Дюпон",
    year: 1928,
    category: "Сюрреалізм",
    description: "Сюрреалістична композиція де гігантський метелик несе на крилах мініатюрне місто. Деталізований реалізм окремих елементів контрастує з неможливістю загальної сцени.",
    price: 44000,
    image: "https://images.unsplash.com/photo-1482160549825-59d1b23cb208?w=800&q=80",
    dimensions: "90 × 120 см",
    medium: "Олія на полотні",
    featured: false,
  },
  {
    id: "12",
    title: "Архітектура Світла",
    artist: "Ле Корбюз'є Мл.",
    year: 1965,
    category: "Модернізм",
    description: "Монументальна композиція що досліджує взаємодію архітектурних форм та природного світла. Чисті лінії та площини створюють відчуття простору та порядку.",
    price: 62000,
    image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80",
    dimensions: "140 × 180 см",
    medium: "Олія та колаж на полотні",
    featured: false,
  },
  {
    id: "13",
    title: "Венеціанський Канал",
    artist: "Франческо Гварді",
    year: 1765,
    category: "Бароко",
    description: "Драматичний вид венеціанського каналу на заході сонця з гондолами та вишуканими мостами. Багаті золоті тони та глибокі тіні створюють атмосферу романтики старої Венеції. Майстерна техніка імпасто передає текстуру води та архітектури.",
    price: 71000,
    image: "/venetian_canal_painting_1772387565814.png",
    dimensions: "130 × 170 см",
    medium: "Олія на полотні",
    featured: true,
  },
  {
    id: "14",
    title: "Плинний Час",
    artist: "Маргіт Ковач",
    year: 1937,
    category: "Сюрреалізм",
    description: "Сюрреалістична композиція з годинниками, що тануть над мрійливим пустельним пейзажем з неможливою архітектурою. Глибока синьо-бурштинова палітра створює відчуття позачасовості та ірреальності людського сприйняття часу.",
    price: 58000,
    image: "/surrealist_clocks_painting_1772387580627.png",
    dimensions: "100 × 140 см",
    medium: "Олія на полотні",
    featured: true,
  },
  {
    id: "15",
    title: "Лавандовий Прованс",
    artist: "Аніта Дюбуа",
    year: 1894,
    category: "Імпресіонізм",
    description: "Імпресіоністський пейзаж лавандового поля у Провансі під час золотої години. Кам'яний фермерський будинок на тлі фіолетових та золотих відтінків. Видимі мазки пензля передають тремтіння світла та повітря.",
    price: 42000,
    image: "/lavender_field_painting_1772387595091.png",
    dimensions: "90 × 130 см",
    medium: "Олія на полотні",
    featured: true,
  },
];

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
}

export function getArtworkById(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}

export function getArtworksByCategory(category: ArtCategory): Artwork[] {
  return artworks.filter((a) => a.category === category);
}

export function getFeaturedArtworks(): Artwork[] {
  return artworks.filter((a) => a.featured);
}

export function searchArtworks(query: string): Artwork[] {
  const q = query.toLowerCase();
  return artworks.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.artist.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q)
  );
}
