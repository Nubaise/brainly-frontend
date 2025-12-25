import { CrossIcon } from "../icons/CrossIcon"
import { Button } from "./Button"

export function CreateContentModal( {open, onClose } ) {

    return <div>
        {open && <div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 
        opacity-60 flex justify-center ">
            <div className="flex flex-col justify-center">
                <span className='bg-white opacity-100 p-4 rounded'>
                    <div className='flex justify-end'>
                        <div onClick={onClose} className="cursor-pointer">
                            <CrossIcon />
                        </div>
                    </div>
                    <div>
                        <Input placeholder="Title"/>
                        <Input placeholder="Link"/>
                    </div>
                    <div className="flex justify-center">
                        <Button variant="primary" text="submit" />
                    </div>
                    
                </span>
            </div>
        </div>}
    </div>
}

function Input( {onChange , placeholder}: {onChange: () => void } ) {
    return <div>
        <input type={"text"} placeholder={placeholder} className="border rounded m-2 px-4 py-2" onChange={onChange} />
    </div>
}