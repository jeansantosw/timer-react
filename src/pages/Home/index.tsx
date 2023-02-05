import { HandPalm, Play } from 'phosphor-react'

import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from './styles'
import { createContext, useEffect, useState } from 'react'
import { NewCycleForm } from './components/NewCycleFrom'
import { Countdown } from './components/Countdown'

//  INTERFACE
interface NewCycleFormData {
  task: string
  minutesAmount: number
}

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedData?: Date
  finishedData?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
}

// END INTERFACE

export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {
  // Status of my application
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  // End state of my application

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Functions of my application
  function handleCreateNewCycle(data: NewCycleFormData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(id)
    setAmountSecondsPassed(0)

    reset()
  }

  function hadleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedData: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }
  // End of functions of my application

  // variables of my application

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds}`
    }
  }, [minutes, seconds, activeCycle])

  const task = watch('task')
  const isSubmitDisabled = !task
  // End of variables of my application

  // console.log('cycles', cycles)

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <CyclesContext.Provider value={{ activeCycle }}>
          <NewCycleForm />
          <Countdown />
        </CyclesContext.Provider>

        {activeCycle ? (
          <StopCountdownButton onClick={hadleInterruptCycle} type="button">
            <HandPalm />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
