


function Alert(props){
    return (
    <>
    {props.alert&&(
    <div className="alert alert-light " role="alert" style={{width:"600px", margin:"auto", borderRadius:"30px",marginTop:"40px" ,position:"relative"}}>
  {props.alert.msg}
</div>)}
    </>);
}
export default Alert;