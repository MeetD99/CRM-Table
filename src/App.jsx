import React from 'react'
import Table from './Table'

const App = () => {
  return (
    <div>
      <h1>CRM/ERP Table</h1>
      <a href="https://github.com/MeetD99/CRM-Table" target='_blank'><button style={{
        marginBottom: '30px',
        padding: '10px',
        backgroundColor: 'rgba(86, 27, 162, 1)',
        color: 'white',
        cursor: 'pointer',
        borderRadius: '50px'
      }}>Github and Docs!</button></a>
      <Table />
    </div>
  )
}

export default App