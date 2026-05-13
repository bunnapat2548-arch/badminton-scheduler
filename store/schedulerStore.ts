import { create } from 'zustand'
import dayjs from 'dayjs'
import type { Booking, BookingFormValues, DragState, ModalState } from '@/types'

interface SchedulerStore {
  selectedDate: string
  setSelectedDate: (date: string) => void
  goToToday: () => void
  goToPrevDay: () => void
  goToNextDay: () => void

  dragState: DragState
  setDragState: (state: DragState) => void
  resetDragState: () => void

  modal: ModalState
  openCreateModal: (initialValues?: Partial<BookingFormValues>) => void
  openEditModal: (booking: Booking) => void
  closeModal: () => void
}

const DEFAULT_DRAG_STATE: DragState = {
  isActive: false,
  courtIndex: 0,
  startSlot: 0,
  endSlot: 0,
}

const DEFAULT_MODAL_STATE: ModalState = {
  isOpen: false,
  mode: 'create',
  booking: null,
  initialValues: null,
}

export const useSchedulerStore = create<SchedulerStore>((set) => ({
  selectedDate: dayjs().format('YYYY-MM-DD'),
  setSelectedDate: (date) => set({ selectedDate: date }),
  goToToday: () => set({ selectedDate: dayjs().format('YYYY-MM-DD') }),
  goToPrevDay: () =>
    set((state) => ({
      selectedDate: dayjs(state.selectedDate).subtract(1, 'day').format('YYYY-MM-DD'),
    })),
  goToNextDay: () =>
    set((state) => ({
      selectedDate: dayjs(state.selectedDate).add(1, 'day').format('YYYY-MM-DD'),
    })),

  dragState: DEFAULT_DRAG_STATE,
  setDragState: (dragState) => set({ dragState }),
  resetDragState: () => set({ dragState: DEFAULT_DRAG_STATE }),

  modal: DEFAULT_MODAL_STATE,
  openCreateModal: (initialValues) =>
    set({
      modal: {
        isOpen: true,
        mode: 'create',
        booking: null,
        initialValues: initialValues ?? null,
      },
    }),
  openEditModal: (booking) =>
    set({
      modal: {
        isOpen: true,
        mode: 'edit',
        booking,
        initialValues: null,
      },
    }),
  closeModal: () => set({ modal: DEFAULT_MODAL_STATE }),
}))
