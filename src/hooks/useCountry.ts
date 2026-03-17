import { useState, useEffect } from 'react'

export type Country = 'ireland' | 'uk'

/**
 * Persistent country preference — stored in localStorage so the user only
 * picks once. Defaults to Ireland if not previously set.
 */
export function useCountry() {
  const [country, setCountryState] = useState<Country>(() => {
    const stored = localStorage.getItem('workguard_country')
    return stored === 'uk' ? 'uk' : 'ireland'
  })

  useEffect(() => {
    localStorage.setItem('workguard_country', country)
  }, [country])

  const setCountry = (c: Country) => setCountryState(c)

  return { country, setCountry }
}
