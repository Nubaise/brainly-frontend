
import { Button } from '../components/Button'

import { Card } from '../components/Card'
import { PlusIcon } from '../icons/PlusIcon'
import { ShareIcon } from '../icons/Shareicon'

import { CreateContentModal } from '../components/CreateContentModal'
import { useState } from 'react'

import { Sidebar } from '../components/Sidebar'

export function Dashboard () {
  const [modalOpen, setModalOpen] = useState(false);

  return <div>
    <Sidebar />
    <div className='p-4 ml-72 min-h-screen bg-gray-100'>
      <CreateContentModal open={modalOpen} onClose={ () => {
        setModalOpen(false);
      }}/>
      <div className="flex justify-end gap-4">
        <Button onClick={() => {
          setModalOpen(true);
        }} variant="primary" startIcon={<PlusIcon />} text="Add content" />
        <Button variant="secondary" startIcon={<ShareIcon />} text="Share brain" />
      </div>
      
      <div className='flex gap-4 mt-4'>
        <Card type='twitter' link="https://x.com/kirat_tw/status/2004140818991665323" title='First tweet'/>
        <Card type='youtube' link="https://www.youtube.com/watch?v=S3whb2XT47Q" title='Awesome video'/>
        
      </div>
    </div>
  </div>
}
