export const useDonationModal = () => {
  const isOpen = useState('donation_modal_open', () => false)

  const open = () => {
    isOpen.value = true
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    open,
    close
  }
}
