import React from 'react'
import Highlighter from "react-highlight-words"
import clsx from 'clsx'
import './index.css'
import {ScrollIntoView} from 'rrc'
import { useSearchParams, imageOrDefault } from "../../utils"
import QuoteFooter from "../QuoteFooter"

const ColorHash = require('color-hash')
const colorHash = new ColorHash({lightness: .4})

export default function Chat({items}) {
    const index = useIndex()
    return (
        <ScrollIntoView id={`#q${index}`}>
            <ol className="chat">
                {items.map(i => <ChatItem key={`${i.Index}-${i.DocumentID}`} {...i} />)}
            </ol>
        </ScrollIntoView>
    )
}

function ChatItem(props) {
    const {Index, Text, imgPath, Speaker, isSpeaker, isContinuation, highlight, isInProtocol} = props

    return (
        <li 
            className={clsx(
                isInProtocol ? 'in-protocol' : 'not-in-protocol', 
                isSpeaker === true ? 'self' : 'other',
                isContinuation && 'continuation')}
            id={isInProtocol ? `q${Index}` : null}
        >
            <div className="avatar">
                <div className="img" style={{backgroundImage: `url(${imageOrDefault(imgPath, Speaker)})`}}/>
            </div>
            <div className="msg">
                {Speaker &&
                    <p className="speaker" style={isSpeaker ? {} : {color: colorHash.hex(Speaker)}}>{Speaker}</p>}
                <p>
                <Highlighter 
                    highlightStyle={{
                    backgroundColor: '#f0c351'
                    }}
                    searchWords={highlight ? highlight.split("^") : []} 
                    autoEscape={true}
                    textToHighlight={Text} 
                />
                </p>
                <time><QuoteFooter {...props} /></time>
            </div>
        </li>
    )
}

export function useIndex() {
    const urlQuery = useSearchParams()
    const raw = urlQuery.get("index")
    if (!raw)
        return undefined
    return parseInt(raw)
}