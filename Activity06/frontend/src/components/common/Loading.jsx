const Loading = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '3rem 0',
    }}>
      <div style={{
        width: '3rem',
        height: '3rem',
        border: '2px solid #764ba2',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}></div>
    </div>
  )
}

export default Loading