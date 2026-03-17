import { useState, useEffect } from 'react'
import { Clock, Play, Square, Plus, Trash2, AlertTriangle, CheckCircle } from 'lucide-react'
import Layout from '@/components/Layout'

interface ShiftEntry {
  id: string
  date: string
  startTime: string
  endTime: string
  notes: string
  durationHours: number
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function calcDuration(start: string, end: string): number {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  const diff = (eh * 60 + em) - (sh * 60 + sm)
  return diff > 0 ? diff / 60 : 0
}

const STORAGE_KEY = 'workguard_shifts'
const RATE_KEY = 'workguard_rate'

export default function ShiftLogger() {
  const [shifts, setShifts] = useState<ShiftEntry[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch { return [] }
  })
  const [hourlyRate, setHourlyRate] = useState<number>(() =>
    parseFloat(localStorage.getItem(RATE_KEY) || '0')
  )
  const [activeTab, setActiveTab] = useState<'log' | 'add' | 'compare'>('log')
  const [isRunning, setIsRunning] = useState(false)
  const [clockStart, setClockStart] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)

  // New shift form
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '17:00',
    notes: '',
  })

  // Paid amount for comparison
  const [actualPay, setActualPay] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts))
  }, [shifts])

  useEffect(() => {
    localStorage.setItem(RATE_KEY, String(hourlyRate))
  }, [hourlyRate])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null
    if (isRunning && clockStart) {
      interval = setInterval(() => {
        setElapsed(Date.now() - clockStart.getTime())
      }, 1000)
    }
    return () => { if (interval) clearInterval(interval) }
  }, [isRunning, clockStart])

  const startClock = () => {
    setClockStart(new Date())
    setIsRunning(true)
    setElapsed(0)
  }

  const stopClock = () => {
    if (!clockStart) return
    const end = new Date()
    const duration = (end.getTime() - clockStart.getTime()) / 3600000
    const newShift: ShiftEntry = {
      id: Date.now().toString(),
      date: clockStart.toISOString().split('T')[0],
      startTime: clockStart.toTimeString().slice(0, 5),
      endTime: end.toTimeString().slice(0, 5),
      notes: '',
      durationHours: duration,
    }
    setShifts(prev => [newShift, ...prev])
    setIsRunning(false)
    setClockStart(null)
    setElapsed(0)
  }

  const addShift = () => {
    const duration = calcDuration(form.startTime, form.endTime)
    if (duration <= 0) return
    const newShift: ShiftEntry = {
      id: Date.now().toString(),
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      notes: form.notes,
      durationHours: duration,
    }
    setShifts(prev => [newShift, ...prev])
    setForm(f => ({ ...f, notes: '' }))
    setActiveTab('log')
  }

  const deleteShift = (id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id))
  }

  const totalHours = shifts.reduce((sum, s) => sum + s.durationHours, 0)
  const expectedPay = totalHours * hourlyRate
  const actual = parseFloat(actualPay) || 0
  const discrepancy = actual > 0 ? actual - expectedPay : 0
  const discrepancyStatus = discrepancy < -0.5 ? 'underpaid' : discrepancy > 0.5 ? 'overpaid' : 'ok'

  const elapsedStr = (() => {
    const s = Math.floor(elapsed / 1000)
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  })()

  // Group by week
  const grouped = shifts.reduce<Record<string, ShiftEntry[]>>((acc, s) => {
    const week = getWeekLabel(s.date)
    if (!acc[week]) acc[week] = []
    acc[week].push(s)
    return acc
  }, {})

  return (
    <Layout title="Shift Logger" showBack>
      <div className="space-y-4">
        {/* Clock-in/out */}
        <div className="card p-5 text-center">
          {isRunning ? (
            <>
              <div className="text-3xl font-mono font-bold text-white mb-2">{elapsedStr}</div>
              <p className="text-slate-400 text-sm mb-4">Shift in progress</p>
              <button onClick={stopClock} className="btn-primary bg-red-600 hover:bg-red-700 mx-auto">
                <Square size={16} />
                Clock Out
              </button>
            </>
          ) : (
            <>
              <Clock size={32} className="text-brand-400 mx-auto mb-2" />
              <p className="text-slate-400 text-sm mb-4">Tap to start your shift timer</p>
              <button onClick={startClock} className="btn-primary mx-auto">
                <Play size={16} />
                Clock In
              </button>
            </>
          )}
        </div>

        {/* Hourly rate */}
        <div className="card p-4 flex items-center gap-3">
          <div className="flex-1">
            <label className="text-xs text-slate-400 font-medium">Your hourly rate (€)</label>
            <input
              type="number"
              value={hourlyRate || ''}
              onChange={e => setHourlyRate(parseFloat(e.target.value) || 0)}
              placeholder="e.g. 13.50"
              step="0.01"
              min="0"
              className="input-field py-2 mt-1 text-sm"
            />
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">NMW (2026)</p>
            <p className="text-sm font-bold text-emerald-400">€14.15/hr</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-800/50 rounded-xl p-1">
          {([['log', 'Shift Log'], ['add', 'Add Shift'], ['compare', 'Pay Check']] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Shift Log Tab */}
        {activeTab === 'log' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">
                {shifts.length} shift{shifts.length !== 1 ? 's' : ''} · {formatDuration(totalHours)} total
              </span>
              <button onClick={() => setActiveTab('add')} className="btn-ghost text-sm py-1">
                <Plus size={14} /> Add
              </button>
            </div>

            {shifts.length === 0 ? (
              <div className="card p-6 text-center">
                <Clock size={28} className="text-slate-600 mx-auto mb-2" />
                <p className="text-slate-500 text-sm">No shifts logged yet</p>
                <button onClick={() => setActiveTab('add')} className="text-brand-400 text-sm underline mt-1">
                  Add your first shift
                </button>
              </div>
            ) : (
              Object.entries(grouped).map(([week, weekShifts]) => {
                const weekHours = weekShifts.reduce((s, sh) => s + sh.durationHours, 0)
                return (
                  <div key={week}>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{week}</p>
                      <p className="text-xs text-slate-500">{formatDuration(weekHours)}</p>
                    </div>
                    <div className="space-y-2">
                      {weekShifts.map(shift => (
                        <div key={shift.id} className="card p-3 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-white">
                                {new Date(shift.date + 'T12:00:00').toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' })}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatDuration(shift.durationHours)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-slate-500">{shift.startTime} – {shift.endTime}</span>
                              {hourlyRate > 0 && (
                                <span className="text-xs text-emerald-400">
                                  €{(shift.durationHours * hourlyRate).toFixed(2)}
                                </span>
                              )}
                            </div>
                            {shift.notes && (
                              <p className="text-xs text-slate-500 mt-0.5 truncate">{shift.notes}</p>
                            )}
                          </div>
                          <button
                            onClick={() => deleteShift(shift.id)}
                            className="p-1.5 text-slate-600 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Add Shift Tab */}
        {activeTab === 'add' && (
          <div className="space-y-4 card p-4">
            <h3 className="font-semibold text-white">Add a shift manually</h3>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="input-field text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Start time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
                  className="input-field text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">End time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
                  className="input-field text-sm"
                />
              </div>
            </div>
            {form.startTime && form.endTime && (
              <p className="text-sm text-slate-400">
                Duration: <span className="text-white font-medium">{formatDuration(calcDuration(form.startTime, form.endTime))}</span>
                {hourlyRate > 0 && (
                  <span className="text-emerald-400 ml-2">
                    = €{(calcDuration(form.startTime, form.endTime) * hourlyRate).toFixed(2)}
                  </span>
                )}
              </p>
            )}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Notes (optional)</label>
              <input
                type="text"
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="e.g. worked extra 30 min unpaid"
                className="input-field text-sm"
              />
            </div>
            <button
              onClick={addShift}
              disabled={calcDuration(form.startTime, form.endTime) <= 0}
              className="btn-primary w-full"
            >
              <Plus size={16} /> Add Shift
            </button>
          </div>
        )}

        {/* Pay Check Tab */}
        {activeTab === 'compare' && (
          <div className="space-y-4">
            <div className="card p-4 space-y-3">
              <h3 className="font-semibold text-white">Compare to your payslip</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Logged hours</span>
                  <span className="text-white font-medium">{formatDuration(totalHours)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Hourly rate</span>
                  <span className="text-white font-medium">{hourlyRate > 0 ? `€${hourlyRate.toFixed(2)}/hr` : 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected pay</span>
                  <span className="text-white font-bold">€{expectedPay.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">What were you actually paid? (€)</label>
                <input
                  type="number"
                  value={actualPay}
                  onChange={e => setActualPay(e.target.value)}
                  placeholder="Enter amount from payslip"
                  step="0.01"
                  min="0"
                  className="input-field text-sm"
                />
              </div>

              {actual > 0 && (
                <div className={`p-3 rounded-xl ${
                  discrepancyStatus === 'underpaid' ? 'bg-red-500/10 border border-red-500/30' :
                  discrepancyStatus === 'overpaid' ? 'bg-amber-500/10 border border-amber-500/30' :
                  'bg-emerald-500/10 border border-emerald-500/30'
                }`}>
                  <div className="flex items-center gap-2">
                    {discrepancyStatus === 'ok'
                      ? <CheckCircle size={18} className="text-emerald-400" />
                      : <AlertTriangle size={18} className={discrepancyStatus === 'underpaid' ? 'text-red-400' : 'text-amber-400'} />
                    }
                    <div>
                      <p className={`font-semibold text-sm ${
                        discrepancyStatus === 'underpaid' ? 'text-red-300' :
                        discrepancyStatus === 'overpaid' ? 'text-amber-300' : 'text-emerald-300'
                      }`}>
                        {discrepancyStatus === 'ok' && '✓ Pay matches — looks correct'}
                        {discrepancyStatus === 'underpaid' && `You may have been underpaid €${Math.abs(discrepancy).toFixed(2)}`}
                        {discrepancyStatus === 'overpaid' && `You were paid €${discrepancy.toFixed(2)} more than expected`}
                      </p>
                      {discrepancyStatus === 'underpaid' && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          Expected €{expectedPay.toFixed(2)} · Received €{actual.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {discrepancyStatus === 'underpaid' && (
              <div className="card p-4 space-y-2 border-red-500/20">
                <p className="text-sm font-semibold text-white">What you can do</p>
                <p className="text-xs text-slate-400">
                  If you believe you've been underpaid, raise it with your employer in writing first.
                  If unresolved, you can make a free complaint to the WRC.
                </p>
                <a
                  href="https://www.workplacerelations.ie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Contact WRC →
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}

function getWeekLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000)
  if (diffDays < 7) return 'This week'
  if (diffDays < 14) return 'Last week'
  return date.toLocaleDateString('en-IE', { month: 'long', year: 'numeric' })
}
