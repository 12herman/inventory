import React, {useState}from 'react'
import { Button, Modal } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
export default function LogoutPage() {
    const [open, setOpen] = useState(false);
  return (
    <>
    <Button type="link" onClick={() => setOpen(true)}>
       <FontAwesomeIcon className='text-blue-500' icon={faRightFromBracket}/>
    </Button>
    <Modal
      title="Logout"
      className='bg-white border-white shadow-white'
      centered
      open={open}
      onOk={() => setOpen(false)}
      onCancel={() => setOpen(false)}
      footer={[
        <Button key="cancel" onClick={() => setOpen(false)} >
          Cancel
        </Button>,
        <Button key="ok" className='bg-blue-500' onClick={() => { setOpen(false); window.location.href = '/'; }} style={{ borderColor: '#52c41a', color: '#fff' }}>
          OK
        </Button>,
      ]}>
      <p>Are you sure to logout</p>
    </Modal>
  </>
  )
};
