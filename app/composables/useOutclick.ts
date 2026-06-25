export function useOutclick() {
  // const { trackEvent } = useTracking()

  function handleOutclick(deal: { category: string, title: string, externalUrl: string }) {
    // trackEvent({
    //   event_name: 'outclick',
    //   event_cat: 'Deals',
    //   event_act: `Outclick : ${deal.category}`,
    //   event_lab: deal.title,
    //   outclick_url: deal.externalUrl,
    // })

    if (import.meta.client) {
      window.open(deal.externalUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return { handleOutclick }
}
