<<<<<<< HEAD
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
=======
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
>>>>>>> 5a4ca993b22b9560cdefaa73bdbd00b0006a8ca8
export default ProductSettings