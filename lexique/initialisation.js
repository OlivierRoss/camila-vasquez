var config = {
  ecran: {
    largeur: 0,
    hauteur: 0
  },
  souris: { x: null, y: null },
  touch: { x: null, y: null },
  vitesse_translation: 1.3,
  temps_apparition_definition: 2000,
  positions_images_tuiles: [
    { x: "3%", y: "4%" },
    { x: "7%", y: "15%" },
    { x: "1%", y: "75%" },
    { x: "10%", y: "35%" },
    { x: "46%", y: "20%" },
    { x: "33%", y: "45%" },
    { x: "74%", y: "64%" },
    { x: "81%", y: "92%" },
    { x: "51%", y: "52%" },
    { x: "31%", y: "72%" },
    { x: "58%", y: "82%" },
    { x: "78%", y: "2%" },
    { x: "89%", y: "72%" }
  ],
  tuiles: {
    vitesse_maj_tuiles_visibles: 250,
    translate: { x: 0, y: 0 },
    taille: { 
      x: { valeur: 200, unite: "vw" },
      y: { valeur: 200, unite: "vh" },
    },
    sources: [
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
    liste: []
  }
}

window.onload = function () {

  // Traduire les elements texte
  init_traduction();
  config.textes = traiter_textes();

  // Element
  let canva = document.getElementById("animation-lexique");
  config.canva = canva;

  // Dimensions animation
  let bounding = canva.getBoundingClientRect();
  config.ecran.largeur = bounding.width;
  config.ecran.hauteur = bounding.height;

  // Appliquer une transformation sur chaque image
  canva.addEventListener("wheel", translation_scroll);
  canva.addEventListener("mousedown", commencer_translation);
  canva.addEventListener("mouseup", terminer_translation);
  canva.addEventListener("touchstart", commencer_translation_touch);
  canva.addEventListener("touchend", terminer_translation_touch);

  // Creer la premiere tuile
  new Tuile({x: 0, y: 0}, creer_images());

  // Mise à jour des tuiles visibles
  window.setInterval( maj_tuiles_visibles, config.tuiles.vitesse_maj_tuiles_visibles);
}

function afficher_definition_interpretation (src_image, texte) {
  let modal = document.getElementById("modal-interpretation");

  // Afficher les definitions
  modal.style.display = "block";
  modal.querySelector("img").src = src_image;
  modal.querySelector("p").innerHTML = texte;
}

function cacher_definition_interpretation () {

  // Afficher les tuiles
  [].forEach.call(document.querySelectorAll(".tuile"), (tuile) => {
    tuile.style.opacity = "1";
  });

  let modal = document.getElementById("modal-interpretation");
  modal.style.display = "none";
}

function afficher_definition_officielle (src_image, texte) {

  // Cacher les tuiles
  [].forEach.call(document.querySelectorAll(".tuile"), (tuile) => {
    tuile.style.opacity = "0";
  });

  let modal = document.getElementById("modal-officiel");

  modal.style.display = "block";
  modal.querySelector("img").src = src_image;
  modal.querySelector("p").innerHTML = texte;
}

function cacher_definition_officielle () {

  let modal = document.getElementById("modal-officiel");
  modal.style.display = "none";
}

function commencer_translation (e) {
  e.stopPropagation();
  e.preventDefault();

  config.souris.x = null;
  config.souris.y = null;

  config.canva.addEventListener("mousemove", translation);
}

function commencer_translation_touch (e) {
  e.stopPropagation();
  e.preventDefault();

  config.touch.x = null;
  config.touch.y = null;

  config.canva.addEventListener("touchmove", translation_touch);
}

function terminer_translation (e) {
  e.stopPropagation();
  e.preventDefault();

  config.canva.removeEventListener("mousemove", translation);
}

function terminer_translation_touch (e) {
  e.stopPropagation();
  e.preventDefault();

  config.canva.removeEventListener("touchmove", translation_touch);
}

function translation_touch (e) {
  e.stopPropagation();
  e.preventDefault();

  let x0 = config.touch.x;
  let y0 = config.touch.y;

  config.touch.x = e.touches[0].screenX;
  config.touch.y = e.touches[0].screenY;

  if(x0 == null && y0 == null) return;

  let delta_x = config.touch.x - x0;
  let delta_y = config.touch.y - y0;

  config.tuiles.translate.x += delta_x * config.vitesse_translation;
  config.tuiles.translate.y += delta_y * config.vitesse_translation;

  config.tuiles.liste.forEach((tuile) => { appliquer_transform_tuile(tuile); });
}

function translation (e) {
  e.stopPropagation();
  e.preventDefault();

  let x0 = config.souris.x;
  let y0 = config.souris.y;

  config.souris.x = e.clientX;
  config.souris.y = e.clientY;

  if(x0 == null && y0 == null) return;

  let delta_x = config.souris.x - x0;
  let delta_y = config.souris.y - y0;

  config.tuiles.translate.x += delta_x * config.vitesse_translation;
  config.tuiles.translate.y += delta_y * config.vitesse_translation;

  config.tuiles.liste.forEach((tuile) => { appliquer_transform_tuile(tuile); });
}

function translation_scroll (ev) {
  ev.stopPropagation();
  ev.preventDefault();

  config.tuiles.translate.x += Math.sign(ev.deltaX) * -1 * config.vitesse_translation * 3;
  config.tuiles.translate.y += Math.sign(ev.deltaY) * -1 * config.vitesse_translation * 3;

  config.tuiles.liste.forEach((image) => { appliquer_transform_tuile(image); });
} 
