import { Button } from "antd";
import React from "react";


const ProductSettings = ({BackToSetting})=>{
    console.log(BackToSetting );
   
return(
    <>
       <div className="flex items-center justify-between" >
       <h2>Product Settings</h2>
        <Button style={{float:"right"}} onClick={()=>BackToSetting()}> Back</Button>
       </div>
    </>
)
}
export default ProductSettings