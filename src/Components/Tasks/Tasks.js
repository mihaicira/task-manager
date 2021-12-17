import './Tasks.scss';
import {faCheck,faMinus,faUndo,faHandPointLeft,faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState,useEffect} from 'react';

export default function Tasks(props){
    const [tasks,setTasks] = useState([])
    const [title,setTitle] = useState("")

    const [activeInput,toggleActiveInput] = useState(false)
    const [newTaskText,setNewTaskText] = useState("")


    const writeTabsToStorage = tabs =>{
        localStorage.setItem("tabs",JSON.stringify(tabs))
    }

    const getTabsFromStorage = () =>{
        let tabs = JSON.parse(localStorage.getItem("tabs"));
        return tabs ? tabs : []
    }

    useEffect(()=>{
        let storageTabs = getTabsFromStorage()
        let myTab = storageTabs.find(tab=>tab.id===props.selected)
        setTasks(myTab.content)
        setTitle(myTab.name)
    },[])

    const finishTask = (idx) =>{
        let tabs = getTabsFromStorage();
        let tabIdx = tabs.findIndex(tab=>tab.name===title);
        tabs[tabIdx].content[idx].done = true;

        setTasks(tabs[tabIdx].content)
        writeTabsToStorage(tabs)
    }

    const undoTask = (idx) =>{
        let tabs = getTabsFromStorage();
        let tabIdx = tabs.findIndex(tab=>tab.name===title);
        tabs[tabIdx].content[idx].done = false;

        setTasks(tabs[tabIdx].content)
        writeTabsToStorage(tabs)
    }

    const removeTask = (idx) =>{
        let tabs = getTabsFromStorage();
        let tabIdx = tabs.findIndex(tab=>tab.name===title);
        tabs[tabIdx].content.splice(idx,1)
        setTasks(tabs[tabIdx].content)
        writeTabsToStorage(tabs)
    }

    const addTask = (text) =>{
        if(text === "") return;

        let tabs = getTabsFromStorage();
        let tabIdx = tabs.findIndex(tab=>tab.name===title);

        tabs[tabIdx].content.push({
            text:text,
            done:false
        })
        toggleActiveInput(false)
        setTasks(tabs[tabIdx].content)
        writeTabsToStorage(tabs)
    }

    const removeTab = () =>{
        let tabs = getTabsFromStorage();
        let tabIdx = tabs.findIndex(tab=>tab.name===title);
        tabs.splice(tabIdx,1);
        writeTabsToStorage(tabs)
        props.setTabs(tabs)
        props.changeSelected(null)
    }

    const addNewTaskHandler = () =>{
        if(activeInput){
            addTask(newTaskText)
        }
        else{
            toggleActiveInput(true)
            setTimeout(()=>{
                document.getElementById("input").focus()
            },100)

        }
    }


    return(<>
        <button className="AwesomeBtn" id="backbtn" onClick={()=>{props.changeSelected(null)}}><FontAwesomeIcon icon={faHandPointLeft}/></button>
        <button className="AwesomeBtn" id="deletebtn" onClick={removeTab}><FontAwesomeIcon icon={faTrash}/></button>

        <div id="tasks-container">
            <h2>{title}</h2>

            {
                tasks.length===0 &&
                <div className="task">
                    <h3>No tasks here..</h3>
                </div>

            }
            {
                tasks.map((task,idx)=>
                    <div className="task" key={"task-"+idx}>
                        <h3 className={task.done ? "finished" : ""}>{task.text}</h3>
                        {
                            !task.done &&
                            <button><FontAwesomeIcon icon={faCheck} onClick={()=>finishTask(idx)}/></button>
                        }
                        {
                            task.done &&
                            <button><FontAwesomeIcon icon={faUndo} onClick={()=>undoTask(idx)}/></button>
                        }

                        <button><FontAwesomeIcon icon={faMinus} onClick={()=>removeTask(idx)}/></button>
                    </div>)

            }
            <form id="add-new-tab" onSubmit={e=>e.preventDefault()}>
                <button onClick={addNewTaskHandler}>+</button>
                {activeInput && <input id="input" onChange={e=>setNewTaskText(e.target.value)}/>}
            </form>

        </div>
        </>)
}