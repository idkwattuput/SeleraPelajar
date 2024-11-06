import React from 'react'

export default function Footer() {
  return (
    <footer className="border-t-2 border-t-primary flex justify-center items-center p-4">
      <p>&copy; {new Date().getFullYear()} <span className="italic font-bold">Selera Pelajar</span>. All rights reserved.</p>
    </footer>
  )
}

