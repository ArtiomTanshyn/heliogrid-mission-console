import { afterEach, describe, expect, it, vi } from 'vitest'
import { downloadFile, toCsv } from './csvExport'

describe('csv export helpers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns an empty string for empty rows', () => {
    expect(toCsv([])).toBe('')
  })

  it('serializes rows with stable headers and escaped values', () => {
    expect(
      toCsv([
        { operator: 'Astra Vey', notes: 'Ready, "green"', value: 12000, optional: null },
        { operator: 'Orin Sol', notes: 'Recovered', value: 8000, optional: undefined },
      ]),
    ).toBe(
      [
        'operator,notes,value,optional',
        '"Astra Vey","Ready, ""green""","12000",""',
        '"Orin Sol","Recovered","8000",""',
      ].join('\n'),
    )
  })

  it('creates and revokes a browser download URL', () => {
    const click = vi.fn()
    const appendAnchor = document.createElement('a')

    vi.spyOn(document, 'createElement').mockReturnValue(appendAnchor)
    vi.spyOn(appendAnchor, 'click').mockImplementation(click)
    const createObjectUrl = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:ledger')
    const revokeObjectUrl = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})

    downloadFile('heliogrid-operations-ledger.csv', 'operator,value', 'text/csv')

    expect(createObjectUrl).toHaveBeenCalledWith(expect.any(Blob))
    expect(appendAnchor.href).toBe('blob:ledger')
    expect(appendAnchor.download).toBe('heliogrid-operations-ledger.csv')
    expect(click).toHaveBeenCalledOnce()
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:ledger')
  })
})
