export const SHIP_PROMISE = "Expédié sous 48 h avant le 20 décembre.";

export const types = [
  { id: "bougies", label: "Bougies" },
  { id: "papier", label: "Papier" },
  { id: "soie", label: "Soie" },
  { id: "coffrets", label: "Coffrets" },
  { id: "voyage", label: "Voyage" },
] as const;

export type TypeId = (typeof types)[number]["id"];

export const recipients = [
  {
    id: "hote",
    label: "L’hôte",
    line: "Recevoir, puis retrouver le silence.",
    essay:
      "Vous êtes la personne qui sait où sont les verres, et qui a déjà prévu le pain du lendemain. Ici, rien n’est là pour « faire Noël » sur la table. La bougie attend que la porte se referme. Le carnet garde les allergies, les places, le menu que l’on avait juré de ne pas resservir. Le coffret rassemble les trois gestes — flamme, papier, allumettes longues — pour qui reçoit vraiment.",
  },
  {
    id: "invite",
    label: "L’invité",
    line: "Arriver léger, repartir reposé.",
    essay:
      "Dormir dans une pièce qui n’est pas la sienne, traverser une cuisine inconnue au matin, repartir sans avoir abusé du canapé. Le masque de soie marine coupe le jour trop tôt. Les chaussettes cachemire évitent le carrelage froid. Ce sont des cadeaux d’invité : petits dans un sac, justes une fois la maison endormie.",
  },
  {
    id: "duo",
    label: "Le duo",
    line: "À deux, sans public.",
    essay:
      "Le réveillon n’a pas besoin d’un troisième couvert pour compter. Deux tasses, un chocolat qui se rompt, une bougie basse. Le masque si l’on veut encore une heure. Le cachemire si le 25 se passe sur le canapé. On offre un rythme, pas un spectacle.",
  },
  {
    id: "appartement",
    label: "L’appartement",
    line: "La fête sans le sapin.",
    essay:
      "Pas assez de hauteur, pas l’envie d’épines dans le parquet, parfois pas même un balcon. L’appartement fête quand même. Le diffuseur tient une résine douce, un zeste, un bois vert — sans guirlande. La bougie, ensuite, marque l’heure où les pièces redeviennent à vous.",
  },
  {
    id: "voyageur",
    label: "Le voyageur",
    line: "Le 24, dans le train.",
    essay:
      "Le 24 est parfois un quai, un siège côté couloir, une arrivée après que les autres ont déjà passé à table. Le set tient dans un sac : masque, carnet de poche, baume. Rien qui sonne comme un cadeau acheté sur le pouce. De quoi traverser la nuit la plus longue sans faire semblant d’être déjà arrivé.",
  },
  {
    id: "difficile",
    label: "Le difficile à contenter",
    line: "Utile, beau, et c’est tout.",
    essay:
      "Cette personne a déjà les objets, ou n’aime pas qu’on décide du superflu à sa place. On lui offre un outil : le coupe-papier pour le courrier qui existe encore, le cachemire pour un matin sans programme, le parfum d’appartement si elle refuse le sapin. Et, si l’on veut un geste qui ne se rattrape pas en janvier, l’édition numérotée — vingt-quatre pièces, puis plus rien.",
  },
] as const;

export type RecipientId = (typeof recipients)[number]["id"];

export const priceBands = [
  { id: "moins-40", label: "Moins de 40 €", min: 0, max: 39.99 },
  { id: "40-70", label: "40 à 70 €", min: 40, max: 70 },
  { id: "70-120", label: "70 à 120 €", min: 70.01, max: 120 },
  { id: "120-plus", label: "120 € et plus", min: 120, max: Infinity },
] as const;

export const sorts = [
  { id: "maison", label: "Ordre de la maison" },
  { id: "prix-asc", label: "Prix croissant" },
  { id: "prix-desc", label: "Prix décroissant" },
  { id: "nom", label: "Nom" },
] as const;

export type SortId = (typeof sorts)[number]["id"];

export type Variant = {
  id: string;
  label: string;
  stock: number;
};

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  type: TypeId;
  eyebrow: string;
  recipients: RecipientId[];
  pitch: string;
  description: string[];
  details: { label: string; value: string }[];
  stock: number;
  variants?: Variant[];
  limited?: number;
  featured?: boolean;
  order: number;
  images: ProductImage[];
};

export const products: Product[] = [
  {
    slug: "apres-les-invites",
    name: "Bougie « Après les invités »",
    price: 42,
    type: "bougies",
    eyebrow: "Bougies",
    recipients: ["hote", "appartement"],
    pitch: "Figue et feu de bois, pour quand la maison redevient silencieuse.",
    order: 1,
    featured: true,
    stock: 18,
    images: [
      {
        src: "/images/bougie-1.png",
        alt: "Bougie dans un verre fumé, figue coupée et copeau de bois brûlé sur une table sombre.",
      },
      {
        src: "/images/bougie-2.png",
        alt: "Vue de dessus d’une bougie éteinte, cire sombre et allumette consumée.",
      },
      {
        src: "/images/bougie-3.png",
        alt: "Bougie allumée dans un verre fumé, devant une fenêtre de nuit.",
      },
    ],
    description: [
      "Il y a une heure précise, après les invités. Les manteaux sont partis, les verres restent, et l’on n’a pas encore envie de la lumière du plafond. « Après les invités » est faite pour ce seuil : une figue mûre, un feu de bois qui retombe, rien de sucré au point de ressembler à un dessert servi trop tard.",
      "Le verre est fumé, assez lourd pour tenir sur une table encore encombrée. La flamme reste basse. On la laisse pendant que l’on débarrasse à moitié, ou que l’on ne débarrasse pas. La maison reprend son volume. L’appartement, s’il n’a pas de pièces en plus, aussi.",
      "Ce n’est pas une bougie de centre de table. C’est celle que l’hôte s’offre, ou que l’on glisse à quelqu’un qui reçoit toujours et que l’on remercie mal.",
    ],
    details: [
      { label: "Accord", value: "Figue mûre, bois brûlé, une pointe de cendre douce." },
      { label: "Matières", value: "Cire végétale, mèche de coton, verre fumé soufflé." },
      { label: "Format", value: "220 g, environ 45 heures de feu." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "menus-du-reveillon",
    name: "Carnet « Menus du réveillon »",
    price: 32,
    type: "papier",
    eyebrow: "Papier",
    recipients: ["hote"],
    pitch: "Quarante-huit pages pour les menus, les places et les allergies.",
    order: 2,
    stock: 40,
    images: [
      {
        src: "/images/carnet-1.png",
        alt: "Carnet crème ouvert sur une table sombre, stylo de laiton et carton de place.",
      },
      {
        src: "/images/carnet-2.png",
        alt: "Carnet relié toile crème, fermé, avec un ruban bordeaux et un objet de laiton.",
      },
      {
        src: "/images/carnet-3.png",
        alt: "Détail d’une page ivoire et d’un cachet de cire bordeaux.",
      },
    ],
    description: [
      "Le réveillon se joue souvent sur un détail que l’on croyait avoir en tête : qui ne mange pas de crustacés, qui doit être loin de son ancien collègue, ce que l’on avait promis de ne pas resservir d’une année sur l’autre. Le carnet n’est pas un journal. C’est l’outil de la personne qui reçoit.",
      "Quarante-huit pages de vergé ivoire, cousues, avec des gabarits discrets : menus, plan de table, notes d’allergies, une page pour les restes du 25. L’écriture reste la vôtre. Rien n’est imprimé en lettres dorées « Joyeux Noël ». La couverture est une toile crème, le signet un bordeaux sourd.",
      "Il tient à côté des planches, se rouvre en avril si l’on reçoit encore, et évite le téléphone gras au milieu du service.",
    ],
    details: [
      { label: "Pages", value: "48 pages : menus, places, allergies, restes." },
      { label: "Matières", value: "Papier vergé ivoire 120 g, toile crème, couture apparente, signet bordeaux." },
      { label: "Format", value: "13 × 21 cm." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "le-25-au-matin",
    name: "Masque de soie « Le 25 au matin »",
    price: 48,
    type: "soie",
    eyebrow: "Soie",
    recipients: ["invite", "duo"],
    pitch: "Soie marine nuit, pour l’heure que l’on reprend.",
    order: 3,
    featured: true,
    stock: 22,
    images: [
      {
        src: "/images/masque-1.png",
        alt: "Masque de soie marine plié sur du linge crème, liseré or et figue sèche.",
      },
      {
        src: "/images/masque-2.png",
        alt: "Masque de soie nuit enroulé sur un marbre sombre, piping doré.",
      },
      {
        src: "/images/masque-3.png",
        alt: "Masque de soie posé sur un oreiller crème, dans une chambre encore sombre.",
      },
    ],
    description: [
      "Le 25 au matin n’a pas à commencer les yeux ouverts. Les volets de l’invité sont souvent ceux du salon, et le duo, lui, n’a simplement pas fini sa nuit. Le masque est en soie marine, presque noire, avec un liseré d’or brûlé qui ne brille que de près.",
      "L’envers est satin, l’élastique gainé, la coupe assez couvrante pour le jour d’hiver qui entre quand même. Il se glisse dans une poche de manteau ou sous l’oreiller d’appoint. On peut l’offrir à celui qui dort chez vous, ou le garder à deux — il existe aussi dans le set de train, mais celui-ci reste à la maison.",
      "Ce n’est pas un accessoire de voyage déguisé en cadeau. C’est une heure de plus, offerte proprement.",
    ],
    details: [
      { label: "Matières", value: "Soie de mûrier 22 mommes, envers satin, élastique gainé, liseré or brûlé." },
      { label: "Couleur", value: "Marine nuit." },
      { label: "Taille", value: "Unique." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "sapin-dappartement",
    name: "Diffuseur « Sapin d’appartement »",
    price: 56,
    type: "bougies",
    eyebrow: "Parfum",
    recipients: ["appartement", "difficile"],
    pitch: "La résine, sans aiguilles dans le parquet.",
    order: 4,
    stock: 15,
    images: [
      {
        src: "/images/diffuseur-1.png",
        alt: "Diffuseur en céramique sombre, tiges claires, branche de sapin et zeste sur un appui de fenêtre la nuit.",
      },
      {
        src: "/images/diffuseur-2.png",
        alt: "Gros plan de tiges de rotin sortant d’un flacon charbon, aiguille de sapin et zeste d’orange.",
      },
      {
        src: "/images/diffuseur-3.png",
        alt: "Diffuseur sur le rebord d’une fenêtre d’appartement, lumières de ville en arrière-plan, sans sapin.",
      },
    ],
    description: [
      "Certains appartements n’auront pas de sapin, et ce n’est pas un manque. Pas la hauteur, pas l’envie d’épines entre les lames, pas le besoin d’un arbre pour savoir que c’est décembre. « Sapin d’appartement » tient la partie que l’on veut garder : une résine douce, un zeste, un bois vert qui ne colle pas aux vêtements.",
      "Le flacon est une céramique mate, couleur charbon, assez petit pour une console ou le rebord d’une fenêtre. Les tiges de rotin se remplacent dans le geste, pas dans un mode d’emploi. Il parfume une pièce pendant environ quatre semaines, sans flamme — utile là où la bougie ne peut pas rester allumée toute la journée.",
      "On le range avec les bougies parce qu’il fait le même travail : changer l’air de la pièce, pas la décorer. Pour l’appartement, et pour la personne difficile à contenter qui refuse la guirlande mais pas l’odeur du dehors.",
    ],
    details: [
      { label: "Accord", value: "Résine douce, zeste d’orange, cèdre. Sans colorant." },
      { label: "Matières", value: "Flacon céramique mate charbon, 120 ml, tiges de rotin." },
      { label: "Tenue", value: "Environ quatre semaines dans une pièce." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "la-maison-qui-recoit",
    name: "Coffret hôte « La maison qui reçoit »",
    price: 128,
    type: "coffrets",
    eyebrow: "Coffrets",
    recipients: ["hote"],
    pitch: "La bougie, le carnet, et des allumettes assez longues.",
    order: 5,
    featured: true,
    stock: 12,
    images: [
      {
        src: "/images/coffret-hote-1.png",
        alt: "Coffret ouvert : bougie en verre fumé, carnet crème et allumettes longues à manches de laiton.",
      },
      {
        src: "/images/coffret-hote-2.png",
        alt: "Vue de dessus du coffret hôte, bougie, carnet et allumettes sur bois sombre.",
      },
      {
        src: "/images/coffret-hote-3.png",
        alt: "Détail d’allumettes longues noires dans un étui de laiton, bord de carnet et cire.",
      },
    ],
    description: [
      "« La maison qui reçoit » rassemble les trois choses que l’hôte utilise vraiment, et que l’on oublie de lui offrir parce qu’elles ne ressemblent pas à un cadeau. La bougie « Après les invités », le carnet des menus, et un étui d’allumettes longues — celles qui atteignent une mèche au fond d’un verre sans se brûler les doigts.",
      "Les allumettes ne sont pas vendues seules. Leur manche est gainé, l’étui est laiton brossé, la tête noire. Elles servent le 24, puis le reste de l’hiver, pour la cheminée ou simplement pour cette bougie-là.",
      "Le coffret est une boîte de bois foncé, fermée par un ruban crème. Il passe le seuil sans papier brillant. À l’intérieur, les objets sont calés, prêts à sortir le soir même.",
    ],
    details: [
      { label: "Contenu", value: "Bougie « Après les invités », carnet « Menus du réveillon », étui de 30 allumettes longues." },
      { label: "Matières", value: "Bois foncé, laiton brossé, cire, verre fumé, papier vergé, toile." },
      { label: "Format", value: "Boîte 28 × 18 × 10 cm." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "les-voeux",
    name: "Coupe-papier laiton « Les vœux »",
    price: 36,
    type: "papier",
    eyebrow: "Papier",
    recipients: ["hote", "difficile"],
    pitch: "Pour le courrier de fin d’année, celui qui existe encore.",
    order: 6,
    stock: 28,
    images: [
      {
        src: "/images/coupe-papier-1.png",
        alt: "Coupe-papier en laiton patiné posé sur des enveloppes crème cachetées de cire bordeaux.",
      },
      {
        src: "/images/coupe-papier-2.png",
        alt: "Lame de laiton d’un coupe-papier, lumière de bougie, papier crème.",
      },
      {
        src: "/images/coupe-papier-3.png",
        alt: "Coupe-papier, pile d’enveloppes et flamme basse sur un bureau de nuit.",
      },
    ],
    description: [
      "Il arrive encore, le courrier de fin d’année. Pas seulement les cartes que l’on ouvre du pouce : les enveloppes un peu trop belles pour être déchirées, les vœux d’un oncle, d’un atelier, d’une voisine. « Les vœux » est un coupe-papier de laiton, assez lourd, avec une patine qui ne cherche pas à imiter l’ancien.",
      "La lame ouvre sans arracher. Le manche tient dans la main sans cérémonie. On le laisse dans le tiroir du bureau ou sur la pile, et il sert en janvier encore, quand les papiers reviennent.",
      "C’est le cadeau pour l’hôte qui écrit les remerciements, et pour la personne difficile à contenter : un outil, pas une intention.",
    ],
    details: [
      { label: "Matières", value: "Laiton massif brossé, patine claire." },
      { label: "Format", value: "18 cm, lame courte, bout arrondi." },
      { label: "Usage", value: "Courrier, cartes, pages non coupées." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "canape-du-25",
    name: "Chaussettes cachemire « Canapé du 25 »",
    price: 44,
    type: "soie",
    eyebrow: "Cachemire",
    recipients: ["invite", "duo", "difficile"],
    pitch: "Le seul programme raisonnable du matin.",
    order: 7,
    stock: 25,
    variants: [
      { id: "sm", label: "S/M", stock: 14 },
      { id: "l", label: "L", stock: 11 },
    ],
    images: [
      {
        src: "/images/chaussettes-1.png",
        alt: "Deux paires de chaussettes cachemire pliées, bordeaux et marine, sur un canapé sombre.",
      },
      {
        src: "/images/chaussettes-2.png",
        alt: "Gros plan de la maille cachemire bordeaux, fibres souples.",
      },
      {
        src: "/images/chaussettes-3.png",
        alt: "Chaussettes cachemire marine pliées sur un coussin de lin crème.",
      },
    ],
    description: [
      "Le 25 au matin, le programme tient parfois en une pièce : le canapé. « Canapé du 25 » est une paire de chaussettes en cachemire, maille fine, sans motif de fête, dans un bordeaux profond ou un marine nuit selon les pièces — la couleur varie légèrement d’une paire à l’autre, le ton reste sombre.",
      "Elles sont pour l’invité qui traverse l’appartement, pour le duo qui ne remet pas ses chaussures, pour quelqu’un à qui l’on n’ose plus offrir d’objet. Le cachemire est tricoté serré au talon, plus souple sur le coup de pied. On les porte vraiment, elles ne restent pas dans un tiroir « pour les grandes occasions ».",
      "Deux tailles : S/M et L. Le stock est tenu séparément. Si une taille manque, l’autre n’est pas un lot de consolation — elle est simplement l’autre pointure.",
    ],
    details: [
      { label: "Matières", value: "Cachemire, maille fine, talon renforcé. Teinture bordeaux ou marine nuit." },
      { label: "Tailles", value: "S/M (36–40) et L (41–45)." },
      { label: "Entretien", value: "Lavage à la main, à froid. Séchage à plat." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "reveillon-a-deux",
    name: "Coffret duo « Réveillon à deux »",
    price: 96,
    type: "coffrets",
    eyebrow: "Coffrets",
    recipients: ["duo"],
    pitch: "Deux tasses, le chocolat, une bougie basse.",
    order: 8,
    stock: 10,
    images: [
      {
        src: "/images/coffret-duo-1.png",
        alt: "Deux tasses en céramique, chocolat noir rompu et bougie basse sur une table pour deux.",
      },
      {
        src: "/images/coffret-duo-2.png",
        alt: "Vue de dessus de deux tasses, d’un carré de chocolat et d’une bougie dans une coupelle de laiton.",
      },
      {
        src: "/images/coffret-duo-3.png",
        alt: "Détail d’un chocolat noir cassé et du bord d’une tasse crème, flamme en arrière-plan.",
      },
    ],
    description: [
      "« Réveillon à deux » suppose que la table n’a pas besoin de rallonge. Deux tasses en céramique — l’une crème, l’autre charbon — un chocolat noir à croquer, une bougie basse dans une coupelle de laiton. La bougie n’est pas « Après les invités » : elle est plus courte, prévue pour le temps d’un dîner, pas pour le lendemain des autres.",
      "Le chocolat est une tablette simple, 70 %, sans inclusion festive. On la rompt. Les tasses passent du vin chaud au café du matin sans changer de vaisselle. Rien dans le coffret n’oblige à un discours.",
      "C’est le cadeau du duo, ou celui que l’on s’offre quand on a dit non aux grandes tablées. La boîte est plate, elle se glisse sous un bras.",
    ],
    details: [
      { label: "Contenu", value: "Deux tasses céramique 18 cl, tablette de chocolat noir 70 % (80 g), bougie basse coupelle laiton (environ 12 heures)." },
      { label: "Matières", value: "Céramique émaillée, cacao, cire végétale, laiton." },
      { label: "Format", value: "Boîte 32 × 22 × 8 cm." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "le-train-du-24",
    name: "Set voyage « Le train du 24 »",
    price: 62,
    type: "voyage",
    eyebrow: "Voyage",
    recipients: ["voyageur"],
    pitch: "Masque, carnet de poche, baume. Le couloir, pas la suite.",
    order: 9,
    stock: 16,
    images: [
      {
        src: "/images/voyage-1.png",
        alt: "Set de voyage sur un siège sombre : masque de soie marine, carnet de poche et boîte de baume en laiton, fenêtre de nuit.",
      },
      {
        src: "/images/voyage-2.png",
        alt: "Masque plié, petit carnet crème et boîte ronde de laiton, vus de dessus.",
      },
      {
        src: "/images/voyage-3.png",
        alt: "Boîte de baume en laiton ouverte, carnet de poche, lumières floues d’un trajet de nuit.",
      },
    ],
    description: [
      "Le train du 24 sent le chauffage et le manteau mouillé. « Le train du 24 » tient dans une trousse de laine sombre : un masque de soie marine — le même geste que « Le 25 au matin », en format de poche —, un carnet minuscule pour l’heure d’arrivée, le quai, le nom de celui qui vient vous chercher, et un baume pour les mains que l’air sec des wagons abîme.",
      "Le baume est dans une boîte de laiton. Cire, huile, rien qui parfume tout le compartiment. Le carnet a trente-deux pages, pas quarante-huit : ce n’est pas le carnet des menus, c’est celui du trajet.",
      "On l’offre à qui voyage pour arriver, pas pour l’idée du voyage. Il sert aussi au retour du 26, quand les cadeaux sont déjà derrière.",
    ],
    details: [
      { label: "Contenu", value: "Masque de soie format poche, carnet 9 × 14 cm (32 pages), baume mains 15 ml en boîte laiton, trousse laine." },
      { label: "Matières", value: "Soie, papier vergé, cire et huile végétale, laiton, laine." },
      { label: "Format", value: "Trousse 22 × 12 cm." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
  {
    slug: "la-nuit-la-plus-longue",
    name: "Édition « La nuit la plus longue »",
    price: 180,
    type: "coffrets",
    eyebrow: "Coffrets",
    recipients: ["difficile"],
    pitch: "Le coffret complet, numéroté. Vingt-quatre pièces.",
    order: 10,
    limited: 24,
    stock: 24,
    images: [
      {
        src: "/images/edition-1.png",
        alt: "Coffret de bois ouvert contenant bougie, soie, carnet, laiton et linge, dans une pièce sombre.",
      },
      {
        src: "/images/edition-2.png",
        alt: "Coffret de bois fermé, plaque de laiton vierge et ruban de lin crème sur marbre noir.",
      },
      {
        src: "/images/edition-3.png",
        alt: "Intérieur d’un coffret doublé de papier crème, objets calés sous une lumière chaude.",
      },
    ],
    description: [
      "« La nuit la plus longue » est le coffret de la capsule, et il s’arrête à vingt-quatre. Chaque boîte est numérotée à la main, de 1 à 24, dans l’ordre des commandes. Quand la série est close, elle ne revient pas en janvier sous un autre nom.",
      "À l’intérieur, chaque geste de la maison, en formats ajustés à la boîte : la bougie figue et feu de bois, le carnet des menus, le masque de soie, le diffuseur d’appartement, le coupe-papier, une paire de chaussettes cachemire à la maille plus souple (du 36 au 45, pour ne pas choisir à la place de quelqu’un), les deux tasses et le chocolat, le baume et le carnet de poche du train. Ce n’est pas l’addition des prix à l’unité. C’est une composition, calée dans du bois foncé et du papier crème.",
      "On l’offre à la personne difficile à contenter, ou l’on se l’offre si l’on veut que la nuit la plus longue tienne sur une seule console. Le numéro vous est confirmé sur la page de commande : il correspond aux pièces encore libres.",
    ],
    details: [
      { label: "Série", value: "24 exemplaires numérotés. Stock réel, non renouvelé." },
      { label: "Contenu", value: "Bougie, carnet, masque, diffuseur, coupe-papier, chaussettes du 36 au 45, deux tasses, chocolat, baume et carnet de poche." },
      { label: "Matières", value: "Bois foncé, papier crème, soie, cachemire, laiton, céramique, cire." },
      { label: "Format", value: "Boîte 36 × 26 × 14 cm." },
      { label: "Envoi", value: SHIP_PROMISE },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getRecipient(id: string) {
  return recipients.find((recipient) => recipient.id === id);
}

export function getType(id: string) {
  return types.find((type) => type.id === id);
}

export function productStock(product: Product, variantId?: string) {
  if (product.variants) {
    if (!variantId) return product.variants.reduce((sum, variant) => sum + variant.stock, 0);
    return product.variants.find((variant) => variant.id === variantId)?.stock ?? 0;
  }
  return product.stock;
}

export function variantOf(product: Product, variantId?: string) {
  if (!variantId || !product.variants) return undefined;
  return product.variants.find((variant) => variant.id === variantId);
}

function fold(value: string) {
  return value
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

export type ShopQuery = {
  type?: string;
  destinataire?: string;
  prix?: string;
  tri?: string;
  q?: string;
};

export function filterProducts(query: ShopQuery) {
  let list = products.slice();

  if (query.type && types.some((type) => type.id === query.type)) {
    list = list.filter((product) => product.type === query.type);
  }

  if (query.destinataire && recipients.some((item) => item.id === query.destinataire)) {
    list = list.filter((product) => product.recipients.includes(query.destinataire as RecipientId));
  }

  const band = priceBands.find((item) => item.id === query.prix);
  if (band) {
    list = list.filter((product) => product.price >= band.min && product.price <= band.max);
  }

  if (query.q) {
    const needle = fold(query.q.trim());
    if (needle) {
      list = list.filter((product) => fold(product.name).includes(needle));
    }
  }

  const tri = query.tri ?? "maison";
  if (tri === "prix-asc") list.sort((a, b) => a.price - b.price || a.order - b.order);
  else if (tri === "prix-desc") list.sort((a, b) => b.price - a.price || a.order - b.order);
  else if (tri === "nom") list.sort((a, b) => a.name.localeCompare(b.name, "fr"));
  else list.sort((a, b) => a.order - b.order);

  return list;
}

export function relatedProducts(slug: string, limit = 3) {
  const current = getProduct(slug);
  if (!current) return [];
  return products
    .filter((product) => product.slug !== slug)
    .map((product) => {
      const sameType = product.type === current.type ? 2 : 0;
      const shared = product.recipients.filter((id) => current.recipients.includes(id)).length;
      return { product, score: sameType + shared * 3 };
    })
    .sort((a, b) => b.score - a.score || a.product.order - b.product.order)
    .slice(0, limit)
    .map((item) => item.product);
}

export function shopHref(current: ShopQuery, patch: Partial<Record<keyof ShopQuery, string | null>>) {
  const next: ShopQuery = { ...current };
  for (const [key, value] of Object.entries(patch) as [keyof ShopQuery, string | null][]) {
    if (!value) delete next[key];
    else next[key] = value;
  }
  const params = new URLSearchParams();
  if (next.type) params.set("type", next.type);
  if (next.destinataire) params.set("destinataire", next.destinataire);
  if (next.prix) params.set("prix", next.prix);
  if (next.tri && next.tri !== "maison") params.set("tri", next.tri);
  const query = params.toString();
  return query ? `/boutique?${query}` : "/boutique";
}

export const FREE_SHIPPING_FROM = 120;
export const SHIPPING_STANDARD = 6;
export const SHIPPING_EXPRESS = 14;
export const PROMO_CODE = "SOLSTICE10";

export function shippingCents(method: "standard" | "express", subtotalCents: number) {
  if (method === "express") return SHIPPING_EXPRESS * 100;
  if (subtotalCents >= FREE_SHIPPING_FROM * 100) return 0;
  return SHIPPING_STANDARD * 100;
}
