import ClickEvent from "./ClickEvent.tsx";
import PassingDataOnEvent from "./PassingDataOnEvent.tsx";
import PassingFunctions from "./PassingFunctions.tsx";
import EventObject from "./EventObject.tsx";
import Counter from "./Counter.tsx";
import BooleanStateVariables from "./BooleanStateVariables.tsx";
import StringStateVariables from "./StringStateVariables.tsx";
import DateStateVariable from "./DateStateVariable.tsx";
import ObjectStateVariable from "./ObjectStateVariable.tsx";
import ArrayStateVariable from "./ArrayStateVariable.tsx";
import ParentStateComponent from "./ParentStateComponent.tsx";
import ReduxExamples from "./ReduxExamples";

export default function Lab4() {
    function sayHello() {
        alert("Hello");
    }

    return (
        <div id="wd-lab4">
            <h3>Lab 4</h3>
            <ClickEvent/>
            <PassingDataOnEvent/>
            <PassingFunctions theFunction={sayHello} />
            <EventObject/>
            <Counter/>
            <BooleanStateVariables/>
            <StringStateVariables/>
            <DateStateVariable/>
            <ObjectStateVariable/>
            <ArrayStateVariable/>
            <ParentStateComponent/>
            <ReduxExamples/>


        </div>
    );
}