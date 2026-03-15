function ErrorMessage({ message }){

  return(

    <div style={{
      background:"#ffe6e6",
      padding:"10px",
      margin:"10px 0",
      border:"1px solid red"
    }}>

      <p>{message}</p>

    </div>

  )

}

export default ErrorMessage;