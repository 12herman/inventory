import React from 'react'
import {Form} from 'antd'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen, faInfoCircle, faLocationDot, faLandmark, faCircleCheck, faPeopleGroup, faL } from "@fortawesome/free-solid-svg-icons"
const {form}= Form;
export default function AccountForm() {
  return (
    <section >
      <div className='mt-5 flex justify-center items-center'><FontAwesomeIcon className='text-2xl ' icon={faPeopleGroup} /></div>

      <Form form={form} className='h-[60.9vh] mt-5'>

        
      </Form>

    </section>
  )
}
