/**
 * Active une animation sur un élément en définissant sa propriété à true,
 * puis la remet à false après un certain délai.
 * 
 * @param {Ref<boolean>} ref La référence de la propriété à animer.
 * @param {number} [duration=0.2] La durée de l'animation en secondes.
 */
export function animate(ref: Ref<boolean>, duration: number = 0.2) {
  ref.value = true
  setTimeout(() => (ref.value = false), duration * 1000)
}