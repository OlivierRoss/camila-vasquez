var config = {
  images_src: [
    'madonna1.jpg',
    'madonna2.jpg',
    'madonna3.jpg',
    'madonna4.jpg',
    'madonna5.jpg',
    'madonna6.jpg',
    'madonna7.jpg',
    'madonna8.jpg',
    'madonna9.jpg',
    'madonna10.jpg',
    'madonna11.jpg',
    'madonna12.jpg'
  ],
  images: [],
  translate: { x: 0, y: 0 },
  vitesse_translation: 1.3,
  ms_animation: 45,
  positionnements: [
    { x: -1, y: -1 },
    { x: 0, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 }
  ],
  positionnement_actuel: 0,
  nb_images_initiales: 25
}

window.onload = function () {

  config.canva = document.getElementById("animation-accueil");
  config.bounding_rect_animation = config.canva.getBoundingClientRect();

  // Appliquer une transformation sur chaque image
  config.canva.addEventListener("wheel", translation_images);

  // Creer les premieres images
  for(let i = 0; i < config.nb_images_initiales; ++i) {
    config.canva.appendChild(creer_image());
  }

  // Lancer l'animation
  window.setInterval(animer_images, config.ms_animation);
}

function animer_images () {
  config.images.forEach((image) => {
    let top_px = parseFloat(image.style.top.slice(0, -2));
    let left_px = parseFloat(image.style.left.slice(0, -2));

    let deltaX = parseFloat(image.getAttribute("data-vecteur-x"));
    let deltaY = parseFloat(image.getAttribute("data-vecteur-y"));

    image.style.top = (top_px + deltaY) + "px";
    image.style.left = (left_px + deltaX) + "px";
  });
}

function translation_images (ev) {
  ev.stopPropagation();
  ev.preventDefault();

  config.translate.x += Math.sign(ev.deltaX) * config.vitesse_translation;
  config.translate.y += Math.sign(ev.deltaY) * config.vitesse_translation;

  config.images.forEach((image) => {
    image.style.transform = "translate(" + config.translate.x + "px, " + config.translate.y + "px)"
  });
}

function creer_image () {
  let img = document.createElement("img");
  config.images.push(img);

  // Info de base
  img.src = "images/" + src_image_aleatoire();
  img.className = "image-flottante"
  img.alt = "Madonna";

  // Position initiale
  positionner_image(img);

  // Deplacement
  determiner_vecteur_deplacement(img);

  // Prochaine position d'apparition
  config.positionnement_actuel = (config.positionnement_actuel + 1) % config.positionnements.length 
  
  return img; 
}

function positionner_image (image) {
  let coordonnees = { x: 10, y: 10 };

  image.style.top = coordonnees.y + "px";
  image.style.left = coordonnees.x + "px";
}

function determiner_vecteur_deplacement (image) {
  let vecteur = { };
  let pos_init = config.positionnements[config.positionnement_actuel];

  if(pos_init.x == -1) { vecteur.x = round_decimal(Math.random() - 0); }
  else if(pos_init.x == 0) { vecteur.x = round_decimal(Math.random() - 0.5); }
  else if(pos_init.x == 1) { vecteur.x = round_decimal(Math.random() - 1); }

  if(pos_init.y == -1) { vecteur.y = round_decimal(Math.random() - 0); }
  else if(pos_init.y == 0) { vecteur.y = round_decimal(Math.random() - 0.5); }
  else if(pos_init.y == 1) { vecteur.y = round_decimal(Math.random() - 1); }

  console.log(vecteur);

  image.setAttribute("data-vecteur-x", vecteur.x);
  image.setAttribute("data-vecteur-y", vecteur.y);
}

function src_image_aleatoire () {
  let index = Math.round(Math.random() * (config.images_src.length - 1));
  return config.images_src[index];
}

function round_decimal (nb) {
  return Math.round(nb * 10) / 10;
}
