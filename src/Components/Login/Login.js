import "./Login.scss";
import { sha256 } from 'js-sha256';
import {useEffect,useState,useRef} from 'react';
import {faUserTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";


export default function Login(props){

    const [knownUser,setKnownUser] = useState(true)

    const input = useRef()

    const writeTabsToStorage = tabs =>{
        localStorage.setItem("tabs",JSON.stringify(tabs))
    }

    const getTabsFromStorage = () =>{
        let tabs = JSON.parse(localStorage.getItem("tabs"));
        return tabs ? tabs : []
    }

    useEffect(()=>{
        // let tabs = getTabsFromStorage()
        let user = getUserPass()

        if(user === "")
            setKnownUser(false)
        else
            setKnownUser(true)
    },[])

    const getUserPass = ()=>{
        let pass = JSON.parse(localStorage.getItem("user"))
        return pass ? pass : ""
    }

    const passChangeHandler = (e) =>{
        let value = e.target.value
        console.log(`value: ${value}, user: ${getUserPass()}`)
        if(knownUser){
            if(sha256(value) === getUserPass())
                props.continue()
        }
    }

    const createAccount = () =>{
        localStorage.setItem("user",JSON.stringify(sha256(input.current.value)))
        props.continue()
    }

    const refreshApp = () =>{
        if(window.confirm("You will delete all your tabs. Proceed?")){
            localStorage.setItem("user",null)
            localStorage.setItem("tabs",null)
            setKnownUser(false)
        }

    }




    return(
        <>
            <form id="login-container" onSubmit={e=>{e.preventDefault()}}>
                {
                    !knownUser && <h3>New account</h3>
                }
                <input onChange={passChangeHandler} type="password" ref={input}/>
                {
                    !knownUser &&
                    <>
                    <button onClick={createAccount}>Create</button>
                    </>
                }
            </form>

            {
                knownUser &&
                <button onClick={refreshApp} id="refresh-app-btn"><FontAwesomeIcon icon={faUserTimes}/></button>
            }
            </>
    )
}