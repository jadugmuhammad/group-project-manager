"use client"

import ReactDatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

type Props = {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  showTime?: boolean
}

export default function DatePicker({ value, onChange, placeholder = "Pilih tanggal", showTime = false }: Props) {
  const selected = value ? new Date(value) : null

  return (
    <>
      <style>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input {
          width: 100%;
          background: #f4f4f4;
          border: none;
          border-bottom: 2px solid #8d8d8d;
          padding: 12px 16px;
          font-size: 14px;
          font-family: 'IBM Plex Sans', sans-serif;
          color: #161616;
          outline: none;
          box-sizing: border-box;
          cursor: pointer;
        }
        .react-datepicker__input-container input:focus {
          border-bottom-color: #0f62fe;
        }
        .react-datepicker__input-container input::placeholder { color: #a8a8a8; }
        .react-datepicker {
          font-family: 'IBM Plex Sans', sans-serif !important;
          border: 1px solid #e0e0e0 !important;
          border-radius: 0 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
        .react-datepicker__header {
          background: #161616 !important;
          border-bottom: none !important;
          border-radius: 0 !important;
          padding: 12px 0 !important;
        }
        .react-datepicker__current-month,
        .react-datepicker-time__header {
          color: #ffffff !important;
          font-weight: 400 !important;
          font-size: 13px !important;
          letter-spacing: 0.05em !important;
        }
        .react-datepicker__day-name { color: #8d8d8d !important; font-size: 11px !important; }
        .react-datepicker__day {
          color: #161616 !important;
          border-radius: 0 !important;
          font-size: 13px !important;
        }
        .react-datepicker__day:hover {
          background: #e0e0e0 !important;
          border-radius: 0 !important;
        }
        .react-datepicker__day--selected {
          background: #0f62fe !important;
          color: #ffffff !important;
          border-radius: 0 !important;
        }
        .react-datepicker__day--today { font-weight: 600 !important; color: #0f62fe !important; }
        .react-datepicker__day--today.react-datepicker__day--selected { color: #ffffff !important; }
        .react-datepicker__navigation-icon::before { border-color: #ffffff !important; }
        .react-datepicker__triangle { display: none !important; }
        .react-datepicker-popper { z-index: 9999 !important; }
        .react-datepicker__time-container {
          border-left: 1px solid #e0e0e0 !important;
        }
        .react-datepicker__time-container .react-datepicker__time {
          background: #ffffff !important;
        }
        .react-datepicker__time-list-item {
          font-size: 12px !important;
          font-family: 'IBM Plex Mono', monospace !important;
          color: #161616 !important;
          height: 28px !important;
          display: flex !important;
          align-items: center !important;
        }
        .react-datepicker__time-list-item:hover {
          background: #e0e0e0 !important;
        }
        .react-datepicker__time-list-item--selected {
          background: #0f62fe !important;
          color: #ffffff !important;
        }
      `}</style>

      <ReactDatePicker
        selected={selected}
        onChange={(date: Date | null) => onChange(date ? date.toISOString() : "")}
        dateFormat={showTime ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
        showTimeSelect={showTime}
        timeFormat="HH:mm"
        timeIntervals={15}
        placeholderText={placeholder}
        popperPlacement="bottom-start"
      />
    </>
  )
}