'use client';

import { useEffect, useState } from 'react'
import axios from "axios"
import styles from './page.module.css'

interface Note {
  id: number,
  content: string,
  date: string,
  important: boolean
}

export default function Home(): JSX.Element {
  const [data, setData] = useState<Note[]>([])

  useEffect(() => {
      axios.get('http://localhost:3001/api/notes').then(res => {
        setData(res.data)
      }) 
  }, [])
  return (
    <main className={styles.main}>
      <h1>Notes</h1>
      <ul>
        {data && data.map(note => (<li>
          <div>
            <h2>{note.id}</h2>
            <p>{note.content}</p>
            <p>{note.date}</p>
            <p>{note.important ? 'Importante': 'No importante'}</p>
          </div>
        </li>))}
      </ul>
    </main>
  )
}
