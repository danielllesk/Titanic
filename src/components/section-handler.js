import React from 'react';
import { useState } from "react";
import PersonalInfo from './personal-info';
import Resume from './resume-upload';

function SectionHandler() {
    const [step, setStep] = useState(1); // First visible section is personal info or step 1
    return (
        <div>
            {step === 1 && <PersonalInfo onNext={() => setStep(2)}/>}
            {step === 2 && <Resume onBack={() => setStep(1)}/>}
        </div>
    );
}

export default SectionHandler;