
import { Button } from './components/Button'
import { Card } from './components/Card'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/Shareicon'

function App() {

  return (
    <>
      <Button variant="primary" startIcon={<PlusIcon />} text="Add content" />
      <Button variant="secondary" startIcon={<ShareIcon />} text="Share brain" />
      <Card />
    </>
  )
}

export default App
