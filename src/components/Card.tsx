import { ShareIcon } from '../icons/Shareicon'

interface CardProps {
    title : string;
    link : string;
    type: "twitter" | "youtube" | "linkedin";
}

export function Card( { title, link, type } : CardProps ) {
    return <div>
        <div className="min-w-72 max-w-72 min-h-48 border-gray-200 border-2 rounded-md shadow-md p-4 bg-white">
            <div className="flex justify-between">
                <div className="flex items-center gap-2 text-md">
                    <div className="text-gray-500">
                        <ShareIcon />
                    </div>
                    {title}
                </div>
                <div className="flex items-center">
                    <div className="pr-2 text-gray-500">
                        <a href={link} target="_blank" >
                            <ShareIcon />
                        </a>
                        
                    </div>
                    <div className="text-gray-500">
                        <ShareIcon />
                    </div>
                </div>
            </div>
            <div className="pt-4">
                { type === "youtube" && <iframe className="w-full" src={link.replace("watch", "embed").replace("?v=","/")} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>}
                { type === "linkedin" && <iframe className="w-full" src={link} height="669" width="504" frameBorder="0" allowFullScreen title="Embedded post"></iframe>}

                { type === "twitter" && <blockquote className="twitter-tweet">
                    <a href={link.replace("x.com","twitter.com")}></a> 
                </blockquote>}

            </div>
        </div>
    </div>
}