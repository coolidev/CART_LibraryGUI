import { State } from "src/pages/home";
import { PerformancePanel } from "src/types/evaluation";
import { navAndTrackingSection } from "./navAndTrackingSection";
import { performanceSection } from "./performanceSection";
import { userBurdenAntennaSection } from "./userBurdenAntennaSection";
import { userBurdenMissionImpactSection } from "./userBurdenMissionImpactSection";
//${userBurdenAntennaSection(performance, showGraph)}
//<br>
//<br>
//${navAndTrackingSection(performance, showGraph)}
export function performanceData(performance: PerformancePanel, showGraph: boolean, state: State): string {
    let performanceHTML =  `
    ${performanceSection(performance, showGraph, state)}
    `;

    return performanceHTML;
}

export function userBurdenData(performance: PerformancePanel, showGraph: boolean, state: State): string {
    let userBurdenHTML =  `
    ${state.networkType==='relay'?userBurdenMissionImpactSection(performance, showGraph, state):''}
    `;

    return userBurdenHTML;
}




