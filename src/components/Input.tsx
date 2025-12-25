export function Input( {onChange , placeholder}: {placeholder:string; onChange: () => void } ) {
    return <div>
        <input type={"text"} placeholder={placeholder} className="border rounded m-2 px-4 py-2" onChange={onChange} />
    </div>
}