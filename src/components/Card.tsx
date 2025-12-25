import { ShareIcon } from '../icons/Shareicon'

export function Card() {
    return <div>
        <div className="max-w-72 border-gray-200 border-2 rounded-md shadow-md p-4 bg-white">
            <div className="flex justify-between">
                <div className="flex items-center gap-2 text-md">
                    <div className="text-gray-500">
                        <ShareIcon />
                    </div>
                    Project ideas
                </div>
                <div className="flex items-center">
                    <div className="pr-2 text-gray-500">
                        <ShareIcon />
                    </div>
                    <div className="text-gray-500">
                        <ShareIcon />
                    </div>
                </div>
            </div>
            <div className="pt-4">
                {/*<iframe className="w-full" src="https://www.youtube.com/embed/uAHW2LUyDEk?si=9ni9AFqBOOCsKBtC" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>*/}
                {/*<iframe className="w-full" src="https://www.linkedin.com/embed/feed/update/urn:li:share:7409317359225761792?collapsed=1" height="669" width="504" frameBorder="0" allowFullScreen title="Embedded post"></iframe>*/}

                <blockquote className="twitter-tweet">
                    <a href="https://twitter.com/username/status/807811447862468608"></a> 
                </blockquote>

            </div>
        </div>
    </div>
}