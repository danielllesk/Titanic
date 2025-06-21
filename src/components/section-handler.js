import React from 'react';
import { useState } from "react";
import PersonalInfo from './personal-info';
import Resume from './resume-upload';
import Scholarship from './scholarship';

function SectionHandler() {
    const [step, setStep] = useState(1); // First visible section is personal info or step 1
    return (
        <div>
            {step === 1 && <PersonalInfo onNext={() => setStep(2)}/>}
            {step === 2 && <Resume onBack={() => setStep(1)} onNext={() => setStep(3)}/>}
            {step === 3 && <Scholarship onBack={() => setStep(3)}/>}
        </div>
    );
}

export default SectionHandler;