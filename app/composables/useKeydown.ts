export function useKeydown(callback: (e: KeyboardEvent) => void) {
  onMounted(() => {
    document.addEventListener('keydown', callback)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', callback)
  })
}