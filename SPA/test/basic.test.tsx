import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/views/App'

describe('App test', () => {
  it('Should render Application view', () => {
    render(<App />)

    expect(screen.getByText(/^ElectricGo Log In$/i)).toBeDefined()
  })
})
