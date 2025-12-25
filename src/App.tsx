
import { Button } from './components/ui/Button'
import { PlusIcon } from './icons/PlusIcon'
import { ShareIcon } from './icons/Shareicon'

function App() {

  return (
    <>
      <Button variant="primary" startIcon={<PlusIcon />} text="Add content" />
      <Button variant="secondary" startIcon={<ShareIcon />} text="Share brain" />
    </>
  )
}

export default App
