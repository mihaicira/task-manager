import './Tabs.scss';
import {useState,useEffect} from 'react';
import Tasks from "../Tasks/Tasks";


export default function Tabs(props){
    const [addTab,toggleAddTab] = useState(false)
    const [newTabName,setNewTabName] = useState(false)

    const [tabs,setTabs] = useState([])
    const [selectedTab,changeSelectedTab] = useState(null)

    useEffect(()=>{
        let tabs = getTabsFromStorage()
        setTabs(tabs)

    },[])

    const writeTabsToStorage = tabs =>{
        localStorage.setItem("tabs",JSON.stringify(tabs))
    }

    const getTabsFromStorage = () =>{
        let tabs = JSON.parse(localStorage.getItem("tabs"));
        return tabs ? tabs : []
    }

    const addNewTab = (title) =>{
        let currentTabs = tabs;
        let date = new Date();
        currentTabs.push({
            name: title,
            id: date.getTime(),
            content: []
        })
        setTabs(currentTabs);
        writeTabsToStorage(currentTabs);
    }

    const addTabHandler = ()=>{
        if(!addTab){
            toggleAddTab(true)
            setTimeout(()=>{
                document.getElementById("input").focus()
            },100)
        }
        else{
            addNewTab(newTabName)
            toggleAddTab(false)
        }
    }

    return(<>
        {
            !selectedTab &&
                <>
                    {
                        tabs.length=== 0 &&
                            <h2>No tabs...</h2>
                    }
                    <div id="tabs-container">

                        {
                            tabs.map(tab=><button className="tab" key={tab.id} onClick={()=>{changeSelectedTab(tab.id)}}> {tab.name}</button>)
                        }

                    </div>

                    <form id="add-new-tab" onSubmit={e=>e.preventDefault()}>
                        <button onClick={addTabHandler}>+</button>
                        {addTab && <input id="input" onChange={e=>{setNewTabName(e.target.value)}}/>}
                    </form>
                </>
        }
        {
            selectedTab && <Tasks selected={selectedTab} changeSelected={changeSelectedTab} setTabs={setTabs}/>
        }
        </>)
}